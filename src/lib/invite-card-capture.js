/** Polices utilisées sur la carte personnalisée — chargées avant export PNG. */
const INVITE_CARD_FONT_LOADS = [
  '600 16px "Cormorant Garamond"',
  '600 19px "Cormorant Garamond"',
  '600 22px "Cormorant Garamond"',
  '600 25px "Cormorant Garamond"',
  '700 14px Cinzel',
  '700 15px Cinzel',
];

export async function ensureInviteCardFontsReady() {
  if (typeof document === "undefined" || !document.fonts?.load) return;
  try {
    await Promise.all(INVITE_CARD_FONT_LOADS.map((spec) => document.fonts.load(spec)));
    await document.fonts.ready;
  } catch {
    /* ignore — fallback serif */
  }
}
