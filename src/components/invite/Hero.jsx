import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE, IMAGES, scrollToId } from "@/lib/invite-data";
import { usePhoto } from "@/lib/photos";
import { useSettings } from "@/lib/settings";
import { FLORALS, Floral, Petals } from "./Flowers";

const MaskedLine = ({ children, delay, start }) => (
  <span className="block overflow-hidden pb-2 -mb-2">
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={start ? { y: "0%" } : { y: "115%" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero({ start = true }) {
  const { bride, groom, initials, dateIso, venue } = useSettings();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 220]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const heroImg = usePhoto("hero", IMAGES.hero);
  const when = new Date(dateIso);
  const weekday = when.toLocaleDateString("fr-FR", { weekday: "long" });
  const monthYear = when.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <img src={heroImg} alt={`${bride} et ${groom}`} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 vignette-wine" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(42,5,11,0.42)_100%)]" />

      <div className="pointer-events-none absolute inset-3 sm:inset-6 z-10" aria-hidden="true">
        <span className="absolute top-0 left-0 h-10 w-10 border-l border-t border-[#D4AF37]/75 sm:h-14 sm:w-14" />
        <span className="absolute top-0 right-0 h-10 w-10 border-r border-t border-[#D4AF37]/75 sm:h-14 sm:w-14" />
        <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-[#D4AF37]/75 sm:h-14 sm:w-14" />
        <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-[#D4AF37]/75 sm:h-14 sm:w-14" />
        <span className="absolute inset-2 border border-[#FAF7F2]/15 sm:inset-3" />
      </div>

      <Petals count={8} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 1.4, delay: 1.1, ease: EASE }}
        className="pointer-events-none absolute -bottom-6 -right-10 z-[15] w-24 sm:-right-6 sm:w-44 lg:w-60"
        aria-hidden="true"
      >
        <Floral src={FLORALS.bouquet} className="w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={start ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 1.4, delay: 1.25, ease: EASE }}
        className="pointer-events-none absolute -left-16 top-12 z-[15] hidden w-40 lg:block xl:-left-8 xl:w-48"
        aria-hidden="true"
      >
        <Floral src={FLORALS.tige} className="w-full" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="hero-lockup relative z-30 mx-auto mb-6 max-w-3xl px-6 pt-16 text-center sm:mb-10 sm:pt-20">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={start ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.35 }}
          className="hero-monogram mx-auto mb-6 relative h-24 w-24 animate-float-soft sm:mb-8 sm:h-28 sm:w-28"
          data-testid="hero-monogram"
        >
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/70 animate-seal-spin" style={{ borderStyle: "dashed" }} />
          <div className="absolute inset-2 rounded-full bg-[#4A0E17]/85 backdrop-blur-sm border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_10px_40px_rgba(42,5,11,0.5)]">
            <span className="font-script text-3xl text-[#D4AF37]">{initials}</span>
          </div>
        </motion.div>

        <MaskedLine delay={0.6} start={start}>
          <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.5em] uppercase text-[#D4AF37]">
            Nous nous marions
          </span>
        </MaskedLine>

        <h1 className="mt-6 font-display text-[#FAF7F2] leading-[0.95]" data-testid="hero-names">
          <MaskedLine delay={0.85} start={start}>
            <span className="hero-name text-6xl italic font-medium sm:text-7xl lg:text-8xl">{bride}</span>
          </MaskedLine>
          <MaskedLine delay={1.05} start={start}>
            <span className="hero-amp my-1 inline-block font-script text-4xl text-[#C48B92] sm:text-5xl">&</span>
          </MaskedLine>
          <MaskedLine delay={1.25} start={start}>
            <span className="hero-name text-6xl italic font-medium sm:text-7xl lg:text-8xl">{groom}</span>
          </MaskedLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 1.7, ease: EASE }}
          className="hero-date mt-6 flex flex-col items-center sm:mt-8"
          data-testid="hero-date-badge"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#D4AF37]/70 sm:w-16" />
            <span className="font-cinzel text-[10px] uppercase tracking-[0.45em] text-[#D4AF37] sm:text-xs">{weekday}</span>
            <span className="h-px w-10 bg-[#D4AF37]/70 sm:w-16" />
          </div>
          <p className="hero-day mt-2 font-display text-5xl leading-none text-[#FAF7F2] sm:mt-3 sm:text-6xl">{when.getDate()}</p>
          <p className="mt-2 font-cinzel text-[11px] uppercase tracking-[0.38em] text-[#FAF7F2]">{monthYear}</p>
          <p className="mt-4 font-cinzel text-[10px] uppercase tracking-[0.32em] text-[#4A0E17] sm:text-xs">{venue.name}</p>
        </motion.div>
      </motion.div>

      <motion.button
        data-testid="hero-scroll-button"
        onClick={() => scrollToId("#histoire")}
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="hero-scroll absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[#4A0E17]/80 transition-colors hover:text-[#D4AF37]"
        aria-label="Défiler"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown size={28} strokeWidth={1.2} />
        </motion.div>
      </motion.button>
    </section>
  );
}
