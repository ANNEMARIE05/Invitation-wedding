import { openWhatsAppUrl, whatsAppSendUrl } from "./invite-card-share";

/** Site public des invitations (liens copiés / WhatsApp). */
export const DEFAULT_SITE_URL = "https://www.stephane-et-marie.site";

/** Paramètre d’URL pour les liens personnalisés (?i=…) */
export const INVITE_QUERY_KEY = "i";

function resolvePublicSiteOrigin(override) {
  if (override) return String(override).replace(/\/$/, "");
  const fromEnv = (process.env.REACT_APP_SITE_URL || "").trim().replace(/\/$/, "");
  return fromEnv || DEFAULT_SITE_URL;
}

export function parseInviteTokenFromLocation(search = "") {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const raw = params.get(INVITE_QUERY_KEY) || params.get("invite") || "";
  const token = String(raw).trim();
  return token.length >= 8 ? token : "";
}

export function buildInviteUrl(token, origin) {
  const root = resolvePublicSiteOrigin(origin);
  return `${root}/?${INVITE_QUERY_KEY}=${encodeURIComponent(token)}`;
}

export const INVITE_SESSION_KEY = "wedding_invite_token";

export function persistInviteToken(token) {
  if (!token) return;
  try {
    sessionStorage.setItem(INVITE_SESSION_KEY, token);
  } catch {
    /* ignore */
  }
}

export function readPersistedInviteToken() {
  try {
    return sessionStorage.getItem(INVITE_SESSION_KEY) || "";
  } catch {
    return "";
  }
}

/** Message WhatsApp accompagnant un lien d’invitation personnalisé. */
export function buildInviteLinkShareText({ url, partySize = 1 }) {
  const n = Math.min(10, Math.max(1, Number(partySize) || 1));
  const quota =
    n > 1
      ? `Ce lien est valable pour ${n} personnes (invité principal inclus).`
      : "Ce lien est personnel et ne peut être utilisé qu’une seule fois.";
  return [
    "Bonjour,",
    "",
    "C’est avec une immense joie que nous vous invitons à notre mariage en 2026.",
    "",
    "Voici votre lien personnel pour découvrir l’invitation et nous dire si vous serez des nôtres :",
    String(url || "").trim(),
    "",
    quota,
    "",
    "Pour que nous puissions préparer ce jour avec tout notre amour, merci de confirmer votre présence avant le 26 novembre.",
    "",
    "On a hâte de vous retrouver !",
  ].join("\n");
}

/** Ouvre WhatsApp avec le message d’invitation (contact libre ou numéro cible). */
export function shareInviteLinkOnWhatsApp({ url, partySize, coupleLabel, phone }) {
  const text = buildInviteLinkShareText({ url, partySize, coupleLabel });
  const shareUrl = phone
    ? whatsAppSendUrl(phone, text)
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  return openWhatsAppUrl(shareUrl);
}
