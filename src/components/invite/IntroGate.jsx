import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import WeddingPetals from "@/components/invite/WeddingPetals";
import SparkleField from "@/components/invite/SparkleField";
import ClassicRule from "@/components/invite/ClassicRule";
import TypewriterText from "@/components/invite/TypewriterText";
const INTRO_ORBS = [
  { className: "hero-orb hero-orb--magenta left-[6%] top-[14%] h-[min(48vw,340px)] w-[min(48vw,340px)]", delay: 0 },
  { className: "hero-orb hero-orb--wine right-[4%] bottom-[10%] h-[min(52vw,400px)] w-[min(52vw,400px)]", delay: 2.5 },
  { className: "hero-orb hero-orb--silver left-[38%] top-[58%] h-[min(32vw,220px)] w-[min(32vw,220px)]", delay: 4.5 },
];

export default function IntroGate({ onOpen }) {
  const { dateLabel, coupleLabel, initials, bride, groom } = useSettings();
  const { m } = useI18n();
  const [opening, setOpening] = useState(false);
  const letterBride = bride.charAt(0).toUpperCase();
  const letterGroom = groom.charAt(0).toUpperCase();

  const open = () => {
    if (opening) return;
    window.dispatchEvent(new Event("wedding-music-start"));
    setOpening(true);
    setTimeout(onOpen, 2400);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 1, ease: EASE }}
      className="intro-gate fixed inset-0 z-[80] flex flex-col items-center justify-center px-5 overflow-hidden"
      data-testid="intro-gate"
    >
      <div className="pointer-events-none absolute inset-0 hero-atmosphere" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-25" aria-hidden="true" />
      {INTRO_ORBS.map((o) => (
        <div key={o.className} className={`pointer-events-none absolute ${o.className}`} style={{ animationDelay: `${o.delay}s` }} aria-hidden="true" />
      ))}
      <div className="pointer-events-none absolute inset-0 hero-veil" aria-hidden="true" />
      <div className="grain-overlay opacity-[0.04]" aria-hidden="true" />
      <WeddingPetals active={!opening} density={18} variant="hero" />
      <SparkleField count={14} className="z-[2] opacity-80" />
      <div className="intro-gate-vignette pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />

      <div className="hero-corners intro-gate-corners pointer-events-none absolute z-[5]" aria-hidden="true">
        <span className="hero-corner hero-corner--tl" />
        <span className="hero-corner hero-corner--tr" />
        <span className="hero-corner hero-corner--bl" />
        <span className="hero-corner hero-corner--br" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? -8 : 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="relative z-10 mb-5 flex flex-col items-center sm:mb-7"
      >
        <p className="text-center font-cinzel text-xs font-semibold uppercase tracking-[0.42em] text-wedding-rose-light sm:text-sm">
          {m.intro.invited}
        </p>
        <ClassicRule className="mt-4 max-w-[11rem]" tone="light" />
        <p className="mt-4 font-script text-3xl text-[#FFF3D6] drop-shadow-[0_2px_14px_rgba(212,175,55,0.75)] sm:text-4xl md:text-5xl">
          <TypewriterText text={coupleLabel} start={!opening} delay={600} speed={55} flowerAtStart flowerAtEnd />
        </p>
      </motion.div>

      <motion.button
        type="button"
        onClick={open}
        data-testid="open-invitation-button"
        aria-label={m.intro.openAria}
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
        whileHover={opening ? undefined : { scale: 1.02 }}
        whileTap={opening ? undefined : { scale: 0.98 }}
        style={{ perspective: 1400 }}
        disabled={opening}
        className="intro-envelope-stage relative z-10 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
      >
        <div className="intro-envelope-glow pointer-events-none" aria-hidden="true" />
        <motion.div
          className="intro-envelope-body relative w-[88vw] max-w-[480px] aspect-[7/5]"
          animate={opening ? { y: 30, scale: 0.97 } : { y: [0, -8, 0], scale: 1 }}
          transition={opening ? { duration: 0.9, delay: 1.2, ease: EASE } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          data-testid="intro-envelope"
        >
          <div className="absolute inset-0 rounded-[0.35rem_0.35rem_0.2rem_0.2rem] bg-gradient-to-br from-wedding-wine-accent via-wedding-wine to-wedding-wine-deep shadow-[0_48px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,175,55,0.15)]" />

          <motion.div
            className="absolute inset-x-4 top-3 bottom-3 z-10 rounded-sm bg-wedding-on-dark shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
            animate={opening ? { y: "-72%" } : { y: 0 }}
            transition={{ duration: 1.15, delay: 0.75, ease: EASE }}
            data-testid="intro-letter"
          >
            <div className="absolute inset-1.5 rounded-sm border border-wedding-gold-accent/35 pointer-events-none" />
            <div className="absolute inset-2.5 rounded-sm border border-wedding-rose/18 pointer-events-none" />
            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="font-cinzel text-[10px] tracking-[0.38em] uppercase text-wedding-wine-accent/85 sm:text-xs">{m.intro.weddingTag}</p>
              <ClassicRule className="my-3 max-w-[10rem]" gem="♥" />
              <p className="font-display text-xl tracking-[0.2em] text-wedding-ink sm:text-2xl">{initials}</p>
              <p className="mt-3 font-display text-2xl font-medium italic leading-tight text-wedding-ink sm:text-3xl">
                {coupleLabel}
              </p>
              <ClassicRule className="my-4 max-w-[9rem]" />
              <p className="font-cinzel text-[10px] tracking-[0.28em] uppercase text-wedding-wine-accent sm:text-[11px]">{dateLabel}</p>
            </div>
          </motion.div>

          <div
            className="absolute inset-0 z-20 rounded-[0.35rem_0.35rem_0.2rem_0.2rem] pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(180deg, var(--wine-accent) 0%, var(--wine-deep) 55%, var(--wine) 100%)",
              boxShadow: "inset 0 -8px 28px rgba(0,0,0,0.35)",
            }}
          />

          <motion.div
            className="intro-envelope-flap absolute top-0 left-0 right-0"
            style={{
              height: "56%",
              transformOrigin: "top center",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg, var(--rose) 0%, var(--wine-accent) 45%, var(--wine-deep) 100%)",
            }}
            animate={opening ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            data-testid="intro-flap"
          />

          <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={opening ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: [0, 10, 0] } : { scale: 1 }}
              transition={{ duration: 0.55, times: [0, 0.5, 1] }}
              data-testid="intro-seal"
            >
              <div className="flex h-[3.65rem] w-[3.65rem] items-center justify-center rounded-full border-2 border-wedding-gold-accent/75 bg-gradient-to-br from-wedding-rose-bright via-wedding-rose to-wedding-wine-deep shadow-[0_14px_36px_rgba(237,30,121,0.55),0_0_0_4px_rgba(212,175,55,0.2)]">
                <span className="font-cinzel text-[10px] font-semibold tracking-[0.18em] text-wedding-on-dark">
                  {letterBride}&{letterGroom}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: 0.85, delay: 1.15, ease: EASE }}
        className="relative z-10 mt-8 flex flex-col items-center gap-5"
      >
        <ClassicRule className="max-w-[9rem]" tone="light" gem="✦" />
        <button
          type="button"
          onClick={open}
          disabled={opening}
          data-testid="intro-open-cta"
          className="btn-rejoindre"
        >
          <span className="relative z-[1]">{m.intro.open}</span>
          <ArrowRight size={17} className="btn-rejoindre-icon relative z-[1]" aria-hidden />
        </button>
        <p className="font-cinzel text-xs tracking-[0.28em] uppercase text-[#F2D7DF] font-medium sm:text-sm">{m.intro.tapEnvelope}</p>
      </motion.div>
    </motion.div>
  );
}
