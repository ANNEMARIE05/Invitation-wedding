import { normalizePhone } from "./api";

export function whatsAppSendUrl(phone, text) {
  const digits = normalizePhone(phone);
  if (!digits) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function triggerDownload(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export function openWhatsAppUrl(url) {
  if (!url) return false;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

/** Génère la carte PNG, la télécharge puis ouvre WhatsApp sur le numéro invité (sans dialogue de partage). */
export async function deliverInviteCardOnWhatsApp({
  captureCard,
  cardTestId,
  fileName,
  shareText,
  selfChatText,
  telephone,
}) {
  const dataUrl = await captureCard(cardTestId);
  if (!dataUrl) return { ok: false, reason: "capture_failed" };

  triggerDownload(dataUrl, fileName);
  const text = [shareText, selfChatText].filter(Boolean).join("\n\n");
  const url = whatsAppSendUrl(telephone, text);
  if (url && openWhatsAppUrl(url)) {
    return { ok: true, method: "download_and_wa", dataUrl };
  }
  return { ok: false, reason: url ? "popup_blocked" : "no_phone", dataUrl };
}
