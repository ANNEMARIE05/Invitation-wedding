require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createCorsMiddleware, parseAllowedOrigins } = require("./cors");
const {
  openDatabase,
  getSettingsRow,
  saveSettingsRow,
  listRsvps,
  findRsvpByPhone,
  upsertRsvp,
  isRsvpEditLocked,
  rsvpEditLockAt,
  listGuestbook,
  addGuestbook,
  getPhotoMap,
  setPhotoSlot,
} = require("./db");
const {
  getExpectedPassword,
  createSession,
  sessionFromRequest,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  requireAdmin,
} = require("./auth");

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(createCorsMiddleware());
app.use(cookieParser());
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

async function main() {
  const db = await openDatabase();

  app.get("/api/auth/status", async (req, res, next) => {
    try {
      const session = await sessionFromRequest(db, req);
      res.json({ authenticated: Boolean(session) });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const expected = getExpectedPassword();
      if (!expected) {
        res.status(503).json({ error: "no_password" });
        return;
      }
      const password = String(req.body?.password || "").trim();
      if (password !== expected) {
        res.status(401).json({ error: "invalid" });
        return;
      }
      const session = await createSession(db);
      setSessionCookie(res, session.token, session.expires_at);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/auth/logout", async (req, res, next) => {
    try {
      await destroySession(db, req);
      clearSessionCookie(res);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/settings", async (_req, res, next) => {
    try {
      res.json(await getSettingsRow(db));
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/settings", requireAdmin(db), async (req, res, next) => {
    try {
      const body = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }
      res.json(await saveSettingsRow(db, body));
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/rsvps", requireAdmin(db), async (_req, res, next) => {
    try {
      res.json(await listRsvps(db));
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/rsvp/policy", async (_req, res, next) => {
    try {
      const [edit_locked, lockAt] = await Promise.all([
        isRsvpEditLocked(db),
        rsvpEditLockAt(db),
      ]);
      res.json({
        edit_locked,
        edit_lock_at: lockAt ? lockAt.toISOString() : null,
      });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/rsvp/by-phone/:phone", async (req, res, next) => {
    try {
      const found = await findRsvpByPhone(db, req.params.phone);
      if (!found) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      const locked = await isRsvpEditLocked(db);
      res.json({
        rsvp: found,
        edit_locked: locked,
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/rsvp", async (req, res, next) => {
    const body = req.body || {};
    const required = ["nom", "telephone", "present"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === "") {
        res.status(400).json({ error: "missing_field", field: key });
        return;
      }
    }
    try {
      const allowUpdate = Boolean(body.update);
      const entry = await upsertRsvp(
        db,
        {
          nom: String(body.nom).trim(),
          telephone: String(body.telephone).trim(),
          present: Boolean(body.present),
          mode: body.mode || "presentiel",
          accompagnants: body.accompagnants,
          regime: body.regime || "",
          chanson: body.chanson || "",
          message: body.message || "",
        },
        { allowUpdate },
      );
      res.json(entry);
    } catch (e) {
      if (e.code === "rsvp_locked") {
        res.status(403).json({ error: "rsvp_locked" });
        return;
      }
      if (e.code === "rsvp_exists") {
        res.status(409).json({ error: "rsvp_exists", existing: e.existing });
        return;
      }
      if (e.code === "invalid_phone") {
        res.status(400).json({ error: "invalid_phone" });
        return;
      }
      next(e);
    }
  });

  app.get("/api/guestbook", async (_req, res, next) => {
    try {
      res.json(await listGuestbook(db));
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/guestbook", async (req, res, next) => {
    try {
      const nom = String(req.body?.nom || "").trim();
      const message = String(req.body?.message || "").trim();
      if (!nom || !message) {
        res.status(400).json({ error: "missing_field" });
        return;
      }
      const created = await addGuestbook(db, { nom, message });
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/photos", async (_req, res, next) => {
    try {
      res.json(await getPhotoMap(db));
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/photos/:slot", requireAdmin(db), async (req, res, next) => {
    try {
      const dataUrl = req.body?.path || req.body?.dataUrl;
      if (!dataUrl || typeof dataUrl !== "string") {
        res.status(400).json({ error: "missing_path" });
        return;
      }
      res.json(await setPhotoSlot(db, req.params.slot, dataUrl));
    } catch (e) {
      next(e);
    }
  });

  const buildDir = path.join(__dirname, "..", "build");
  if (require("fs").existsSync(buildDir)) {
    app.use(express.static(buildDir));
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(buildDir, "index.html"));
    });
  }

  // Error handler middleware
  app.use((err, _req, res, _next) => {
    console.error("[SERVER ERROR]", err);
    res.status(500).json({ error: "internal_server_error", message: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    const origins = parseAllowedOrigins();
    const dbType = db.isPg ? "PostgreSQL" : "SQLite";
    console.log(`API [${dbType}] démarrée sur le port ${PORT}`);
    if (origins.length) {
      console.log(`CORS autorisé : ${origins.join(", ")}`);
    }
  });
}

main().catch((err) => {
  console.error("Erreur critique au démarrage du serveur :", err);
  process.exit(1);
});
