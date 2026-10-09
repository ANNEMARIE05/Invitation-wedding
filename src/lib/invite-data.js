export const EASE = [0.22, 1, 0.36, 1];

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
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ceremony",
    address: "Cocody Danga, Abidjan — Côte d'Ivoire",
    mapsUrl: "https://maps.app.goo.gl/RxudqMYFj3jEBCua7?g_st=aw",
    embedUrl: "https://www.google.com/maps?q=Salle+du+Royaume+T%C3%A9moins+J%C3%A9hovah+Cocody+Danga&output=embed",
    image:
      "https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=1000",
  },
];

/** Renseignez l'URL complète Zoom lorsque vous l'aurez reçue. */
export const ZOOM = {
  url: "",
  code: "0000",
};

/** Couleurs officielles du mariage (Berry Love + touche argentée) */
export const WEDDING_PALETTE = [
  { id: "berry", label: "Framboise", hex: "#9B1B4A" },
  { id: "wine", label: "Bordeaux", hex: "#2A050B" },
  { id: "blush", label: "Rose poudré", hex: "#FFD6E0" },
  { id: "silver", label: "Argenté", hex: "#C0C0C0", metallic: true },
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
      { text: "« Femme extrêmement favorisée, Jéhova est avec toi »", quote: true },
    ],
    ref: "Luc 1 : 28",
  },
  {
    who: "Marie",
    lines: [
      { text: "Mon cœur est rempli d'amour,", quote: false },
      { text: "« J'ai trouvé celui que j'aime. »", quote: true },
    ],
    ref: "Cantique des Cantiques 3 : 4",
  },
];

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1519167758481-83f550bb49b8?q=80&w=1920&auto=format&fit=crop",
  portrait: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=900&auto=format&fit=crop",
  footerPhoto: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop",
  venue: "https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=1000",
  venueAerial: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
};


export const GALLERY = [
  { src: IMAGES.hero, caption: "Berry Love", span: "wide" },
  { src: IMAGES.footerPhoto, caption: "Alliances", span: "square" },
  { src: IMAGES.venue, caption: "Notre journée", span: "tall" },
];

export const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};
