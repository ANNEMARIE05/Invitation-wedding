/**
 * Script de migration des données SQLite (data/wedding.db) vers PostgreSQL (Supabase / Render).
 *
 * Utilisation :
 * node scripts/migrate-sqlite-to-pg.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { Pool } = require("pg");

const ROOT = path.join(__dirname, "..");
const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(ROOT, process.env.DATABASE_PATH)
  : path.join(ROOT, "data", "wedding.db");

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

async function main() {
  const connString = (process.env.DATABASE_URL || "").trim();
  if (!connString) {
    console.error("[MIGRATION ERROR] DATABASE_URL non définie dans l'environnement.");
    process.exit(1);
  }

  if (!fs.existsSync(DB_PATH)) {
    console.error(`[MIGRATION ERROR] Fichier SQLite introuvable : ${DB_PATH}`);
    process.exit(1);
  }

  console.log(`[MIGRATION] Lecture SQLite depuis : ${DB_PATH}`);
  const sqlite = new DatabaseSync(DB_PATH);

  console.log(`[MIGRATION] Connexion à PostgreSQL (Supabase)...`);
  const isLocal =
    connString.includes("localhost") ||
    connString.includes("127.0.0.1") ||
    connString.includes("sslmode=disable");

  const pool = new Pool({
    connectionString: connString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
    console.log("[MIGRATION] Création / vérification des tables PostgreSQL...");
    await client.query(PG_SCHEMA);

    // 1. Settings
    try {
      const settingsRow = sqlite.prepare("SELECT * FROM settings WHERE id = 1").get();
      if (settingsRow) {
        await client.query(
          `INSERT INTO settings (id, payload, updated_at) VALUES (1, $1, $2)
           ON CONFLICT(id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
          [settingsRow.payload, settingsRow.updated_at]
        );
        console.log("✔ Settings migrés.");
      }
    } catch (e) {
      console.warn("Table settings :", e.message);
    }

    // 2. RSVPs
    try {
      const rsvps = sqlite.prepare("SELECT * FROM rsvps").all();
      let rsvpCount = 0;
      for (const r of rsvps) {
        await client.query(
          `INSERT INTO rsvps (id, telephone_norm, nom, telephone, present, mode, accompagnants, regime, chanson, message, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT(id) DO UPDATE SET
             nom = EXCLUDED.nom,
             telephone = EXCLUDED.telephone,
             telephone_norm = EXCLUDED.telephone_norm,
             present = EXCLUDED.present,
             mode = EXCLUDED.mode,
             accompagnants = EXCLUDED.accompagnants,
             regime = EXCLUDED.regime,
             chanson = EXCLUDED.chanson,
             message = EXCLUDED.message,
             updated_at = EXCLUDED.updated_at`,
          [
            r.id,
            r.telephone_norm,
            r.nom,
            r.telephone,
            r.present,
            r.mode,
            r.accompagnants,
            r.regime,
            r.chanson,
            r.message,
            r.created_at,
            r.updated_at,
          ]
        );
        rsvpCount++;
      }
      console.log(`✔ ${rsvpCount} RSVP(s) migré(s).`);
    } catch (e) {
      console.warn("Table rsvps :", e.message);
    }

    // 3. Guestbook
    try {
      const guestbook = sqlite.prepare("SELECT * FROM guestbook").all();
      let gbCount = 0;
      for (const g of guestbook) {
        await client.query(
          `INSERT INTO guestbook (id, nom, message, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT(id) DO NOTHING`,
          [g.id, g.nom, g.message, g.created_at]
        );
        gbCount++;
      }
      console.log(`✔ ${gbCount} message(s) du livre d'or migré(s).`);
    } catch (e) {
      console.warn("Table guestbook :", e.message);
    }

    // 4. Photos
    try {
      const photos = sqlite.prepare("SELECT * FROM photos").all();
      let photoCount = 0;
      for (const p of photos) {
        await client.query(
          `INSERT INTO photos (slot, data_url, updated_at)
           VALUES ($1, $2, $3)
           ON CONFLICT(slot) DO UPDATE SET data_url = EXCLUDED.data_url, updated_at = EXCLUDED.updated_at`,
          [p.slot, p.data_url, p.updated_at]
        );
        photoCount++;
      }
      console.log(`✔ ${photoCount} photo(s) migrée(s).`);
    } catch (e) {
      console.warn("Table photos :", e.message);
    }

    // 5. Invite links
    try {
      const links = sqlite.prepare("SELECT * FROM invite_links").all();
      let linkCount = 0;
      for (const l of links) {
        await client.query(
          `INSERT INTO invite_links (id, token, label, party_size, rsvp_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT(id) DO UPDATE SET
             token = EXCLUDED.token,
             label = EXCLUDED.label,
             party_size = EXCLUDED.party_size,
             rsvp_id = EXCLUDED.rsvp_id`,
          [l.id, l.token, l.label, l.party_size, l.rsvp_id, l.created_at]
        );
        linkCount++;
      }
      console.log(`✔ ${linkCount} lien(s) d'invitation migré(s).`);
    } catch (e) {
      console.warn("Table invite_links :", e.message);
    }

    console.log("[MIGRATION] Migration terminée avec succès !");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[MIGRATION ERROR]", err);
  process.exit(1);
});

