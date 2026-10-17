/** Coordonnées calées sur carte-invitation-envoi.jpg — faire-part florale raffinée (682 × 1024). */
export const PERSONAL_INVITE_CARD = {
  width: 682,
  height: 1024,
  /** Intérieur du cadre rose (sous « INVITATION PERSONNELLE » imprimé). */
  fields: {
    top: 456,
    left: 98,
    width: 486,
    height: 118,
  },
  name: {
    fontSize: 28,
    fontSizeMd: 24,
    fontSizeSm: 20,
    fontSizeXs: 17,
  },
  partyLine: {
    fontSize: 11.5,
    countFontSize: 14,
  },
};

export function personalInviteCssVars() {
  const { width, height, fields, name, partyLine } = PERSONAL_INVITE_CARD;
  return {
    "--pi-fields-top": `${(fields.top / height) * 100}%`,
    "--pi-fields-left": `${(fields.left / width) * 100}%`,
    "--pi-fields-width": `${(fields.width / width) * 100}%`,
    "--pi-fields-height": `${(fields.height / height) * 100}%`,
    "--pi-name-fs": `${(name.fontSize / width) * 100}cqi`,
    "--pi-name-fs-md": `${(name.fontSizeMd / width) * 100}cqi`,
    "--pi-name-fs-sm": `${(name.fontSizeSm / width) * 100}cqi`,
    "--pi-name-fs-xs": `${(name.fontSizeXs / width) * 100}cqi`,
    "--pi-party-fs": `${(partyLine.fontSize / width) * 100}cqi`,
    "--pi-party-count-fs": `${(partyLine.countFontSize / width) * 100}cqi`,
  };
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
