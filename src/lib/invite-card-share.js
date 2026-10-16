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

export async function dataUrlToFile(dataUrl, fileName = "carte-invitation.png") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}

/**
 * Partage la carte d'invitation sur WhatsApp :
 * - Sur smartphone (iOS / Android) : utilise le partage natif (Web Share API)
 *   avec le fichier image PNG attaché directement dans WhatsApp.
 * - Sur desktop / fallback : télécharge l'image et ouvre WhatsApp.
 */
export async function deliverInviteCardOnWhatsApp({
  captureCard,
  cardTestId = "personal-invite-card",
  fileName = "ma-carte-invitation.png",
  shareText = "",
  selfChatText = "",
  telephone = "",
}) {
  const dataUrl = await captureCard(cardTestId);
  if (!dataUrl) return { ok: false, reason: "capture_failed" };

  const text = [shareText, selfChatText].filter(Boolean).join("\n\n");

  // 1. Partage direct avec image attachée (mobile)
  if (typeof navigator !== "undefined" && navigator.canShare) {
    try {
      const file = await dataUrlToFile(dataUrl, fileName);
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Mon invitation au mariage",
          text,
          files: [file],
        });
        return { ok: true, method: "native_share", dataUrl };
      }
    } catch (err) {
      if (err && err.name === "AbortError") {
        return { ok: true, method: "cancelled", dataUrl };
      }
    }
  }

  // 2. Fallback ordinateur : téléchargement de l'image + ouverture WhatsApp
  triggerDownload(dataUrl, fileName);
  const url = telephone
    ? whatsAppSendUrl(telephone, text)
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (url && openWhatsAppUrl(url)) {
    return { ok: true, method: "download_and_wa", dataUrl };
  }
  return { ok: true, method: "download_only", dataUrl };
}
