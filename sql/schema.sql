-- Schéma SQLite — invitation mariage (chargé au démarrage du serveur)

PRAGMA foreign_keys = ON;

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
  expires_at INTEGER NOT NULL
);
