import { createContext, useContext } from "react";
import { buildVenueCards, mergeSettings } from "./invite-defaults";
import { messages } from "./translations";
import { useLocale } from "./locale";

export const SettingsContext = createContext(null);

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const useSettings = () => {
  const locale = useLocale();
  const m = messages[locale] ?? messages.fr;
  const locTag = locale === "en" ? "en-GB" : "fr-FR";
  const s = useContext(SettingsContext) || {};
  const merged = mergeSettings(s);
  const bride = merged.bride;
  const groom = merged.groom;
  const dateIso = merged.date_iso;
  const d = new Date(dateIso);
  const deadline = new Date(d);
  deadline.setMonth(deadline.getMonth() - 2);
  const venueName = merged.venue_name;
  const venueAddress = merged.venue_address;
  const q = encodeURIComponent(`${venueName} ${venueAddress}`);
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  const monthYear = deadline.toLocaleDateString(locTag, { month: "long", year: "numeric" });
  return {
    bride,
    groom,
    locale,
    initials: `${bride.charAt(0).toUpperCase()} & ${groom.charAt(0).toUpperCase()}`,
    dateIso,
    dateLabel: cap(d.toLocaleDateString(locTag, { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    dateShort: `${String(d.getDate()).padStart(2, "0")} . ${String(d.getMonth() + 1).padStart(2, "0")} . ${d.getFullYear()}`,
    timeLabel: m.settings.timeAt(hours, mins),
    deadlineLabel: m.settings.deadlineBefore(deadline.getDate(), monthYear),
    venue: {
      name: venueName,
      address: venueAddress,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
      embedUrl: `https://www.google.com/maps?q=${q}&output=embed`,
    },
    venueCards: buildVenueCards(m, merged),
    zoom: {
      url: merged.zoom_url,
      code: merged.zoom_code,
      joinUrl: merged.zoom_join_url,
    },
  };
};
