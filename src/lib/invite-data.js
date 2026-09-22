export const EASE = [0.22, 1, 0.36, 1];

// Numéro WhatsApp des mariés (format international sans +) — à personnaliser
export const WHATSAPP_NUMBER = "33600000000";

export const COUPLE = { bride: "Éléonore", groom: "Augustin" };
export const WEDDING_DATE_ISO = "2026-10-24T15:30:00+02:00";
export const WEDDING_DATE_LABEL = "Samedi 24 Octobre 2026";
export const WEDDING_DATE_SHORT = "24 . 10 . 2026";

export const VENUE = {
  name: "Château de Deauville",
  address: "Route des Jardins, 14800 Deauville — Normandie",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ch%C3%A2teau+de+Deauville",
  embedUrl: "https://www.google.com/maps?q=Deauville,France&output=embed",
};

export const IBAN = "FR76 3000 4028 3798 7654 3210 981";

export const IMAGES = {
  hero: "https://images.pexels.com/photos/18353881/pexels-photo-18353881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1920",
  portrait: "https://images.pexels.com/photos/37379965/pexels-photo-37379965.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=700",
  venue: "https://images.pexels.com/photos/34377614/pexels-photo-34377614.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=1000",
  venueAerial: "https://images.pexels.com/photos/8431283/pexels-photo-8431283.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=1000",
};

export const GALLERY = [
  { src: "https://images.pexels.com/photos/18353881/pexels-photo-18353881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=700", caption: "Le coucher du soleil", span: "tall" },
  { src: "https://images.pexels.com/photos/13045649/pexels-photo-13045649.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=900", caption: "La table d'honneur", span: "wide" },
  { src: "https://images.pexels.com/photos/36217349/pexels-photo-36217349.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=700", caption: "Roses & or", span: "square" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900&auto=format&fit=crop", caption: "Les étincelles", span: "square" },
  { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=700&auto=format&fit=crop", caption: "Main dans la main", span: "tall" },
  { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=900&auto=format&fit=crop", caption: "Les alliances", span: "wide" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=700&auto=format&fit=crop", caption: "L'arche fleurie", span: "square" },
];

export const STORY = [
  { year: "2019", title: "La Rencontre à Paris", text: "Un soir d'automne sur les quais de Seine, un livre échangé, un regard qui s'attarde. Le premier chapitre s'écrivait déjà." },
  { year: "2022", title: "L'Échappée Italienne", text: "Positano, ses citrons et ses falaises. C'est là, face à la Méditerranée, que nous avons su que tout le reste serait écrit à deux." },
  { year: "2025", title: "La Demande sous les Étoiles", text: "En Normandie, un ciel dégagé, une bague cachée dans une rose. Elle a dit oui avant même la fin de la question." },
];

export const PROGRAM = [
  { time: "14h00", title: "Accueil des Invités", text: "Mosaïque de rafraîchissements & premières étreintes dans la cour d'honneur." },
  { time: "15h30", title: "Cérémonie Laïque", text: "Échange des vœux dans le parc du château, sous l'arche de roses anciennes." },
  { time: "17h30", title: "Cocktail & Champagne", text: "Vin d'honneur au Jardin de Roses, notes de jazz et amuse-bouches." },
  { time: "20h00", title: "Dîner Gastronomique", text: "Dîner d'exception dans la Grande Galerie, discours & surprises." },
  { time: "23h30", title: "Pièce Montée & Bal", text: "Ouverture du bal, puis piste de danse jusqu'au petit matin." },
];

export const NAV_LINKS = [
  { label: "Histoire", href: "#histoire" },
  { label: "Programme", href: "#programme" },
  { label: "Lieux", href: "#lieux" },
  { label: "Tenues", href: "#tenues" },
  { label: "Livre d'Or", href: "#livre-or" },
];

export const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};
