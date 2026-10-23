import coupleIllustration from "@/assets/couple-illustration.jpg";
import weddingArchSketch from "@/assets/wedding-arch-sketch.jpg";

export const EASE = [0.22, 1, 0.36, 1];

const publicImage = (file) => `${process.env.PUBLIC_URL || ""}/images/${file}`;

export const WHATSAPP_NUMBER = "2250172317983";

export const COUPLE = { bride: "Marie", groom: "Stéphane" };
export const WEDDING_DATE_ISO = "2026-12-04T13:30:00+00:00";
export const WEDDING_DATE_LABEL = "Vendredi 4 Décembre 2026";
export const WEDDING_DATE_SHORT = "04 . 12 . 2026";

export const VENUE = {
  name: "Salle du Royaume — Cocody Danga",
  address: "Cocody Danga, Abidjan — Côte d'Ivoire",
  mapsUrl: "https://maps.app.goo.gl/RxudqMYFj3jEBCua7?g_st=aw",
  embedUrl: "https://www.google.com/maps?q=Salle+du+Royaume+T%C3%A9moins+J%C3%A9hovah+Cocody+Danga&output=embed",
};

/** Données lieux (textes via i18n) */
export const VENUE_MEDIA = [
  {
    id: "civil",
    address: "Cocody, Abidjan — Côte d'Ivoire",
    mapsUrl: "https://maps.app.goo.gl/jEqFhD6qW3Y7rPAQ8?g_st=aw",
    embedUrl: "https://www.google.com/maps?q=H%C3%B4tel+communal+de+Cocody+Abidjan&output=embed",
    image: publicImage("mairie-cocody.jpg"),
  },
  {
    id: "ceremony",
    address: "Cocody Danga, Abidjan — Côte d'Ivoire",
    mapsUrl: "https://maps.app.goo.gl/RxudqMYFj3jEBCua7?g_st=aw",
    embedUrl: "https://www.google.com/maps?q=Salle+du+Royaume+T%C3%A9moins+J%C3%A9hovah+Cocody+Danga&output=embed",
    image: publicImage("salle-temoins-jehovah.jpg"),
  },
];

/** Renseignez l'URL complète Zoom lorsque vous l'aurez reçue. */
export const ZOOM = {
  url: "",
  code: "0000",
};

/** Couleurs officielles du mariage (Berry Love + touche argentée) — calées sur le mood board */
export const WEDDING_PALETTE = [
  { id: "berry", label: "Framboise profonde", hex: "#980522" },
  { id: "magenta", label: "Framboise vif", hex: "#ED1E79" },
  { id: "red", label: "Rouge", hex: "#C4282A" },
  { id: "blush", label: "Rose poudré", hex: "#E6A8BA" },
  { id: "silver", label: "Argenté", hex: "#B8BCC8", metallic: true },
];

export function getZoomJoinUrl(zoom = ZOOM) {
  const direct = zoom.url?.trim();
  if (direct) return direct;
  const id = zoom.code?.trim().replace(/\s/g, "");
  if (id && id !== "0000") return `https://zoom.us/j/${id}`;
  return "";
}

export const VERSES = [
  {
    who: "Stéphane",
    lines: [
      { text: "Ma belle Marie", quote: false },
      { text: "« Femme extrêmement favorisée, Jéhovah est avec toi »", quote: true },
    ],
    ref: "Luc 1 : 28",
  },
  {
    who: "Marie",
    lines: [
      { text: "Mon cœur est rempli d'amour,", quote: false },
      { text: "« J'ai trouvé celui que j'aime. »", quote: true },
    ],
    ref: "Chant de Salomon 3 : 4",
  },
];

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1519167758481-83f550bb49b8?q=80&w=1920&auto=format&fit=crop",
  portrait: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=900&auto=format&fit=crop",
  footerPhoto: coupleIllustration,
  dresscodeInspiration: publicImage("dresscode-inspiration.png"),
  weddingArch: weddingArchSketch,
  venue: "https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=1000",
  venueAerial: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
};


export const GALLERY = [
  { src: IMAGES.hero, caption: "Harmonie", span: "wide" },
  { src: IMAGES.footerPhoto, caption: "Alliances", span: "square" },
  { src: IMAGES.venue, caption: "Notre journée", span: "tall" },
];

export const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};

/** Bande-son YouTube (iframe cachée — contrôles via MusicPlayer) */
export const WEDDING_SONG = {
  youtubeId: "06-XXOTP3Gc",
  startSeconds: 0,
  track: "Beautiful In White",
  artist: "Shane Filan",
  thumbUrl: "https://i.ytimg.com/vi/06-XXOTP3Gc/hqdefault.jpg",
};

export const GIFTS_PRIMARY_PHONE = "01 72 31 79 83";
export const GIFTS_PRIMARY_PHONE_RAW = "0172317983";

/** Compte Wave pour les cadeaux & participations */
export const WAVE_ACCOUNT = {
  name: "Wave",
  number: "01 72 31 79 83",
  rawNumber: "0172317983",
  recipient: "Stéphane & Marie",
  color: "#1DC3F4",
  actionUrl: "https://wave.com",
};

/** Comptes Mobile Money pour les cadeaux & participations */
export const MOBILE_MONEY_ACCOUNTS = [
  {
    id: "wave",
    name: "Wave",
    shortName: "Wave",
    number: "01 72 31 79 83",
    rawNumber: "0172317983",
    recipient: "Stéphane & Marie",
    color: "#1DC3F4",
    bgLight: "rgba(29, 195, 244, 0.08)",
    badgeBg: "bg-[#1DC3F4]/15",
    badgeText: "text-[#0094C6]",
    border: "border-[#1DC3F4]/50",
    actionUrl: "https://wave.com",
    actionType: "link",
    iconEmoji: "🌊",
    logoUrl: publicImage("wave-money-logo.png"),
  },
  {
    id: "orange",
    name: "Orange Money",
    shortName: "Orange",
    number: "01 72 31 79 83",
    rawNumber: "0172317983",
    recipient: "Stéphane & Marie",
    color: "#FF7900",
    bgLight: "rgba(255, 121, 0, 0.08)",
    badgeBg: "bg-[#FF7900]/15",
    badgeText: "text-[#D35400]",
    border: "border-[#FF7900]/50",
    actionUrl: "tel:*144#",
    actionType: "ussd",
    iconEmoji: "🟠",
    logoUrl: publicImage("Orange-Money-logo.png"),
  },
  {
    id: "moov",
    name: "Moov Money",
    shortName: "Moov",
    number: "01 72 31 79 83",
    rawNumber: "0172317983",
    recipient: "Stéphane & Marie",
    color: "#0099D8",
    bgLight: "rgba(0, 153, 216, 0.08)",
    badgeBg: "bg-[#0099D8]/15",
    badgeText: "text-[#007EA7]",
    border: "border-[#0099D8]/50",
    actionUrl: "tel:*155#",
    actionType: "ussd",
    iconEmoji: "🔵",
  },
  {
    id: "mtn",
    name: "MTN MoMo",
    shortName: "MTN",
    number: "01 72 31 79 83",
    rawNumber: "0172317983",
    recipient: "Stéphane & Marie",
    color: "#FFCC00",
    bgLight: "rgba(255, 204, 0, 0.12)",
    badgeBg: "bg-[#FFCC00]/25",
    badgeText: "text-[#996500]",
    border: "border-[#FFCC00]/60",
    actionUrl: "tel:*133#",
    actionType: "ussd",
    iconEmoji: "🟡",
  },
];

