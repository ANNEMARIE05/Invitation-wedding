import { COUPLE, WEDDING_DATE_ISO, VENUE, IMAGES, VENUE_MEDIA, ZOOM, getZoomJoinUrl } from "./invite-data";
import { messages } from "./translations";

const mapsSearch = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const mapsEmbed = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;

export function defaultLocation(id) {
  const media = VENUE_MEDIA.find((v) => v.id === id);
  const item = messages.fr.venues.items.find((v) => v.id === id);
  return {
    name: item?.name || "",
    address: media?.address || "",
    time: item?.time || "",
    maps_url: media?.mapsUrl || "",
    embed_url: media?.embedUrl || "",
  };
}

function mergeLocation(stored, id) {
  const def = defaultLocation(id);
  const loc = stored?.locations?.[id] || {};
  const name = (loc.name || "").trim() || def.name;
  const address = (loc.address || "").trim() || def.address;
  const time = (loc.time || "").trim() || def.time;
  const maps_url = (loc.maps_url || "").trim() || def.maps_url || mapsSearch(`${name} ${address}`);
  const embed_url = (loc.embed_url || "").trim() || def.embed_url || mapsEmbed(`${name} ${address}`);
  return { name, address, time, maps_url, embed_url };
}

/** Champs éditables reflétés sur l’invitation (useSettings). */
export function mergeSettings(stored) {
  const s = stored && typeof stored === "object" ? stored : {};
  const zoom_url = (s.zoom_url || "").trim() || ZOOM.url || "";
  const zoom_code = (s.zoom_code || "").trim() || ZOOM.code || "";
  return {
    bride: (s.bride || "").trim() || COUPLE.bride,
    groom: (s.groom || "").trim() || COUPLE.groom,
    date_iso: s.date_iso || WEDDING_DATE_ISO,
    venue_name: (s.venue_name || "").trim() || VENUE.name,
    venue_address: (s.venue_address || "").trim() || VENUE.address,
    locations: {
      civil: mergeLocation(s, "civil"),
      ceremony: mergeLocation(s, "ceremony"),
    },
    zoom_url,
    zoom_code,
    zoom_join_url: getZoomJoinUrl({ url: zoom_url, code: zoom_code }),
  };
}

/** Cartes « Où nous retrouver » + cartes lieux (texte i18n, données éditables). */
export function buildVenueCards(m, merged) {
  return VENUE_MEDIA.map((base) => {
    const text = m.venues.items.find((v) => v.id === base.id) || {};
    const loc = merged.locations[base.id] || mergeLocation({}, base.id);
    return {
      id: base.id,
      image: base.image,
      eyebrow: text.eyebrow || "",
      name: loc.name,
      time: loc.time,
      note: text.note || "",
      address: loc.address,
      mapsUrl: loc.maps_url,
      embedUrl: loc.embed_url,
    };
  });
}

export const SETTINGS_CHANGE_EVENT = "wedding-settings-change";

export function notifySettingsSaved() {
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

/** Emplacements photo réellement affichés sur la page d’accueil. */
export const PHOTO_SLOTS = [
  {
    key: "footer",
    label: "Pied de page",
    hint: "Photo du cadre « avec amour » en bas de l’invitation",
    fallback: IMAGES.footerPhoto,
  },
  {
    key: "venue-civil",
    label: "Section Lieux — mairie",
    hint: "Carte « Cérémonie civile »",
    fallback: VENUE_MEDIA[0].image,
  },
  {
    key: "venue-ceremony",
    label: "Section Lieux — cérémonie",
    hint: "Carte « Discours de mariage » / réception",
    fallback: VENUE_MEDIA[1].image,
  },
];

export function resolvePhotoSlot(slot, uploads = {}) {
  const def = PHOTO_SLOTS.find((p) => p.key === slot);
  const custom = uploads[slot];
  if (custom) return { src: custom, customized: true };
  return { src: def?.fallback || "", customized: false };
}

/** Payload SQLite depuis le formulaire admin. */
export function settingsFromForm(form) {
  return {
    bride: form.bride.trim(),
    groom: form.groom.trim(),
    date_iso: form.date_iso,
    venue_name: form.venue_name.trim(),
    venue_address: form.venue_address.trim(),
    locations: {
      civil: {
        name: form.civil.name.trim(),
        address: form.civil.address.trim(),
        time: form.civil.time.trim(),
        maps_url: form.civil.maps_url.trim(),
        embed_url: form.civil.embed_url.trim(),
      },
      ceremony: {
        name: form.ceremony.name.trim(),
        address: form.ceremony.address.trim(),
        time: form.ceremony.time.trim(),
        maps_url: form.ceremony.maps_url.trim(),
        embed_url: form.ceremony.embed_url.trim(),
      },
    },
    zoom_url: form.zoom_url.trim(),
    zoom_code: form.zoom_code.trim(),
  };
}

export function formFromSettings(stored) {
  const merged = mergeSettings(stored);
  return {
    bride: merged.bride,
    groom: merged.groom,
    date_iso: merged.date_iso,
    venue_name: merged.venue_name,
    venue_address: merged.venue_address,
    civil: { ...merged.locations.civil },
    ceremony: { ...merged.locations.ceremony },
    zoom_url: merged.zoom_url,
    zoom_code: merged.zoom_code,
  };
}

/** Valeurs enregistrables (SQLite) alignées sur invite-data.js */
export function codeDefaultSettings() {
  return settingsFromForm(formFromSettings({}));
}
