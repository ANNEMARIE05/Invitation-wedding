/** Palette « Berry Love » — valeurs par défaut (alignées sur index.css & invite-data) */

export const DEFAULT_SITE_THEME = {
  wine: "#A3235A",
  wineDeep: "#6A1037",
  wineAccent: "#C43673",
  rose: "#E83D89",
  roseBright: "#FA5C9F",
  roseLight: "#F2ABC9",
  gold: "#D4AF37",
  goldAccent: "#E5C158",
  goldSoft: "#F5E5B8",
  silver: "#C6C7D0",
  ink: "#520B2A",
  inkSoft: "#70143D",
  muted: "#9E285B",
  ivory: "#F7D2E2",
  ivoryDeep: "#F0B5CE",
  onDark: "#FFF8FB",
};

export const DEFAULT_DRESS_PALETTE = {
  berry: "#980522",
  magenta: "#ED1E79",
  red: "#C4282A",
  blush: "#E6A8BA",
  silver: "#B8BCC8",
};

/** @deprecated — préférer DEFAULT_SITE_THEME */
export const BERRY = {
  berry: DEFAULT_SITE_THEME.wine,
  berryDeep: DEFAULT_SITE_THEME.wineDeep,
  blush: DEFAULT_SITE_THEME.roseLight,
  blushSoft: DEFAULT_SITE_THEME.ivory,
  red: "#E31B23",
  magenta: DEFAULT_SITE_THEME.rose,
  magentaLight: DEFAULT_SITE_THEME.roseBright,
  silver: DEFAULT_SITE_THEME.silver,
  silverBright: "#E8EAEF",
  ink: DEFAULT_SITE_THEME.ink,
  inkSoft: DEFAULT_SITE_THEME.inkSoft,
  onDark: DEFAULT_SITE_THEME.onDark,
  muted: DEFAULT_SITE_THEME.muted,
};

const DRESS_META = [
  { id: "berry", label: "Framboise profonde" },
  { id: "magenta", label: "Framboise vif", metallic: false },
  { id: "red", label: "Rouge" },
  { id: "blush", label: "Rose poudré" },
  { id: "silver", label: "Argenté", metallic: true },
];

const HEX_RE = /^#([0-9A-Fa-f]{6})$/;

export function normalizeHex(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  if (!HEX_RE.test(withHash)) return fallback;
  return withHash.toUpperCase();
}

function hexLuminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Évite que l’or du thème soit remplacé par de l’argenté / du gris (souvent par erreur dans l’admin). */
function guardGoldTone(key, hex, fallback) {
  if (!["gold", "goldAccent", "goldSoft"].includes(key)) return hex;
  const upper = hex.toUpperCase();
  const silver = DEFAULT_SITE_THEME.silver.toUpperCase();
  if (upper === silver) return fallback;
  const lum = hexLuminance(hex);
  if (lum > 0.82 && lum < 0.95 && key !== "goldSoft") {
    const fbLum = hexLuminance(fallback);
    if (Math.abs(lum - fbLum) > 0.08) return fallback;
  }
  return hex;
}

function mergeSiteTheme(stored) {
  const t = stored?.theme?.site && typeof stored.theme.site === "object" ? stored.theme.site : {};
  const out = {};
  for (const [key, def] of Object.entries(DEFAULT_SITE_THEME)) {
    const normalized = normalizeHex(t[key], def);
    out[key] = guardGoldTone(key, normalized, def);
  }
  return out;
}

function mergeDressPalette(stored) {
  const t = stored?.theme?.dress && typeof stored.theme.dress === "object" ? stored.theme.dress : {};
  const out = {};
  for (const [key, def] of Object.entries(DEFAULT_DRESS_PALETTE)) {
    out[key] = normalizeHex(t[key], def);
  }
  return out;
}

/** Thème complet (SQLite + défauts code). */
export function mergeTheme(stored) {
  const site = mergeSiteTheme(stored);
  const dress = mergeDressPalette(stored);
  return {
    site,
    dress,
    dressPalette: DRESS_META.map((meta) => ({
      ...meta,
      hex: dress[meta.id] || DEFAULT_DRESS_PALETTE[meta.id],
    })),
  };
}

const CSS_VAR_MAP = {
  wine: "--wine",
  wineDeep: "--wine-deep",
  wineAccent: "--wine-accent",
  rose: "--rose",
  roseBright: "--rose-bright",
  roseLight: "--rose-light",
  gold: "--gold",
  goldAccent: "--gold-accent",
  goldSoft: "--gold-soft",
  silver: "--silver",
  ink: "--ink",
  inkSoft: "--ink-soft",
  muted: "--muted",
  ivory: "--ivory",
  ivoryDeep: "--ivory-deep",
  onDark: "--on-dark",
};

/** Applique les variables CSS sur :root (invitation + admin). */
export function applyThemeToDocument(stored) {
  if (typeof document === "undefined") return;
  const { site } = mergeTheme(stored);
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    root.style.setProperty(cssVar, site[key]);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", site.wineDeep);
}

export function themeFromForm(formTheme) {
  const site = {};
  for (const key of Object.keys(DEFAULT_SITE_THEME)) {
    site[key] = normalizeHex(formTheme?.site?.[key], DEFAULT_SITE_THEME[key]);
  }
  const dress = {};
  for (const key of Object.keys(DEFAULT_DRESS_PALETTE)) {
    dress[key] = normalizeHex(formTheme?.dress?.[key], DEFAULT_DRESS_PALETTE[key]);
  }
  return { site, dress };
}

export function defaultThemeForm() {
  return {
    site: { ...DEFAULT_SITE_THEME },
    dress: { ...DEFAULT_DRESS_PALETTE },
  };
}

export const SITE_THEME_FIELDS = [
  { key: "wine", label: "Framboise (principal)", hint: "Boutons, bandeaux, accents forts" },
  { key: "wineDeep", label: "Framboise foncé", hint: "Fonds sombres, dégradés profonds" },
  { key: "wineAccent", label: "Framboise médium", hint: "Titres et touches secondaires" },
  { key: "rose", label: "Rose vif", hint: "Liens, surbrillance, cœurs" },
  { key: "roseLight", label: "Rose poudré", hint: "Bordures légères, fonds clairs" },
  { key: "gold", label: "Or (texte)", hint: "Typo dorée sur fond sombre" },
  { key: "goldAccent", label: "Or (boutons admin)", hint: "Boutons enregistrer, liens hub" },
  { key: "ink", label: "Encre (titres)", hint: "Titres et accents texte sur fond clair" },
  { key: "inkSoft", label: "Framboise (corps)", hint: "Paragraphes — ton chaud, pas gris" },
  { key: "muted", label: "Framboise (légendes)", hint: "Mentions discrètes, aligné sur wine-accent" },
  { key: "ivory", label: "Crème", hint: "Fonds clairs, séparateurs" },
];

export const DRESS_THEME_FIELDS = [
  { key: "berry", label: "Framboise profonde" },
  { key: "magenta", label: "Framboise vif" },
  { key: "red", label: "Rouge" },
  { key: "blush", label: "Rose poudré" },
  { key: "silver", label: "Argenté" },
];
