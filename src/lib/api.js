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

const SEED_RSVPS = [
  {
    id: "rsvp-1",
    nom: "Camille Dupont",
    email: "camille@exemple.com",
    present: true,
    accompagnants: 1,
    regime: "Végétarien",
    chanson: "La Vie en rose",
    message: "Hâte de danser avec vous !",
    created_at: "2026-08-12T10:15:00.000Z",
  },
  {
    id: "rsvp-2",
    nom: "Julien Moreau",
    email: "julien@exemple.com",
    present: true,
    accompagnants: 0,
    regime: "Aucun",
    chanson: "Dancing Queen",
    message: "",
    created_at: "2026-08-14T18:40:00.000Z",
  },
  {
    id: "rsvp-3",
    nom: "Sophie Martin",
    email: "sophie@exemple.com",
    present: false,
    accompagnants: 0,
    regime: "Aucun",
    chanson: "",
    message: "Nous serons de cœur avec vous.",
    created_at: "2026-08-20T09:05:00.000Z",
  },
];

const SEED_GUESTBOOK = [
  {
    id: "gb-1",
    nom: "Marie",
    message: "Que votre histoire continue d'être aussi belle que ce jour.",
    created_at: "2026-08-10T14:00:00.000Z",
  },
  {
    id: "gb-2",
    nom: "Thomas",
    message: "À l'amour, aux rires, et à toutes les danses à venir.",
    created_at: "2026-08-18T19:20:00.000Z",
  },
];

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
