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

function purgeExpiredSessions(db) {
  db.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(Date.now());
}

function createSession(db) {
  purgeExpiredSessions(db);
  const token = createSessionToken();
  const expires_at = Date.now() + SESSION_MS;
  db.prepare("INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)").run(token, expires_at);
  return { token, expires_at };
}

function sessionFromRequest(db, req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  purgeExpiredSessions(db);
  const row = db.prepare("SELECT expires_at FROM admin_sessions WHERE token = ?").get(token);
  if (!row || row.expires_at <= Date.now()) {
    if (token) db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
    return null;
  }
  return { token, expires_at: row.expires_at };
}

function destroySession(db, req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
}

function setSessionCookie(res, token, expires_at) {
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions(expires_at));
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions(Date.now()));
}

function requireAdmin(db) {
  return (req, res, next) => {
    if (sessionFromRequest(db, req)) return next();
    res.status(401).json({ error: "unauthorized" });
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
