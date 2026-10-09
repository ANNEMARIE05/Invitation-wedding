/** Persistance locale (sans serveur) — clés, migration, événements inter-onglets. */

import { codeDefaultSettings } from "./invite-defaults";
import { LOCALE_STORAGE_KEY } from "./translations";
import { LEGACY_PHOTOS_KEY } from "./photo-db";

export const WEDDING_STORE_EVENT = "wedding-store-change";

export const STORE_KEYS = {
  rsvps: "wedding.store.rsvps",
  guestbook: "wedding.store.guestbook",
  settings: "wedding.store.settings",
  meta: "wedding.store.meta",
};

const LEGACY_KEYS = {
  rsvps: "wedding.mock.rsvps",
  guestbook: "wedding.mock.guestbook",
  photos: "wedding.mock.photos",
  settings: "wedding.mock.settings",
};

const GUEST_RSVP_KEY = "wedding.guest.rsvp-last";

const ALL_LOCAL_STORAGE_KEYS = [
  ...Object.values(STORE_KEYS),
  ...Object.values(LEGACY_KEYS),
  LEGACY_PHOTOS_KEY,
  GUEST_RSVP_KEY,
  LOCALE_STORAGE_KEY,
];

/** Identifiants des entrées de démo (supprimées à la migration). */
const DEMO_IDS = new Set(["rsvp-1", "rsvp-2", "rsvp-3", "gb-1", "gb-2"]);

let migrationDone = false;
let settingsShapeSyncing = false;

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function stripDemoEntries(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((row) => row && !DEMO_IDS.has(row.id));
}

function migrateFromLegacy() {
  if (migrationDone) return;
  migrationDone = true;

  const meta = readJson(STORE_KEYS.meta, {});
  if (meta.schema >= 1) return;

  const legacyRsvps = readJson(LEGACY_KEYS.rsvps, null);
  const legacyGuestbook = readJson(LEGACY_KEYS.guestbook, null);

  if (legacyRsvps != null && readJson(STORE_KEYS.rsvps, null) == null) {
    writeJson(STORE_KEYS.rsvps, stripDemoEntries(legacyRsvps));
  }
  if (legacyGuestbook != null && readJson(STORE_KEYS.guestbook, null) == null) {
    writeJson(STORE_KEYS.guestbook, stripDemoEntries(legacyGuestbook));
  }
  if (readJson(STORE_KEYS.settings, null) == null) {
    const legacySettings = readJson(LEGACY_KEYS.settings, null);
    if (legacySettings != null) writeJson(STORE_KEYS.settings, legacySettings);
  }

  try {
    localStorage.removeItem(LEGACY_KEYS.rsvps);
    localStorage.removeItem(LEGACY_KEYS.guestbook);
    localStorage.removeItem(LEGACY_KEYS.settings);
    localStorage.removeItem(LEGACY_KEYS.photos);
  } catch {
    /* quota / private mode */
  }

  writeJson(STORE_KEYS.meta, { ...meta, schema: 1, migratedAt: new Date().toISOString() });
}

function syncSettingsShape() {
  const meta = readJson(STORE_KEYS.meta, {});
  if (meta.settingsShape >= 2) return;
  if (settingsShapeSyncing) return;

  settingsShapeSyncing = true;
  try {
  const defaults = codeDefaultSettings();
  const storedRaw = readJson(STORE_KEYS.settings, {});
  const stored =
    storedRaw && typeof storedRaw === "object" && !Array.isArray(storedRaw) ? storedRaw : {};
  const next = { ...stored };

  const mergeLoc = (id) => ({
    ...defaults.locations[id],
    ...(stored.locations?.[id] || {}),
  });

  next.locations = {
    civil: mergeLoc("civil"),
    ceremony: mergeLoc("ceremony"),
  };

  for (const key of ["bride", "groom", "date_iso", "venue_name", "venue_address", "zoom_url", "zoom_code"]) {
    if (next[key] == null || next[key] === "") {
      next[key] = defaults[key];
    }
  }

  writeJson(STORE_KEYS.settings, next);
  writeJson(STORE_KEYS.meta, { ...meta, settingsShape: 2 });
  } finally {
    settingsShapeSyncing = false;
  }
}

export function ensureStoreReady() {
  migrateFromLegacy();
  syncSettingsShape();
}

/** Efface toutes les clés localStorage utilisées par l’invitation. */
export function clearWeddingLocalStorage() {
  migrationDone = false;
  settingsShapeSyncing = false;
  try {
    for (const key of ALL_LOCAL_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    /* private mode / quota */
  }
  notifyStoreChange("rsvps");
  notifyStoreChange("guestbook");
  notifyStoreChange("settings");
  notifyStoreChange("photos");
}

export function readList(key) {
  ensureStoreReady();
  let value = readJson(key, []);
  if (!Array.isArray(value)) return [];
  if (key === STORE_KEYS.rsvps || key === STORE_KEYS.guestbook) {
    const cleaned = stripDemoEntries(value);
    if (cleaned.length !== value.length) writeJson(key, cleaned);
    return cleaned;
  }
  return value;
}

export function writeList(key, list) {
  ensureStoreReady();
  writeJson(key, list);
  notifyStoreChange(keyToScope(key));
}

export function readObject(key) {
  ensureStoreReady();
  const value = readJson(key, {});
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function writeObject(key, obj) {
  ensureStoreReady();
  writeJson(key, obj);
  notifyStoreChange(keyToScope(key));
}

function keyToScope(key) {
  if (key === STORE_KEYS.rsvps) return "rsvps";
  if (key === STORE_KEYS.guestbook) return "guestbook";
  if (key === STORE_KEYS.settings) return "settings";
  return "unknown";
}

export function notifyStoreChange(scope) {
  window.dispatchEvent(new CustomEvent(WEDDING_STORE_EVENT, { detail: { scope } }));
}

/** Même onglet (CustomEvent) + autres onglets (storage). */
export function subscribeStoreChange(onScope) {
  const onCustom = (e) => onScope(e.detail?.scope);
  const onStorage = (e) => {
    if (!e.key) return;
    if (Object.values(STORE_KEYS).includes(e.key)) {
      onScope(keyToScope(e.key));
    }
  };
  window.addEventListener(WEDDING_STORE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(WEDDING_STORE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export { wait };
