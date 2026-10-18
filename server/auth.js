const crypto = require("crypto");
const { isCrossOriginSetup } = require("./cors");

const SESSION_COOKIE = "wedding_admin";
const SESSION_MS = 1000 * 60 * 60 * 12;

function sessionCookieOptions(expires_at) {
  const cross = isCrossOriginSetup();
  return {
    httpOnly: true,
    sameSite: cross ? "none" : "lax",
    secure: cross || process.env.NODE_ENV === "production",
    maxAge: Math.max(0, expires_at - Date.now()),
    path: "/",
  };
}

function getExpectedPassword() {
  return (process.env.COUPLE_PASSWORD || "").trim();
}

function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function purgeExpiredSessions(db) {
  const now = Date.now();
  if (db.isPg) {
    await db.pool.query("DELETE FROM admin_sessions WHERE expires_at <= $1", [now]);
  } else {
    db.sqlite.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(now);
  }
}

async function createSession(db) {
  await purgeExpiredSessions(db);
  const token = createSessionToken();
  const expires_at = Date.now() + SESSION_MS;
  if (db.isPg) {
    await db.pool.query("INSERT INTO admin_sessions (token, expires_at) VALUES ($1, $2)", [token, expires_at]);
  } else {
    db.sqlite.prepare("INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)").run(token, expires_at);
  }
  return { token, expires_at };
}

async function sessionFromRequest(db, req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  await purgeExpiredSessions(db);
  let expires_at = null;
  if (db.isPg) {
    const res = await db.pool.query("SELECT expires_at FROM admin_sessions WHERE token = $1", [token]);
    if (!res.rows[0]) return null;
    expires_at = Number(res.rows[0].expires_at);
  } else {
    const row = db.sqlite.prepare("SELECT expires_at FROM admin_sessions WHERE token = ?").get(token);
    if (!row) return null;
    expires_at = Number(row.expires_at);
  }
  if (!expires_at || expires_at <= Date.now()) {
    if (token) {
      if (db.isPg) await db.pool.query("DELETE FROM admin_sessions WHERE token = $1", [token]);
      else db.sqlite.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
    }
    return null;
  }
  return { token, expires_at };
}

async function destroySession(db, req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    if (db.isPg) await db.pool.query("DELETE FROM admin_sessions WHERE token = $1", [token]);
    else db.sqlite.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
  }
}

function setSessionCookie(res, token, expires_at) {
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions(expires_at));
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions(Date.now()));
}

function requireAdmin(db) {
  return async (req, res, next) => {
    try {
      const session = await sessionFromRequest(db, req);
      if (session) return next();
      res.status(401).json({ error: "unauthorized" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  SESSION_COOKIE,
  getExpectedPassword,
  createSession,
  sessionFromRequest,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  requireAdmin,
};
