/** Photos personnalisées — IndexedDB (évite le quota localStorage). */

const DB_NAME = "wedding-invitation";
const STORE = "photos";
const DB_VERSION = 1;
const LEGACY_PHOTOS_KEY = "wedding.mock.photos";

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexedDB_unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
  });
}

async function withStore(mode, fn) {
  const db = await openDb();
  try {
    return await fn(db.transaction(STORE, mode).objectStore(STORE));
  } finally {
    db.close();
  }
}

export async function getPhotoMap() {
  try {
    return await withStore("readonly", (store) =>
      new Promise((resolve, reject) => {
        const out = {};
        const req = store.openCursor();
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            out[cursor.key] = cursor.value;
            cursor.continue();
          } else resolve(out);
        };
      }),
    );
  } catch {
    return readLegacyPhotosFromLocalStorage();
  }
}

export async function setPhotoSlot(slot, dataUrl) {
  await withStore("readwrite", (store) =>
    new Promise((resolve, reject) => {
      const req = store.put(dataUrl, slot);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    }),
  );
}

function readLegacyPhotosFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LEGACY_PHOTOS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Importe d’éventuelles photos restées en localStorage (ancienne version). */
export async function migrateLegacyPhotosOnce() {
  const legacy = readLegacyPhotosFromLocalStorage();
  const keys = Object.keys(legacy);
  if (keys.length === 0) return;
  for (const slot of keys) {
    if (legacy[slot]) await setPhotoSlot(slot, legacy[slot]);
  }
  try {
    localStorage.removeItem(LEGACY_PHOTOS_KEY);
  } catch {
    /* ignore */
  }
}

/** Supprime toutes les photos en IndexedDB. */
export function clearPhotoDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      resolve();
      return;
    }
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
    req.onblocked = () => resolve();
  });
}

export { LEGACY_PHOTOS_KEY };
