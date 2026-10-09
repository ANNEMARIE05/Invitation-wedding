import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE, scrollToId } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import WeddingPetals from "./WeddingPetals";

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

const ORBS = [
  { className: "hero-orb hero-orb--magenta left-[8%] top-[18%] h-[min(42vw,320px)] w-[min(42vw,320px)]", delay: 0 },
  { className: "hero-orb hero-orb--wine right-[5%] bottom-[12%] h-[min(50vw,380px)] w-[min(50vw,380px)]", delay: 2 },
  { className: "hero-orb hero-orb--silver left-[42%] top-[55%] h-[min(28vw,200px)] w-[min(28vw,200px)]", delay: 4 },
];

export default function Hero({ start = true }) {
  const { bride, groom } = useSettings();
  const { m } = useI18n();
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const letterBride = bride.charAt(0).toUpperCase();
  const letterGroom = groom.charAt(0).toUpperCase();

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0 hero-atmosphere" aria-hidden="true" />
      <div className="absolute inset-0 hero-grid opacity-40" aria-hidden="true" />
      {ORBS.map((o) => (
        <div
          key={o.className}
          className={o.className}
          style={{ animationDelay: `${o.delay}s` }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 hero-veil" aria-hidden="true" />
      <WeddingPetals active={start} density={16} variant="hero" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
        className="hero-corners pointer-events-none absolute z-20"
        aria-hidden="true"
      >
        <span className="hero-corner hero-corner--tl" />
        <span className="hero-corner hero-corner--tr" />
        <span className="hero-corner hero-corner--bl" />
        <span className="hero-corner hero-corner--br" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="hero-lockup relative z-30 mx-auto mb-6 max-w-3xl px-4 pt-16 text-center sm:mb-10 sm:px-6 sm:pt-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={start ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          className="hero-monogram mx-auto mb-7 sm:mb-9"
          data-testid="hero-monogram"
        >
          <p className="font-display text-[2.15rem] sm:text-[2.5rem] font-medium tracking-[0.12em] text-[#FFFBFC]">
            {letterBride}
            <span className="mx-2 sm:mx-3 inline-block font-cinzel text-sm sm:text-base font-normal tracking-[0.55em] text-[#FFD6E0] align-middle">
              &
            </span>
            {letterGroom}
          </p>
        </motion.div>

        <MaskedLine delay={0.6} start={start}>
          <span className="font-cinzel text-[11px] font-semibold sm:text-xs tracking-[0.5em] uppercase text-[#F7338B]">
            {m.hero.tagline}
          </span>
        </MaskedLine>

        <h1 className="mt-6 font-display text-[#FAF7F2] leading-[0.95]" data-testid="hero-names">
          <MaskedLine delay={0.85} start={start}>
            <span className="hero-name text-6xl italic font-medium sm:text-7xl lg:text-8xl bg-gradient-to-br from-[#FFFBFC] via-[#FFD6E0] to-[#FFFBFC] bg-clip-text text-transparent">{bride}</span>
          </MaskedLine>
          <MaskedLine delay={1.05} start={start}>
            <span className="hero-amp my-1 inline-block font-display text-3xl not-italic font-normal tracking-[0.2em] text-[#ED1E79] sm:text-4xl">&</span>
          </MaskedLine>
          <MaskedLine delay={1.25} start={start}>
            <span className="hero-name text-6xl italic font-medium sm:text-7xl lg:text-8xl text-[#FFFBFC]">{groom}</span>
          </MaskedLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, delay: 1.55, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
        >
          <button
            type="button"
            onClick={() => scrollToId("#rsvp")}
            className="btn-rejoindre btn-hero-cta"
            data-testid="hero-rsvp-button"
          >
            <span className="relative z-[1]">{m.hero.confirm}</span>
            <ChevronDown size={16} className="btn-rejoindre-icon relative z-[1] rotate-[-90deg]" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollToId("#faire-part")}
            className="rounded-full border border-[#FFD6E0]/35 px-6 py-3 font-cinzel text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FFD6E0] transition-colors hover:border-[#ED1E79]/60 hover:text-[#FFFBFC]"
          >
            {m.hero.viewInvite}
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        data-testid="hero-scroll-button"
        onClick={() => scrollToId("#versets")}
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="hero-scroll absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[#FFD6E0]/80 transition-colors hover:text-[#ED1E79]"
        aria-label={m.hero.scroll}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown size={28} strokeWidth={1.2} />
        </motion.div>
      </motion.button>
    </section>
  );
}
