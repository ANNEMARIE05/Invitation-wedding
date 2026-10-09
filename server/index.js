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
const db = openDatabase();
const app = express();

app.use(createCorsMiddleware());
app.use(cookieParser());
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/auth/status", (req, res) => {
  const session = sessionFromRequest(db, req);
  res.json({ authenticated: Boolean(session) });
});

app.post("/api/auth/login", (req, res) => {
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
  const session = createSession(db);
  setSessionCookie(res, session.token, session.expires_at);
  res.json({ ok: true });
});

app.post("/api/auth/logout", (req, res) => {
  destroySession(db, req);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/settings", (_req, res) => {
  res.json(getSettingsRow(db));
});

app.put("/api/settings", requireAdmin(db), (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  res.json(saveSettingsRow(db, body));
});

app.get("/api/rsvps", requireAdmin(db), (_req, res) => {
  res.json(listRsvps(db));
});

app.get("/api/rsvp/policy", (_req, res) => {
  const lockAt = rsvpEditLockAt(db);
  res.json({
    edit_locked: isRsvpEditLocked(db),
    edit_lock_at: lockAt ? lockAt.toISOString() : null,
  });
});

app.get("/api/rsvp/by-phone/:phone", (req, res) => {
  const found = findRsvpByPhone(db, req.params.phone);
  if (!found) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({
    rsvp: found,
    edit_locked: isRsvpEditLocked(db),
  });
});

app.post("/api/rsvp", (req, res) => {
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
    const entry = upsertRsvp(
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
    throw e;
  }
});

app.get("/api/guestbook", (_req, res) => {
  res.json(listGuestbook(db));
});

app.post("/api/guestbook", (req, res) => {
  const nom = String(req.body?.nom || "").trim();
  const message = String(req.body?.message || "").trim();
  if (!nom || !message) {
    res.status(400).json({ error: "missing_field" });
    return;
  }
  res.status(201).json(addGuestbook(db, { nom, message }));
});

app.get("/api/photos", (_req, res) => {
  res.json(getPhotoMap(db));
});

app.put("/api/photos/:slot", requireAdmin(db), (req, res) => {
  const dataUrl = req.body?.path || req.body?.dataUrl;
  if (!dataUrl || typeof dataUrl !== "string") {
    res.status(400).json({ error: "missing_path" });
    return;
  }
  res.json(setPhotoSlot(db, req.params.slot, dataUrl));
});

const buildDir = path.join(__dirname, "..", "build");
if (require("fs").existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(buildDir, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  const origins = parseAllowedOrigins();
  // eslint-disable-next-line no-console
  console.log(`API SQLite sur le port ${PORT}`);
  if (origins.length) {
    // eslint-disable-next-line no-console
    console.log(`CORS autorisé : ${origins.join(", ")}`);
  }
});
