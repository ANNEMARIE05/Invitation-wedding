/** Coordonnées de la Salle du Royaume — Cocody Danga (Av. Mermoz). */
export const SALLE_ROYAUME_LAT = 5.3407496;
export const SALLE_ROYAUME_LON = -4.0054354;

export const YANG0_PACKAGE = "com.yandex.yango";
/** Jeton Adjust embarqué dans l’application Yango pour les liens de trajet. */
export const ADJUST_TRACKER = "ki0yjo2_ns9zpoe";

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
  if (!raw) return false;
  return (
    raw.includes("u9xb.adj.st") ||
    raw.includes("yandexyango://") ||
    raw.includes("yandextaxi://") ||
    raw.includes("yango.go.link") ||
    raw.includes("yango.com") ||
    (raw.includes("5.340749") && raw.includes("-4.005435"))
  );
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

export function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

export function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

export function coordsFromYangoUrl(url) {
  try {
    const u = new URL(url);
    const lat = u.searchParams.get("end-lat") || u.searchParams.get("q")?.split(",")[0];
    const lon = u.searchParams.get("end-lon") || u.searchParams.get("q")?.split(",")[1];
    if (lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
      return { lat: String(lat).trim(), lon: String(lon).trim() };
    }
  } catch {
    /* lien relatif ou invalide : coordonnées de la salle */
  }
  return { lat: String(SALLE_ROYAUME_LAT), lon: String(SALLE_ROYAUME_LON) };
}

/**
 * Ouvre directement l'application Yango vers la destination.
 * Sur Android : Intent direct vers le package com.yandex.yango (ouvre l'app Yango sans passer par Google Maps).
 * Sur iOS : URL Scheme direct yandexyango:// puis fallback vers App Store.
 * Sur Desktop : Lien universel Yango.
 */
export function openYangoRoute(event, url = SALLE_ROYAUME_YANGO_URL) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  const { lat, lon } = coordsFromYangoUrl(url);
  const fallback = encodeURIComponent(yangoRouteUrl(lat, lon));

  if (isAndroid()) {
    const intentUrl = `intent://route?end-lat=${encodeURIComponent(lat)}&end-lon=${encodeURIComponent(lon)}&adj_t=${ADJUST_TRACKER}&ref=${ADJUST_TRACKER}#Intent;scheme=yandexyango;package=${YANG0_PACKAGE};S.browser_fallback_url=${fallback};end`;
    window.location.href = intentUrl;
    return;
  }

  if (isIOS()) {
    const appUrl = `yandexyango://route?end-lat=${encodeURIComponent(lat)}&end-lon=${encodeURIComponent(lon)}`;
    const start = Date.now();
    window.location.href = appUrl;
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = yangoRouteUrl(lat, lon);
      }
    }, 600);
    return;
  }

  window.open(yangoRouteUrl(lat, lon), "_blank", "noopener,noreferrer");
}

export function yangoAnchorProps(url = SALLE_ROYAUME_YANGO_URL) {
  return {
    href: url,
    onClick: (event) => openYangoRoute(event, url),
  };
}
