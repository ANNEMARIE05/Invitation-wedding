/** Coordonnées calées sur carte-invitation-envoi.jpg (682 × 1024 px). */
export const PERSONAL_INVITE_CARD = {
  width: 682,
  height: 1024,
  name: {
    x: 341,
    y: 508,
    maxWidth: 468,
    fontSize: 25,
    fontSizeMd: 22,
    fontSizeSm: 19,
    fontSizeXs: 16,
  },
  count: {
    x: 405,
    y: 568,
    fontSize: 14.5,
  },
};

export function personalInviteCssVars() {
  const { width, height, name, count } = PERSONAL_INVITE_CARD;
  return {
    "--pi-name-x": `${(name.x / width) * 100}%`,
    "--pi-name-y": `${(name.y / height) * 100}%`,
    "--pi-name-max-w": `${(name.maxWidth / width) * 100}%`,
    "--pi-count-x": `${(count.x / width) * 100}%`,
    "--pi-count-y": `${(count.y / height) * 100}%`,
    "--pi-name-fs": `${(name.fontSize / width) * 100}cqi`,
    "--pi-name-fs-md": `${(name.fontSizeMd / width) * 100}cqi`,
    "--pi-name-fs-sm": `${(name.fontSizeSm / width) * 100}cqi`,
    "--pi-name-fs-xs": `${(name.fontSizeXs / width) * 100}cqi`,
    "--pi-count-fs": `${(count.fontSize / width) * 100}cqi`,
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
