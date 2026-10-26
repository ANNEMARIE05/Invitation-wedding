/** Coordonnées calées sur le modèle d'invitation personnelle (682 × 1024). */
export const PERSONAL_INVITE_CARD = {
  width: 682,
  height: 1024,
  nameField: {
    top: 462,
    left: 95,
    width: 492,
    height: 48,
  },
  /** Zone à gauche de « PERSONNE(S) » (texte imprimé : x 291→401, ligne de base ≈ 550). */
  countField: {
    top: 532,
    left: 160,
    width: 124,
    height: 24,
  },
  /** Boîte de saisie / affichage numéro Wave en bas à gauche */
  waveField: {
    top: 915,
    left: 173,
    width: 174,
    height: 31,
  },
  /** Boîte de saisie / affichage numéro Orange Money en bas à droite */
  orangeField: {
    top: 915,
    left: 386,
    width: 187,
    height: 31,
  },
  /** Fallback rétrocompatible */
  giftsField: {
    top: 915,
    left: 173,
    width: 400,
    height: 31,
  },
  name: {
    fontSize: 27,
    fontSizeMd: 23,
    fontSizeSm: 19,
    fontSizeXs: 16,
  },
  count: {
    fontSize: 18,
  },
  phone: {
    fontSize: 14,
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
  const { width, name, count, phone } = PERSONAL_INVITE_CARD;
  return {
    "--pi-name-fs": `${(name.fontSize / width) * 100}cqi`,
    "--pi-name-fs-md": `${(name.fontSizeMd / width) * 100}cqi`,
    "--pi-name-fs-sm": `${(name.fontSizeSm / width) * 100}cqi`,
    "--pi-name-fs-xs": `${(name.fontSizeXs / width) * 100}cqi`,
    "--pi-count-fs": `${(count.fontSize / width) * 100}cqi`,
    "--pi-phone-fs": `${((phone?.fontSize || 14) / width) * 100}cqi`,
    "--pi-gifts-fs": `${(13 / width) * 100}cqi`,
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

/** Positions en pourcentage pour le numéro Wave. */
export function personalInviteWaveFieldStylePercent() {
  const { waveField, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(waveField.top / height) * 100}%`,
    left: `${(waveField.left / width) * 100}%`,
    width: `${(waveField.width / width) * 100}%`,
    height: `${(waveField.height / height) * 100}%`,
  };
}

/** Positions en pixels pour le numéro Wave. */
export function personalInviteWaveFieldStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.waveField, renderedW, renderedH);
}

/** Positions en pourcentage pour le numéro Orange Money. */
export function personalInviteOrangeFieldStylePercent() {
  const { orangeField, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(orangeField.top / height) * 100}%`,
    left: `${(orangeField.left / width) * 100}%`,
    width: `${(orangeField.width / width) * 100}%`,
    height: `${(orangeField.height / height) * 100}%`,
  };
}

/** Positions en pixels pour le numéro Orange Money. */
export function personalInviteOrangeFieldStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.orangeField, renderedW, renderedH);
}

/** Positions en pourcentage pour rétrocompatibilité. */
export function personalInviteGiftsFieldStylePercent() {
  const { giftsField, width, height } = PERSONAL_INVITE_CARD;
  return {
    top: `${(giftsField.top / height) * 100}%`,
    left: `${(giftsField.left / width) * 100}%`,
    width: `${(giftsField.width / width) * 100}%`,
    height: `${(giftsField.height / height) * 100}%`,
  };
}

/** Positions en pixels pour rétrocompatibilité. */
export function personalInviteGiftsFieldStylePx(renderedW, renderedH) {
  return pxStyle(PERSONAL_INVITE_CARD.giftsField, renderedW, renderedH);
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
