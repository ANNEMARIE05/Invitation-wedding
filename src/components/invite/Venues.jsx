import { motion } from "framer-motion";
import { MapPin, Navigation, Video } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { usePhoto } from "@/lib/photos";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard, { BtnRejoindre } from "./LuxeCard";

export default function Venues() {
  const { m } = useI18n();
  const { venueCards, zoom } = useSettings();
  const civilImg = usePhoto("venue-civil", venueCards[0]?.image);
  const ceremonyImg = usePhoto("venue-ceremony", venueCards[1]?.image);
  const venues = venueCards.map((v) => ({
    ...v,
    image: v.id === "civil" ? civilImg : v.id === "ceremony" ? ceremonyImg : v.image,
  }));
  const zoomHref = zoom.joinUrl;
  const z = m.venues.zoom;

  return (
    <section id="lieux" className="py-24 md:py-36 px-5 sm:px-8 lg:px-16" data-testid="venues-section">
      <div className="max-w-6xl mx-auto">
        <Chapter index="IV" eyebrow={m.venues.chapter} title={m.venues.title} script={m.venues.script} />

        <div className="grid gap-8 lg:grid-cols-2">
          {venues.map((venue, i) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
            >
              <LuxeCard as="article" lift animate={false} className="overflow-hidden !rounded-[1.25rem] !rounded-b-lg" data-testid={`venue-card-${venue.id}`}>
                <div className="group relative h-56 overflow-hidden sm:h-64">
                  <img
                    src={venue.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0308]/95 via-[#2A050B]/55 to-[#2A050B]/15" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0308]/92 via-[#2A050B]/75 to-transparent px-6 pb-5 pt-16 sm:px-7 sm:pb-6">
                    <p className="font-cinzel text-[10px] font-bold tracking-[0.32em] uppercase text-[#FFD6E0] drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                      {venue.eyebrow}
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold italic leading-tight text-[#FFFBFC] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:text-3xl">
                      {venue.name}
                    </p>
                    <p className="mt-2 inline-flex rounded-full bg-[#FFFBFC]/15 px-3 py-1 font-cinzel text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFBFC] backdrop-blur-sm ring-1 ring-[#FFD6E0]/35">
                      {venue.time}
                    </p>
                  </div>
                </div>
                <div className="p-7 sm:p-8">
                  <div className="flex items-start gap-3 text-[#4A1025]">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[#9B1B4A]" strokeWidth={1.5} />
                    <p className="text-sm sm:text-base">{venue.address}</p>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#6B2440]">{venue.note}</p>
                  <a
                    data-testid={`venue-directions-${venue.id}`}
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#2A050B]/15 bg-[#2A050B] px-7 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#FFFBFC] transition-all duration-300 hover:bg-[#5C0A20]"
                  >
                    <Navigation size={15} /> {m.venues.maps}
                  </a>
                  <div className="mt-6 overflow-hidden rounded-lg border border-[#B8BCC8]/35 min-h-[180px]" data-testid={`venue-map-${venue.id}`}>
                    <iframe
                      title={m.venues.mapTitle(venue.name)}
                      src={venue.embedUrl}
                      className="h-[180px] w-full grayscale-[0.15]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </LuxeCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-10"
        >
          <LuxeCard noInset className="overflow-hidden !p-0" data-testid="zoom-card">
            <div className="grid lg:grid-cols-[1.15fr_auto]">
              <div className="border-b border-[#2A050B]/08 bg-[#FFFBFC] px-7 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r">
                <p className="flex items-center gap-2 font-cinzel text-[10px] font-semibold tracking-[0.32em] uppercase text-[#9B1B4A]">
                  <Video size={16} strokeWidth={1.5} /> {z.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-[#2A050B]">{z.title}</h3>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#4A1025]">
                  {z.text}
                </p>
                <p className="mt-5 font-cinzel text-xs font-medium uppercase tracking-[0.2em] text-[#6B2440]">
                  {z.codeLabel}
                </p>
                <p className="mt-1 font-display text-2xl tracking-wide text-[#9B1B4A]">{zoom.code}</p>
              </div>
              <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden border-t border-[#ED1E79]/12 bg-gradient-to-br from-[#FFF5F9] via-[#FFFBFC] to-[#FFE8F0] px-8 py-10 lg:min-w-[240px] lg:border-l lg:border-t-0">
                <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#ED1E79]/10 blur-2xl" aria-hidden="true" />
                <BtnRejoindre
                  href={zoomHref}
                  label={z.join}
                  onUnavailable={() =>
                    toast.message(z.toastTitle, {
                      description: z.toastDesc(zoom.code),
                    })
                  }
                />
                <p className="relative max-w-[12rem] text-center font-cinzel text-[9px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#6B2440]">
                  {z.foot}
                </p>
              </div>
            </div>
          </LuxeCard>
        </motion.div>
      </div>
    </section>
  );
}
