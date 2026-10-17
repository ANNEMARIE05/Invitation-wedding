/** Palette « Berry Love » — valeurs par défaut (alignées sur index.css & invite-data) */

export const DEFAULT_SITE_THEME = {
  wine: "#8A2648",
  wineDeep: "#6E1F3D",
  wineAccent: "#AD2E58",
  rose: "#ED1E79",
  roseBright: "#F7338B",
  roseLight: "#FFD6E0",
  gold: "#C9A962",
  goldAccent: "#D4AF37",
  goldSoft: "#E8D5A8",
  silver: "#B8BCC8",
  ink: "#401820",
  inkSoft: "#5C3040",
  muted: "#804058",
  ivory: "#FFF0F4",
  ivoryDeep: "#FFE0EA",
  onDark: "#FFFBFC",
};

export const DEFAULT_DRESS_PALETTE = {
  berry: "#980522",
  magenta: "#ED1E79",
  red: "#C4282A",
  blush: "#EBAF9B",
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

function mergeSiteTheme(stored) {
  const t = stored?.theme?.site && typeof stored.theme.site === "object" ? stored.theme.site : {};
  const out = {};
  for (const [key, def] of Object.entries(DEFAULT_SITE_THEME)) {
    out[key] = normalizeHex(t[key], def);
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
  { key: "ink", label: "Encre", hint: "Texte principal sur fond clair" },
  { key: "ivory", label: "Crème", hint: "Fonds clairs, séparateurs" },
];

export const DRESS_THEME_FIELDS = [
  { key: "berry", label: "Framboise profonde" },
  { key: "magenta", label: "Framboise vif" },
  { key: "red", label: "Rouge" },
  { key: "blush", label: "Rose poudré" },
  { key: "silver", label: "Argenté" },
];
