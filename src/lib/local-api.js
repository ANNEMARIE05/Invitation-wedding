import {
  STORE_KEYS,
  readList,
  writeList,
  readObject,
  writeObject,
  notifyStoreChange,
  wait,
} from "./storage";
import {
  getPhotoMap,
  setPhotoSlot,
  migrateLegacyPhotosOnce,
  clearPhotoDatabase,
} from "./photo-db";
import { clearWeddingLocalStorage } from "./storage";

let photosMigrated = false;

async function ensurePhotosReady() {
  if (photosMigrated) return;
  photosMigrated = true;
  await migrateLegacyPhotosOnce();
}

export async function getRsvps() {
  await wait();
  return readList(STORE_KEYS.rsvps);
}

export function normalizePhone(telephone) {
  return String(telephone || "").replace(/\D/g, "");
}

export async function findRsvpByPhone(telephone) {
  await wait();
  const key = normalizePhone(telephone);
  if (!key) return null;
  return readList(STORE_KEYS.rsvps).find((r) => normalizePhone(r.telephone) === key) || null;
}

export async function createRsvp(payload) {
  await wait();
  const existing = await findRsvpByPhone(payload.telephone);
  if (existing) {
    const updated = {
      ...existing,
      ...payload,
      id: existing.id,
      created_at: existing.created_at,
      updated_at: new Date().toISOString(),
    };
    const list = readList(STORE_KEYS.rsvps);
    writeList(
      STORE_KEYS.rsvps,
      list.map((r) => (r.id === existing.id ? updated : r)),
    );
    return updated;
  }
  const entry = {
    ...payload,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
  writeList(STORE_KEYS.rsvps, [entry, ...readList(STORE_KEYS.rsvps)]);
  return entry;
}

export async function getGuestbook() {
  await wait();
  return readList(STORE_KEYS.guestbook);
}

export async function createGuestbook({ nom, message }) {
  await wait();
  const entry = {
    id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nom,
    message,
    created_at: new Date().toISOString(),
  };
  writeList(STORE_KEYS.guestbook, [entry, ...readList(STORE_KEYS.guestbook)]);
  return entry;
}

export async function getPhotos() {
  await wait();
  await ensurePhotosReady();
  return getPhotoMap();
}

export async function uploadPhoto(slot, file) {
  await wait();
  await ensurePhotosReady();
  const path = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  await setPhotoSlot(slot, path);
  notifyStoreChange("photos");
  return { slot, path };
}

export async function getSettings() {
  await wait();
  return readObject(STORE_KEYS.settings);
}

export async function saveSettings(payload) {
  await wait();
  writeObject(STORE_KEYS.settings, payload);
  return payload;
}

/** localStorage + IndexedDB (photos) — réinitialise la persistance locale. */
export async function wipeLocalWeddingData() {
  clearWeddingLocalStorage();
  photosMigrated = false;
  await clearPhotoDatabase();
}
