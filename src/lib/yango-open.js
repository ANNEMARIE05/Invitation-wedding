/** Coordonnées de la Salle du Royaume — Cocody Danga (Av. Mermoz). */
export const SALLE_ROYAUME_LAT = 5.3407496;
export const SALLE_ROYAUME_LON = -4.0054354;

const YANG0_PACKAGE = "com.yandex.yango";
/** Jeton Adjust embarqué dans l’application Yango pour les liens de trajet. */
const ADJUST_TRACKER = "ki0yjo2_ns9zpoe";

/**
 * Lien universel Yango : ouvre l’application avec le point d’arrivée,
 * ou le store si Yango n’est pas installé.
 */
export function yangoRouteUrl(lat = SALLE_ROYAUME_LAT, lon = SALLE_ROYAUME_LON) {
  const params = new URLSearchParams({
    "end-lat": String(lat),
    "end-lon": String(lon),
    adj_t: ADJUST_TRACKER,
    ref: ADJUST_TRACKER,
  });
  return `https://u9xb.adj.st/route?${params.toString()}`;
}

export const SALLE_ROYAUME_YANGO_URL = yangoRouteUrl();

export function isYangoLink(url) {
  const raw = String(url || "").toLowerCase();
  return raw.includes("u9xb.adj.st") || raw.includes("yandexyango://") || raw.includes("yandextaxi://");
}

/** Ancien lien Google Maps de la salle, à remplacer par Yango. */
export function isLegacySalleRoyaumeGoogleMaps(url) {
  const raw = String(url || "").trim();
  if (!raw) return false;
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    const google =
      host === "maps.google.com" ||
      host === "www.google.com" ||
      host === "google.com" ||
      host === "maps.app.goo.gl";
    if (!google) return false;
    const blob = `${u.searchParams.get("q") || ""} ${u.searchParams.get("query") || ""} ${decodeURIComponent(u.pathname)}`;
    return blob.includes("5.340749") && blob.includes("-4.005435");
  } catch {
    return raw.includes("5.340749") && raw.includes("-4.005435");
  }
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent || "");
}

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function coordsFromYangoUrl(url) {
  try {
    const u = new URL(url);
    const lat = u.searchParams.get("end-lat");
    const lon = u.searchParams.get("end-lon");
    if (lat && lon) return { lat, lon };
  } catch {
    /* lien relatif ou invalide : coordonnées de la salle */
  }
  return { lat: String(SALLE_ROYAUME_LAT), lon: String(SALLE_ROYAUME_LON) };
}

/**
 * Sur Android, un intent ouvre Yango tout de suite (même depuis WhatsApp).
 * Sur iPhone, le lien https Adjust est laissé au navigateur : c’est un lien universel.
 */
export function openYangoRoute(event, url = SALLE_ROYAUME_YANGO_URL) {
  if (!isAndroid()) return;
  event.preventDefault();
  const { lat, lon } = coordsFromYangoUrl(url);
  const fallback = encodeURIComponent(url);
  window.location.href = `intent://route?end-lat=${encodeURIComponent(lat)}&end-lon=${encodeURIComponent(lon)}#Intent;scheme=yandexyango;package=${YANG0_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

export function yangoAnchorProps(url) {
  if (!isYangoLink(url)) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  if (isAndroid()) {
    return { onClick: (event) => openYangoRoute(event, url) };
  }
  if (isIOS()) {
    return {};
  }
  return { target: "_blank", rel: "noopener noreferrer" };
}
