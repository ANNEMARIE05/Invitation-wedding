import { createContext, useContext } from "react";
import { COUPLE, WEDDING_DATE_ISO, VENUE, STORY } from "./invite-data";

export const SettingsContext = createContext(null);

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const useSettings = () => {
  const s = useContext(SettingsContext) || {};
  const bride = (s.bride || "").trim() || COUPLE.bride;
  const groom = (s.groom || "").trim() || COUPLE.groom;
  const dateIso = s.date_iso || WEDDING_DATE_ISO;
  const d = new Date(dateIso);
  const deadline = new Date(d);
  deadline.setMonth(deadline.getMonth() - 2);
  const venueName = (s.venue_name || "").trim() || VENUE.name;
  const venueAddress = (s.venue_address || "").trim() || VENUE.address;
  const q = encodeURIComponent(`${venueName} ${venueAddress}`);
  const story =
    Array.isArray(s.story) && s.story.length === 3 && s.story.every((x) => x && x.title)
      ? s.story
      : STORY;
  return {
    bride,
    groom,
    initials: `${bride.charAt(0).toUpperCase()} & ${groom.charAt(0).toUpperCase()}`,
    dateIso,
    dateLabel: cap(d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    dateShort: `${String(d.getDate()).padStart(2, "0")} . ${String(d.getMonth() + 1).padStart(2, "0")} . ${d.getFullYear()}`,
    timeLabel: `${d.getHours()} heures ${String(d.getMinutes()).padStart(2, "0")}`,
    deadlineLabel: `avant le ${deadline.getDate()} ${deadline.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
    venue: {
      name: venueName,
      address: venueAddress,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
      embedUrl: `https://www.google.com/maps?q=${q}&output=embed`,
    },
    story,
  };
};
