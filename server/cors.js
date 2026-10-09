/** CORS et détection front/API sur domaines différents (Vercel + Railway). */

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isCrossOriginSetup() {
  return parseAllowedOrigins().length > 0;
}

function createCorsMiddleware() {
  const allowed = parseAllowedOrigins();
  const allowSet = new Set(allowed);

  if (allowed.length === 0) {
    return (req, res, next) => {
      const origin = req.headers.origin;
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
      }
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
      }
      next();
    };
  }

  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowSet.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(origin && allowSet.has(origin) ? 204 : 403);
      return;
    }
    if (origin && !allowSet.has(origin)) {
      res.status(403).json({ error: "cors_forbidden" });
      return;
    }
    next();
  };
}

module.exports = {
  parseAllowedOrigins,
  isCrossOriginSetup,
  createCorsMiddleware,
};
