import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Navigation, Video } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { REVEAL_VIEWPORT } from "@/lib/motion-viewport";
import { useI18n } from "@/lib/locale";
import { usePhoto } from "@/lib/photos";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";

const protectJehovah = (text) => String(text || "").replace(/Jéhovah/g, "Jéh\u2060ovah");

function VenueMapEmbed({ venue, loadingLabel, mapTitle }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [venue.embedUrl]);

  return (
    <div
      data-testid={`venue-map-${venue.id}`}
      className={`venue-map-shell venues-stop-card__map-frame min-h-[168px] sm:min-h-[180px] ${loading ? "venue-map-shell--loading" : "venue-map-shell--loaded"}`}
    >
      {loading ? (
        <div className="venue-map-loader" role="status" aria-live="polite">
          <span className="venue-map-loader__ring" aria-hidden="true" />
          <span className="venue-map-loader__label">{loadingLabel}</span>
        </div>
      ) : null}
      <iframe
        key={venue.id}
        title={mapTitle(protectJehovah(venue.name))}
        src={venue.embedUrl}
        className="venue-map-iframe h-[168px] w-full grayscale-[0.12] sm:h-[180px]"
        loading="lazy"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

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
  const vCopy = m.venues;

  const zoomItem = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };
  const zoomStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  };

  return (
    <section id="lieux" className="py-16 px-5 sm:px-8 sm:py-24 md:py-36 lg:px-16" data-testid="venues-section">
      <div className="max-w-4xl mx-auto md:max-w-5xl lg:max-w-6xl">
        <Chapter index="IV" eyebrow={vCopy.chapter} title={vCopy.title} script={vCopy.script} />

        <div className="relative mt-4 md:mt-8">
          <div
            className="venues-journey-rail pointer-events-none absolute left-1/2 top-0 bottom-0 z-0 w-px -translate-x-1/2 max-md:w-0.5"
            aria-hidden="true"
          />
          <ol className="relative z-[1] list-none space-y-0 p-0 m-0">
            {venues.map((venue, i) => (
              <li key={venue.id} className="venues-journey-step">
                {i > 0 ? (
                  <div className="venues-journey-bridge-wrap">
                    <motion.p
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={REVEAL_VIEWPORT}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="venues-journey-bridge"
                    >
                      {vCopy.journeyBetween}
                    </motion.p>
                  </div>
                ) : null}
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ duration: 0.85, delay: i * 0.08, ease: EASE }}
                  className="relative pt-2"
                >
                  <span className="venues-journey-dot" aria-hidden="true" />
                  <LuxeCard
                    as="article"
                    lift
                    animate={false}
                    className="venues-stop-card overflow-hidden !rounded-[1.15rem]"
                    data-testid={`venue-card-${venue.id}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="venues-stop-card__time-side shrink-0">
                        <span
                          className="venues-stop-card__time-fleuron"
                          aria-hidden="true"
                          style={{ "--venues-fleuron-delay": `${i * 0.45}s` }}
                        >
                          <span className="venues-stop-card__time-fleuron-glyph">✿</span>
                        </span>
                        <p className="venues-stop-card__time type-accent-time">{venue.time}</p>
                      </div>
                      <div className="group relative h-44 shrink-0 overflow-hidden sm:h-auto sm:min-h-[15rem] sm:w-[13.5rem] md:min-h-[17rem] md:w-[17.5rem] lg:w-[20rem]">
                        <img
                          src={venue.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-wedding-wine-deep/55 via-wedding-wine/15 to-transparent sm:bg-gradient-to-r sm:from-wedding-wine-deep/35 sm:via-transparent sm:to-transparent" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-start p-5 text-left sm:p-7">
                        <p className="font-cinzel text-[11px] font-bold tracking-[0.24em] uppercase text-wedding-wine-accent sm:text-xs sm:tracking-[0.28em]">
                          {venue.eyebrow}
                        </p>
                        <h3 className="type-card-title mt-1 text-lg italic sm:text-2xl">{protectJehovah(venue.name)}</h3>
                        <div className="mt-3 flex items-start justify-start gap-2.5 text-wedding-wine">
                          <MapPin size={17} className="mt-0.5 shrink-0 text-wedding-wine-accent" strokeWidth={1.5} />
                          <p className="type-prose text-sm sm:text-base">{venue.address}</p>
                        </div>
                        <p className="type-prose mt-3 text-sm sm:text-base">{protectJehovah(venue.note)}</p>
                        <motion.a
                          data-testid={`venue-directions-${venue.id}`}
                          href={venue.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileTap={{ scale: 0.96 }}
                          whileHover={{ y: -2 }}
                          className="venue-action-btn mt-4 inline-flex w-fit max-w-full items-center justify-center gap-1.5 rounded-full border border-wedding-wine-deep/20 bg-wedding-wine-deep px-5 py-2.5 font-cinzel text-[11px] uppercase tracking-[0.14em] text-wedding-on-dark transition-all duration-300 hover:bg-wedding-wine-accent sm:mt-5 sm:gap-2 sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.18em]"
                        >
                          <Navigation size={14} /> {vCopy.maps}
                        </motion.a>
                        {venue.embedUrl ? (
                          <div className="venues-stop-card__map mt-6 w-full">
                            <VenueMapEmbed venue={venue} loadingLabel={vCopy.mapLoading} mapTitle={vCopy.mapTitle} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </LuxeCard>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL_VIEWPORT}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-10 w-full md:mt-12"
        >
          <LuxeCard noInset lift animate={false} className="zoom-stream-card overflow-hidden !p-0" data-testid="zoom-card">
            <div className="zoom-stream-card__shine pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" />
            <div className="zoom-stream-card__ambient pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
            <motion.div
              className="relative z-[3] flex flex-col items-center gap-5 px-5 py-5 sm:items-stretch sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:gap-8 lg:px-10"
              variants={zoomStagger}
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
            >
              <motion.div variants={zoomItem} className="flex min-w-0 w-full flex-1 flex-col items-center text-center sm:items-start sm:text-left">
                <p className="type-eyebrow text-[9px] tracking-[0.3em] sm:text-[10px]">{z.eyebrow}</p>
                <div className="mt-2 flex items-center justify-center gap-3 sm:mt-2.5 sm:justify-start sm:gap-3.5">
                  <div className="zoom-stream-card__emblem shrink-0" aria-hidden="true">
                    <span className="zoom-stream-card__video-ring">
                      <span className="zoom-stream-card__video-core">
                        <Video className="zoom-stream-card__video-icon" size={22} strokeWidth={1.4} />
                      </span>
                    </span>
                  </div>
                  <h3 className="type-card-title text-xl italic sm:text-[1.65rem]">{z.title}</h3>
                </div>
                <p className="type-prose mt-2.5 text-sm sm:text-[15px]">{z.text}</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                  <div className="zoom-stream-card__code inline-flex flex-col items-center gap-0.5 sm:items-start">
                    <p className="font-cinzel text-[9px] font-medium uppercase tracking-[0.18em] text-wedding-wine-accent">
                      {z.codeLabel}
                    </p>
                    <p className="type-accent-time text-base sm:text-xl not-italic tabular-nums tracking-[0.05em]">{zoom.code}</p>
                  </div>
                  {zoom.passcode ? (
                    <div className="zoom-stream-card__code inline-flex flex-col items-center gap-0.5 sm:items-start">
                      <p className="font-cinzel text-[9px] font-medium uppercase tracking-[0.18em] text-wedding-wine-accent">
                        {z.passcodeLabel}
                      </p>
                      <p className="type-accent-time text-base sm:text-xl not-italic tabular-nums tracking-[0.05em]">{zoom.passcode}</p>
                    </div>
                  ) : null}
                </div>
              </motion.div>

              <motion.div
                variants={zoomItem}
                className="zoom-stream-card__aside flex shrink-0 flex-col items-center gap-2 border-t border-wedding-gold-accent/15 pt-4 sm:items-stretch lg:w-[min(100%,12.5rem)] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              >
                <div className="zoom-stream-card__cta-wrap mx-auto lg:mx-0">
                  <motion.a
                    href={zoomHref || "#lieux"}
                    target={zoomHref ? "_blank" : undefined}
                    rel={zoomHref ? "noopener noreferrer" : undefined}
                    data-testid="zoom-join-button"
                    onClick={(e) => {
                      if (!zoomHref) {
                        e.preventDefault();
                        toast.message(z.toastTitle, { description: z.toastDesc(zoom.code) });
                      }
                    }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="zoom-stream-card__cta group inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 font-cinzel text-[10px] font-semibold uppercase tracking-[0.16em] text-wedding-on-dark sm:px-6"
                  >
                    <Video size={14} strokeWidth={1.5} className="relative z-[1] text-wedding-gold-accent/95" aria-hidden />
                    {z.join}
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2}
                      className="relative z-[1] text-wedding-gold-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </motion.a>
                </div>
                <p className="text-center font-cinzel text-[8px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-wedding-wine-accent lg:text-left">
                  {z.foot}
                </p>
              </motion.div>
            </motion.div>
          </LuxeCard>
        </motion.div>
      </div>
    </section>
  );
}
