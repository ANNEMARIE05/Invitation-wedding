const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const ROOT = path.join(__dirname, "..");
const DEFAULT_DB_PATH = path.join(ROOT, "data", "wedding.db");
const SCHEMA_PATH = path.join(ROOT, "sql", "schema.sql");

function ensureDataDir(dbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadSchema(db) {
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
  db.exec(sql);
}

function openDatabase() {
  const dbPath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : DEFAULT_DB_PATH;
  ensureDataDir(dbPath);
  const db = new DatabaseSync(dbPath);
  loadSchema(db);
  return db;
}

function normalizePhone(telephone) {
  return String(telephone || "").replace(/\D/g, "");
}

function defaultSettingsPayload() {
  return {};
}

function getSettingsRow(db) {
  const row = db.prepare("SELECT payload FROM settings WHERE id = 1").get();
  if (!row) return defaultSettingsPayload();
  try {
    const parsed = JSON.parse(row.payload);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function saveSettingsRow(db, payload) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO settings (id, payload, updated_at) VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
  ).run(JSON.stringify(payload), now);
  return payload;
}

function weddingDateIso(db) {
  const s = getSettingsRow(db);
  if (s.date_iso) return s.date_iso;
  return process.env.WEDDING_DATE_ISO || "2026-12-04T13:30:00.000Z";
}

/** À partir de cette date, les RSVP existants ne sont plus modifiables (14 jours avant le mariage). */
function rsvpEditLockAt(db) {
  const d = new Date(weddingDateIso(db));
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() - 14);
  return d;
}

function isRsvpEditLocked(db) {
  const lockAt = rsvpEditLockAt(db);
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
    accompagnants: row.accompagnants,
    regime: row.regime || "",
    chanson: row.chanson || "",
    message: row.message || "",
    created_at: row.created_at,
    updated_at: row.updated_at || null,
  };
}

function listRsvps(db) {
  const rows = db
    .prepare("SELECT * FROM rsvps ORDER BY datetime(created_at) DESC")
    .all();
  return rows.map(rowToRsvp);
}

function findRsvpByPhone(db, telephone) {
  const key = normalizePhone(telephone);
  if (!key) return null;
  const row = db.prepare("SELECT * FROM rsvps WHERE telephone_norm = ?").get(key);
  return rowToRsvp(row);
}

function upsertRsvp(db, payload, { allowUpdate }) {
  const key = normalizePhone(payload.telephone);
  if (!key) {
    const err = new Error("invalid_phone");
    err.code = "invalid_phone";
    throw err;
  }
  const existing = findRsvpByPhone(db, payload.telephone);
  const locked = isRsvpEditLocked(db);

  if (existing) {
    if (locked) {
      const err = new Error("rsvp_locked");
      err.code = "rsvp_locked";
      throw err;
    }
    if (!allowUpdate) {
      const err = new Error("rsvp_exists");
      err.code = "rsvp_exists";
      err.existing = existing;
      throw err;
    }
    const updated_at = new Date().toISOString();
    db.prepare(
      `UPDATE rsvps SET
        nom = ?, telephone = ?, telephone_norm = ?,
        present = ?, mode = ?, accompagnants = ?,
        regime = ?, chanson = ?, message = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      payload.nom,
      payload.telephone,
      key,
      payload.present ? 1 : 0,
      payload.mode || "presentiel",
      Number(payload.accompagnants) || 0,
      payload.regime || "",
      payload.chanson || "",
      payload.message || "",
      updated_at,
      existing.id,
    );
    return findRsvpByPhone(db, payload.telephone);
  }

  const id = `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const created_at = new Date().toISOString();
  db.prepare(
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
  return findRsvpByPhone(db, payload.telephone);
}

function listGuestbook(db) {
  return db
    .prepare("SELECT id, nom, message, created_at FROM guestbook ORDER BY datetime(created_at) DESC")
    .all();
}

function addGuestbook(db, { nom, message }) {
  const entry = {
    id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nom,
    message,
    created_at: new Date().toISOString(),
  };
  db.prepare("INSERT INTO guestbook (id, nom, message, created_at) VALUES (?, ?, ?, ?)").run(
    entry.id,
    entry.nom,
    entry.message,
    entry.created_at,
  );
  return entry;
}

function getPhotoMap(db) {
  const rows = db.prepare("SELECT slot, data_url FROM photos").all();
  const out = {};
  for (const row of rows) out[row.slot] = row.data_url;
  return out;
}

function setPhotoSlot(db, slot, dataUrl) {
  const updated_at = new Date().toISOString();
  db.prepare(
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
};
