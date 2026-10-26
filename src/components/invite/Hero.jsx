import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE, scrollToId } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import WeddingPetals from "./WeddingPetals";
import { FloralCornerOverlay, ROSE_PINK } from "./Flowers";
import TypewriterText from "./TypewriterText";
import CoupleNameMotion from "./CoupleNameMotion";

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
      <FloralCornerOverlay variant="hero" />
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
          <p className="flex items-center justify-center font-display text-[1.85rem] sm:text-[2.5rem] font-medium tracking-[0.12em] text-wedding-on-dark">
            <span className="hero-monogram-flower hero-monogram-flower--lead" aria-hidden="true">
              <img
                src={ROSE_PINK}
                alt=""
                className="hero-monogram-flower__image"
                decoding="async"
                draggable={false}
              />
            </span>
            {letterGroom}
            <span className="mx-2 sm:mx-3 inline-block font-cinzel text-sm sm:text-base font-normal tracking-[0.55em] text-wedding-rose-light align-middle">
              &
            </span>
            {letterBride}
            <span className="hero-monogram-flower hero-monogram-flower--trail" aria-hidden="true">
              <img
                src={ROSE_PINK}
                alt=""
                className="hero-monogram-flower__image"
                decoding="async"
                draggable={false}
              />
            </span>
          </p>
        </motion.div>

        <MaskedLine delay={0.6} start={start}>
          <span className="font-cinzel text-[9px] font-semibold sm:text-xs tracking-[0.38em] uppercase text-wedding-rose-bright sm:tracking-[0.5em]">
            {m.hero.tagline}
          </span>
        </MaskedLine>

        <h1
          className="relative z-[1] mt-6 font-display text-wedding-on-dark leading-[0.95]"
          data-testid="hero-names"
        >
          <MaskedLine delay={0.85} start={start}>
            <CoupleNameMotion preset="hero-groom" className="flex w-full justify-center">
              <TypewriterText
                text={groom}
                start={start}
                delay={200}
                speed={72}
                showCursor={false}
                className="hero-name couple-name-shimmer couple-name-shimmer--a text-[clamp(2.25rem,10vw,2.85rem)] italic font-medium sm:text-7xl lg:text-8xl"
              />
            </CoupleNameMotion>
          </MaskedLine>
          <MaskedLine delay={1.05} start={start}>
            <CoupleNameMotion preset="hero-amp" as="span" className="my-1 block">
              <span className="hero-amp couple-name-amp couple-name-amp--hero inline-block text-2xl not-italic font-normal tracking-[0.2em] sm:text-4xl">
                &
              </span>
            </CoupleNameMotion>
          </MaskedLine>
          <MaskedLine delay={1.25} start={start}>
            <CoupleNameMotion preset="hero-bride" className="flex w-full justify-center">
              <TypewriterText
                text={bride}
                start={start}
                delay={200 + groom.length * 72 + 280}
                speed={72}
                showCursor={false}
                className="hero-name couple-name-shimmer couple-name-shimmer--b text-[clamp(2.25rem,10vw,2.85rem)] italic font-medium sm:text-7xl lg:text-8xl"
              />
            </CoupleNameMotion>
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
            <ChevronDown size={14} className="btn-rejoindre-icon relative z-[1] rotate-[-90deg] sm:w-4 sm:h-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollToId("#faire-part")}
            className="hero-outline-btn rounded-full border border-wedding-rose-light/35 px-5 py-2.5 font-cinzel text-[9px] font-semibold uppercase tracking-[0.16em] text-wedding-rose-light transition-colors hover:border-wedding-rose/60 hover:text-wedding-on-dark sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.22em]"
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
        className="hero-scroll absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-wedding-rose-light/80 transition-colors hover:text-wedding-rose"
        aria-label={m.hero.scroll}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown size={28} strokeWidth={1.2} />
        </motion.div>
      </motion.button>
    </section>
  );
}
