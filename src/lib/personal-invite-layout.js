/** Coordonnées calées sur carte-invitation-envoi.jpg — faire-part floral romantique (725 × 1024). */
export const PERSONAL_INVITE_CARD = {
  width: 725,
  height: 1024,
  /** Zone nom : dans le cartouche « INVITATION PERSONNELLE » entre le titre et la ligne « valable pour … ». */
  fields: {
    top: 566,
    left: 104,
    width: 517,
    height: 64,
  },
  /** Cercle rose pour le nombre de personnes (entre « INVITATION VALABLE POUR » et « PERSONNE(S) »). */
  partyCount: {
    top: 625,
    left: 412,
    width: 36,
    height: 36,
    fontSize: 16,
  },
  name: {
    fontSize: 30,
    fontSizeMd: 26,
    fontSizeSm: 22,
    fontSizeXs: 18,
  },
};

function scaleRect(rect, renderedW, renderedH) {
  const sx = renderedW / PERSONAL_INVITE_CARD.width;
  const sy = renderedH / PERSONAL_INVITE_CARD.height;
  return {
    top: rect.top * sy,
    left: rect.left * sx,
    width: rect.width * sx,
    height: rect.height * sy,
  };
}

function pxStyle(rect, renderedW, renderedH) {
  const r = scaleRect(rect, renderedW, renderedH);
  return {
    top: `${r.top}px`,
    left: `${r.left}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  };
}

export function personalInviteCssVars() {
  const { width, name, partyCount } = PERSONAL_INVITE_CARD;
  return {
    "--pi-count-fs": `${(partyCount.fontSize / width) * 100}cqi`,
    "--pi-name-fs": `${(name.fontSize / width) * 100}cqi`,
    "--pi-name-fs-md": `${(name.fontSizeMd / width) * 100}cqi`,
    "--pi-name-fs-sm": `${(name.fontSizeSm / width) * 100}cqi`,
    "--pi-name-fs-xs": `${(name.fontSizeXs / width) * 100}cqi`,
  };
}

/** Positions en pourcentage pour affichage immédiat sans attendre la mesure. */
export function personalInviteNameFieldStylePercent() {
  const { fields, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(fields.top / height) * 100}%`,
    left: `${(fields.left / width) * 100}%`,
    width: `${(fields.width / width) * 100}%`,
    height: `${(fields.height / height) * 100}%`,
  };
}

export function personalInviteCountStylePercent() {
  const { partyCount, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(partyCount.top / height) * 100}%`,
    left: `${(partyCount.left / width) * 100}%`,
    width: `${(partyCount.width / width) * 100}%`,
    height: `${(partyCount.height / height) * 100}%`,
  };
}

/** Positions en pixels, calées sur la taille réelle de l’image affichée. */
export function personalInviteNameFieldStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.fields, renderedW, renderedH);
}

export function personalInviteCountStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.partyCount, renderedW, renderedH);
}

/** Nom sur une ligne ; « / » → « · ». */
export function guestNameDisplay(rawName) {
  return String(rawName || "")
    .trim()
    .replace(/\s*\/\s*/g, " · ");
}

export function guestNameSizeClass(displayName) {
  const len = displayName.length;
  if (len > 38) return "personal-invite-name--xs";
  if (len > 30) return "personal-invite-name--sm";
  if (len > 22) return "personal-invite-name--md";
  return "";
}
