/** Coordonnées calées sur le modèle d'invitation personnelle (682 × 1024). */
export const PERSONAL_INVITE_CARD = {
  width: 682,
  height: 1024,
  nameField: {
    top: 532,
    left: 136,
    width: 410,
    height: 64,
  },
  /** Zone à gauche de « PERSONNE(S) » (texte imprimé : x 295→397, ligne de base ≈ 641). */
  countField: {
    top: 624,
    left: 200,
    width: 87,
    height: 21,
  },
  name: {
    fontSize: 27,
    fontSizeMd: 23,
    fontSizeSm: 20,
    fontSizeXs: 17,
  },
  count: {
    fontSize: 17,
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
  const { width, name, count } = PERSONAL_INVITE_CARD;
  return {
    "--pi-name-fs": `${(name.fontSize / width) * 100}cqi`,
    "--pi-name-fs-md": `${(name.fontSizeMd / width) * 100}cqi`,
    "--pi-name-fs-sm": `${(name.fontSizeSm / width) * 100}cqi`,
    "--pi-name-fs-xs": `${(name.fontSizeXs / width) * 100}cqi`,
    "--pi-count-fs": `${(count.fontSize / width) * 100}cqi`,
  };
}

/** Positions en pourcentage pour le nom. */
export function personalInviteNameFieldStylePercent() {
  const { nameField, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(nameField.top / height) * 100}%`,
    left: `${(nameField.left / width) * 100}%`,
    width: `${(nameField.width / width) * 100}%`,
    height: `${(nameField.height / height) * 100}%`,
  };
}

/** Positions en pixels pour le nom. */
export function personalInviteNameFieldStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.nameField, renderedW, renderedH);
}

/** Positions en pourcentage pour le nombre de personnes. */
export function personalInviteCountFieldStylePercent() {
  const { countField, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(countField.top / height) * 100}%`,
    left: `${(countField.left / width) * 100}%`,
    width: `${(countField.width / width) * 100}%`,
    height: `${(countField.height / height) * 100}%`,
  };
}

/** Positions en pixels pour le nombre de personnes. */
export function personalInviteCountFieldStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.countField, renderedW, renderedH);
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
