const WAVE_ANDROID_PACKAGE = "com.wave.personal";
const WAVE_PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.wave.personal";
const WAVE_APP_STORE =
  "https://apps.apple.com/ci/app/wave-mobile-money/id1523884528";

/** Indicatif pays (CI) — aligné sur WHATSAPP_NUMBER dans invite-data */
const DEFAULT_COUNTRY_CODE = "225";

export function toWaveE164(rawNumber, countryCode = DEFAULT_COUNTRY_CODE) {
  const digits = String(rawNumber ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length >= 11 && digits.startsWith(countryCode)) {
    return `+${digits}`;
  }
  return `+${countryCode}${digits}`;
}

async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent || "");
}

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function isMobile() {
  return isAndroid() || isIOS();
}

function androidLaunchIntent() {
  return `intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${WAVE_ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(WAVE_PLAY_STORE)};end`;
}

/**
 * Ouvre Wave sur le téléphone (App Links / intent) et copie le numéro pour le transfert P2P.
 * Si `paymentLink` (pay.wave.com/m/…) est renseigné, Wave ouvre directement le flux de paiement.
 */
export async function openWaveApp({
  paymentLink,
  rawNumber,
  e164,
  copyBeforeOpen = true,
}) {
  const phoneE164 = e164 || toWaveE164(rawNumber);
  const digitsOnly = String(rawNumber ?? "").replace(/\D/g, "");
  const link = paymentLink?.trim();

  if (copyBeforeOpen && !link && digitsOnly) {
    await copyToClipboard(digitsOnly);
  }

  if (link) {
    window.location.assign(link);
    return { mode: "payment_link", copied: false };
  }

  if (isAndroid()) {
    if (phoneE164) {
      window.location.href = `intent://send?mobile=${encodeURIComponent(phoneE164)}#Intent;scheme=wave;package=${WAVE_ANDROID_PACKAGE};end`;
      window.setTimeout(() => {
        window.location.href = androidLaunchIntent();
      }, 600);
    } else {
      window.location.href = androidLaunchIntent();
    }
    return { mode: "android_app", copied: Boolean(digitsOnly) };
  }

  if (isIOS()) {
    if (phoneE164) {
      window.location.href = `wave://send?mobile=${encodeURIComponent(phoneE164)}`;
    } else {
      window.location.href = "wave://";
    }
    return { mode: "ios_app", copied: Boolean(digitsOnly) };
  }

  if (isMobile()) {
    window.location.href = WAVE_APP_STORE;
    return { mode: "mobile_store", copied: Boolean(digitsOnly) };
  }

  window.open(WAVE_APP_STORE, "_blank", "noopener,noreferrer");
  return { mode: "desktop_store", copied: Boolean(digitsOnly) };
}
