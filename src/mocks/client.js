import { SEED_GUESTBOOK, SEED_RSVPS } from "./data";

const KEYS = {
  rsvps: "wedding.mock.rsvps",
  guestbook: "wedding.mock.guestbook",
  photos: "wedding.mock.photos",
  settings: "wedding.mock.settings",
};

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const listOrSeed = (key, seed) => {
  const current = read(key, null);
  if (!current) {
    write(key, seed);
    return seed;
  }
  return current;
};

export async function getRsvps() {
  await wait();
  return listOrSeed(KEYS.rsvps, SEED_RSVPS);
}

export async function createRsvp(payload) {
  await wait();
  const entry = {
    ...payload,
    id: `rsvp-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  write(KEYS.rsvps, [entry, ...listOrSeed(KEYS.rsvps, SEED_RSVPS)]);
  return entry;
}

export async function getGuestbook() {
  await wait();
  return listOrSeed(KEYS.guestbook, SEED_GUESTBOOK);
}

export async function createGuestbook({ nom, message }) {
  await wait();
  const entry = {
    id: `gb-${Date.now()}`,
    nom,
    message,
    created_at: new Date().toISOString(),
  };
  write(KEYS.guestbook, [entry, ...listOrSeed(KEYS.guestbook, SEED_GUESTBOOK)]);
  return entry;
}

export async function getPhotos() {
  await wait();
  return read(KEYS.photos, {});
}

export async function uploadPhoto(slot, file) {
  await wait();
  const path = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  write(KEYS.photos, { ...read(KEYS.photos, {}), [slot]: path });
  return { slot, path };
}

export async function getSettings() {
  await wait();
  return read(KEYS.settings, {});
}

export async function saveSettings(payload) {
  await wait();
  write(KEYS.settings, payload);
  return payload;
}
