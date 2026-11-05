const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEFAULT_DB_PATH = path.join(ROOT, "data", "wedding.db");
const SCHEMA_PATH = path.join(ROOT, "sql", "schema.sql");

function ensureDataDir(dbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadSchema(sqlite) {
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
  sqlite.exec(sql);
}

const PG_SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  telephone_norm TEXT NOT NULL UNIQUE,
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  present INTEGER NOT NULL,
  mode TEXT,
  accompagnants INTEGER NOT NULL DEFAULT 0,
  regime TEXT,
  chanson TEXT,
  message TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_rsvps_telephone_norm ON rsvps (telephone_norm);

CREATE TABLE IF NOT EXISTS guestbook (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  slot TEXT PRIMARY KEY,
  data_url TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS invite_links (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 10),
  rsvp_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invite_links_token ON invite_links (token);
CREATE INDEX IF NOT EXISTS idx_invite_links_rsvp ON invite_links (rsvp_id);
`;

async function openDatabase() {
  const connString = (process.env.DATABASE_URL || "").trim();
  if (connString) {
    console.log("[DB] Initialisation connexion PostgreSQL (DATABASE_URL détectée)...");
    const { Pool } = require("pg");
    const isLocal =
      connString.includes("localhost") ||
      connString.includes("127.0.0.1") ||
      connString.includes("sslmode=disable");

    const pool = new Pool({
      connectionString: connString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });

    try {
      const client = await pool.connect();
      try {
        await client.query(PG_SCHEMA);
      } finally {
        client.release();
      }
      console.log("[DB] Connecté avec succès à PostgreSQL (Render / Cloud).");
      return { isPg: true, pool };
    } catch (err) {
      console.error("[DB ERROR] Échec de la connexion PostgreSQL :", err.message);
      if (process.env.NODE_ENV === "production") {
        throw err;
      }
      console.warn(
        "[DB WARN] Impossible de joindre PostgreSQL en environnement de dev local (ex: absence de connectivité IPv6 locale pour Supabase direct)."
      );
      console.warn("[DB WARN] Bascule automatique sur SQLite local (data/wedding.db) pour le développement.");
    }
  }

  // Fallback SQLite local
  console.log("[DB] Utilisation de SQLite local (data/wedding.db).");
  const { DatabaseSync } = require("node:sqlite");
  const dbPath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : DEFAULT_DB_PATH;
  ensureDataDir(dbPath);
  const sqlite = new DatabaseSync(dbPath);
  loadSchema(sqlite);
  return { isPg: false, sqlite };
}

function normalizePhone(telephone) {
  return String(telephone || "").replace(/\D/g, "");
}

function defaultSettingsPayload() {
  return {};
}

async function getSettingsRow(db) {
  if (db.isPg) {
    const res = await db.pool.query("SELECT payload FROM settings WHERE id = 1");
    if (!res.rows[0]) return defaultSettingsPayload();
    try {
      const parsed = JSON.parse(res.rows[0].payload);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  const row = db.sqlite.prepare("SELECT payload FROM settings WHERE id = 1").get();
  if (!row) return defaultSettingsPayload();
  try {
    const parsed = JSON.parse(row.payload);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

async function saveSettingsRow(db, payload) {
  const now = new Date().toISOString();
  if (db.isPg) {
    await db.pool.query(
      `INSERT INTO settings (id, payload, updated_at) VALUES (1, $1, $2)
       ON CONFLICT(id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
      [JSON.stringify(payload), now],
    );
    return payload;
  }
  db.sqlite.prepare(
    `INSERT INTO settings (id, payload, updated_at) VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
  ).run(JSON.stringify(payload), now);
  return payload;
}

async function weddingDateIso(db) {
  const s = await getSettingsRow(db);
  if (s.date_iso) return s.date_iso;
  return process.env.WEDDING_DATE_ISO || "2026-12-04T13:30:00.000Z";
}

async function rsvpEditLockAt(db) {
  const iso = await weddingDateIso(db);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() - 14);
  return d;
}

async function isRsvpEditLocked(db) {
  const lockAt = await rsvpEditLockAt(db);
  if (!lockAt) return false;
  return Date.now() >= lockAt.getTime();
}

function rowToRsvp(row) {
  if (!row) return null;
  return {
    id: row.id,
    nom: row.nom,
    telephone: row.telephone,
    present: Boolean(row.present),
    mode: row.mode || "presentiel",
    accompagnants: Number(row.accompagnants) || 0,
    regime: row.regime || "",
    chanson: row.chanson || "",
    message: row.message || "",
    created_at:
      typeof row.created_at === "object" && row.created_at?.toISOString
        ? row.created_at.toISOString()
        : String(row.created_at),
    updated_at: row.updated_at
      ? typeof row.updated_at === "object" && row.updated_at?.toISOString
        ? row.updated_at.toISOString()
        : String(row.updated_at)
      : null,
  };
}

async function listRsvps(db) {
  if (db.isPg) {
    const res = await db.pool.query("SELECT * FROM rsvps ORDER BY created_at DESC");
    return res.rows.map(rowToRsvp);
  }
  const rows = db.sqlite
    .prepare("SELECT * FROM rsvps ORDER BY datetime(created_at) DESC")
    .all();
  return rows.map(rowToRsvp);
}

async function findRsvpByPhone(db, telephone) {
  const key = normalizePhone(telephone);
  if (!key) return null;
  if (db.isPg) {
    let res = await db.pool.query("SELECT * FROM rsvps WHERE telephone_norm = $1", [key]);
    if (res.rows[0]) return rowToRsvp(res.rows[0]);

    if (key.length >= 8) {
      const suffix = key.slice(-8);
      res = await db.pool.query(
        "SELECT * FROM rsvps WHERE telephone_norm LIKE $1 OR $2 LIKE '%' || telephone_norm ORDER BY created_at DESC LIMIT 1",
        [`%${suffix}`, key],
      );
      if (res.rows[0]) return rowToRsvp(res.rows[0]);
    }
    return null;
  }

  let row = db.sqlite.prepare("SELECT * FROM rsvps WHERE telephone_norm = ?").get(key);
  if (row) return rowToRsvp(row);

  if (key.length >= 8) {
    const suffix = key.slice(-8);
    row = db.sqlite.prepare(
      "SELECT * FROM rsvps WHERE telephone_norm LIKE ? OR ? LIKE '%' || telephone_norm ORDER BY datetime(created_at) DESC LIMIT 1",
    ).get(`%${suffix}`, key);
    if (row) return rowToRsvp(row);
  }
  return null;
}

function createInviteTokenValue() {
  return crypto.randomBytes(16).toString("base64url");
}

function rowToInviteLink(row, rsvpNom = null) {
  if (!row) return null;
  return {
    id: row.id,
    token: row.token,
    label: row.label || "",
    party_size: Number(row.party_size) || 1,
    rsvp_id: row.rsvp_id || null,
    created_at:
      typeof row.created_at === "object" && row.created_at?.toISOString
        ? row.created_at.toISOString()
        : String(row.created_at),
    registered_nom: rsvpNom || null,
  };
}

async function getInviteLinkByToken(db, token) {
  const t = String(token || "").trim();
  if (!t) return null;
  if (db.isPg) {
    const res = await db.pool.query(
      `SELECT il.*, r.nom AS rsvp_nom
       FROM invite_links il
       LEFT JOIN rsvps r ON r.id = il.rsvp_id
       WHERE il.token = $1`,
      [t],
    );
    const row = res.rows[0];
    return row ? rowToInviteLink(row, row.rsvp_nom || null) : null;
  }
  const row = db.sqlite
    .prepare(
      `SELECT il.*, r.nom AS rsvp_nom
       FROM invite_links il
       LEFT JOIN rsvps r ON r.id = il.rsvp_id
       WHERE il.token = ?`,
    )
    .get(t);
  return row ? rowToInviteLink(row, row.rsvp_nom || null) : null;
}

async function listInviteLinks(db) {
  if (db.isPg) {
    const res = await db.pool.query(
      `SELECT il.*, r.nom AS rsvp_nom
       FROM invite_links il
       LEFT JOIN rsvps r ON r.id = il.rsvp_id
       ORDER BY il.created_at DESC`,
    );
    return res.rows.map((row) => rowToInviteLink(row, row.rsvp_nom || null));
  }
  const rows = db.sqlite
    .prepare(
      `SELECT il.*, r.nom AS rsvp_nom
       FROM invite_links il
       LEFT JOIN rsvps r ON r.id = il.rsvp_id
       ORDER BY datetime(il.created_at) DESC`,
    )
    .all();
  return rows.map((row) => rowToInviteLink(row, row.rsvp_nom || null));
}

async function createInviteLink(db, { label = "", party_size }) {
  const size = Math.min(10, Math.max(1, Number(party_size) || 1));
  const id = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let token = createInviteTokenValue();
  const created_at = new Date().toISOString();
  const safeLabel = String(label || "").trim().slice(0, 120);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      if (db.isPg) {
        await db.pool.query(
          `INSERT INTO invite_links (id, token, label, party_size, rsvp_id, created_at)
           VALUES ($1, $2, $3, $4, NULL, $5)`,
          [id, token, safeLabel, size, created_at],
        );
      } else {
        db.sqlite
          .prepare(
            `INSERT INTO invite_links (id, token, label, party_size, rsvp_id, created_at)
             VALUES (?, ?, ?, ?, NULL, ?)`,
          )
          .run(id, token, safeLabel, size, created_at);
      }
      return getInviteLinkByToken(db, token);
    } catch (e) {
      if (String(e.message || "").includes("UNIQUE") || e.code === "23505") {
        token = createInviteTokenValue();
        continue;
      }
      throw e;
    }
  }
  const err = new Error("invite_create_failed");
  err.code = "invite_create_failed";
  throw err;
}

async function deleteInviteLink(db, id) {
  if (db.isPg) {
    const res = await db.pool.query(
      "DELETE FROM invite_links WHERE id = $1 AND rsvp_id IS NULL RETURNING id",
      [id],
    );
    if (!res.rows[0]) {
      const err = new Error("invite_not_deletable");
      err.code = "invite_not_deletable";
      throw err;
    }
    return { ok: true };
  }
  const info = db.sqlite.prepare("DELETE FROM invite_links WHERE id = ? AND rsvp_id IS NULL").run(id);
  if (!info.changes) {
    const err = new Error("invite_not_deletable");
    err.code = "invite_not_deletable";
    throw err;
  }
  return { ok: true };
}

async function bindInviteLinkToRsvp(db, inviteToken, rsvpId) {
  const t = String(inviteToken || "").trim();
  if (!t || !rsvpId) return false;
  if (db.isPg) {
    const res = await db.pool.query(
      `UPDATE invite_links SET rsvp_id = $1 WHERE token = $2 AND (rsvp_id IS NULL OR rsvp_id = $1)`,
      [rsvpId, t],
    );
    return res.rowCount > 0;
  }
  const info = db.sqlite
    .prepare(`UPDATE invite_links SET rsvp_id = ? WHERE token = ? AND (rsvp_id IS NULL OR rsvp_id = ?)`)
    .run(rsvpId, t, rsvpId);
  return Number(info.changes) > 0;
}

async function deleteRsvpById(db, id) {
  if (db.isPg) {
    await db.pool.query("DELETE FROM rsvps WHERE id = $1", [id]);
    return;
  }
  db.sqlite.prepare("DELETE FROM rsvps WHERE id = ?").run(id);
}

/**
 * Vérifie le jeton d’invitation avant création / mise à jour RSVP.
 * @returns {Promise<{ party_size: number } | null>}
 */
async function assertInviteTokenForRsvp(db, inviteToken, payload, { allowUpdate, existing }) {
  const token = String(inviteToken || "").trim();
  if (!token) {
    const err = new Error("invite_required");
    err.code = "invite_required";
    throw err;
  }

  const invite = await getInviteLinkByToken(db, token);
  if (!invite) {
    const err = new Error("invite_invalid");
    err.code = "invite_invalid";
    throw err;
  }

  const maxAcc = Math.max(0, invite.party_size - 1);
  const acc = Number(payload.accompagnants) || 0;
  if (acc > maxAcc) {
    const err = new Error("invite_party_size");
    err.code = "invite_party_size";
    err.max_party_size = invite.party_size;
    throw err;
  }

  if (invite.rsvp_id) {
    if (existing && existing.id === invite.rsvp_id) {
      return { party_size: invite.party_size };
    }
    const err = new Error("invite_used");
    err.code = "invite_used";
    throw err;
  }

  if (existing && !allowUpdate) {
    const err = new Error("rsvp_exists");
    err.code = "rsvp_exists";
    err.existing = existing;
    throw err;
  }

  return { party_size: invite.party_size };
}

async function upsertRsvp(db, payload, { inviteToken }) {
  const key = normalizePhone(payload.telephone);
  if (!key) {
    const err = new Error("invalid_phone");
    err.code = "invalid_phone";
    throw err;
  }
  const existing = await findRsvpByPhone(db, payload.telephone);
  await assertInviteTokenForRsvp(db, inviteToken, payload, { allowUpdate: false, existing });

  if (existing) {
    if (inviteToken) {
      const bound = await getInviteLinkByToken(db, inviteToken);
      if (bound?.rsvp_id && bound.rsvp_id === existing.id) {
        return existing;
      }
    }
    const err = new Error("rsvp_exists");
    err.code = "rsvp_exists";
    err.existing = existing;
    throw err;
  }

  const id = `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const created_at = new Date().toISOString();
  if (db.isPg) {
    await db.pool.query(
      `INSERT INTO rsvps (
        id, telephone_norm, nom, telephone, present, mode, accompagnants,
        regime, chanson, message, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NULL)`,
      [
        id,
        key,
        payload.nom,
        payload.telephone,
        payload.present ? 1 : 0,
        payload.mode || "presentiel",
        Number(payload.accompagnants) || 0,
        payload.regime || "",
        payload.chanson || "",
        payload.message || "",
        created_at,
      ],
    );
  } else {
    db.sqlite.prepare(
      `INSERT INTO rsvps (
        id, telephone_norm, nom, telephone, present, mode, accompagnants,
        regime, chanson, message, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(
      id,
      key,
      payload.nom,
      payload.telephone,
      payload.present ? 1 : 0,
      payload.mode || "presentiel",
      Number(payload.accompagnants) || 0,
      payload.regime || "",
      payload.chanson || "",
      payload.message || "",
      created_at,
    );
  }
  const created = await findRsvpByPhone(db, payload.telephone);
  if (inviteToken && created?.id) {
    // Lien à usage unique : si un autre envoi a « pris » le lien entre-temps, on annule.
    const bound = await bindInviteLinkToRsvp(db, inviteToken, created.id);
    if (!bound) {
      await deleteRsvpById(db, created.id);
      const err = new Error("invite_used");
      err.code = "invite_used";
      throw err;
    }
  }
  return created;
}

function mapGuestbookRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    nom: row.nom,
    message: row.message,
    created_at:
      typeof row.created_at === "object" && row.created_at?.toISOString
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

async function listGuestbook(db) {
  if (db.isPg) {
    const res = await db.pool.query("SELECT id, nom, message, created_at FROM guestbook ORDER BY created_at DESC");
    return res.rows.map(mapGuestbookRow);
  }
  const rows = db.sqlite
    .prepare("SELECT id, nom, message, created_at FROM guestbook ORDER BY datetime(created_at) DESC")
    .all();
  return rows.map(mapGuestbookRow);
}

async function addGuestbook(db, { nom, message }) {
  const entry = {
    id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nom,
    message,
    created_at: new Date().toISOString(),
  };
  if (db.isPg) {
    await db.pool.query(
      "INSERT INTO guestbook (id, nom, message, created_at) VALUES ($1, $2, $3, $4)",
      [entry.id, entry.nom, entry.message, entry.created_at],
    );
  } else {
    db.sqlite.prepare("INSERT INTO guestbook (id, nom, message, created_at) VALUES (?, ?, ?, ?)").run(
      entry.id,
      entry.nom,
      entry.message,
      entry.created_at,
    );
  }
  return entry;
}

async function getPhotoMap(db) {
  if (db.isPg) {
    const res = await db.pool.query("SELECT slot, data_url FROM photos");
    const out = {};
    for (const row of res.rows) out[row.slot] = row.data_url;
    return out;
  }
  const rows = db.sqlite.prepare("SELECT slot, data_url FROM photos").all();
  const out = {};
  for (const row of rows) out[row.slot] = row.data_url;
  return out;
}

async function setPhotoSlot(db, slot, dataUrl) {
  const updated_at = new Date().toISOString();
  if (db.isPg) {
    await db.pool.query(
      `INSERT INTO photos (slot, data_url, updated_at) VALUES ($1, $2, $3)
       ON CONFLICT(slot) DO UPDATE SET data_url = EXCLUDED.data_url, updated_at = EXCLUDED.updated_at`,
      [slot, dataUrl, updated_at],
    );
    return { slot, path: dataUrl };
  }
  db.sqlite.prepare(
    `INSERT INTO photos (slot, data_url, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(slot) DO UPDATE SET data_url = excluded.data_url, updated_at = excluded.updated_at`,
  ).run(slot, dataUrl, updated_at);
  return { slot, path: dataUrl };
}

module.exports = {
  openDatabase,
  normalizePhone,
  getSettingsRow,
  saveSettingsRow,
  weddingDateIso,
  rsvpEditLockAt,
  isRsvpEditLocked,
  listRsvps,
  findRsvpByPhone,
  upsertRsvp,
  listGuestbook,
  addGuestbook,
  getPhotoMap,
  setPhotoSlot,
  listInviteLinks,
  createInviteLink,
  deleteInviteLink,
  getInviteLinkByToken,
};
