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
  const [flapBehind, setFlapBehind] = useState(false);
  const letterBride = bride.charAt(0).toUpperCase();
  const letterGroom = groom.charAt(0).toUpperCase();

  const open = () => {
    if (opening) return;
    window.dispatchEvent(new Event("wedding-music-start"));
    setOpening(true);
    // Le rabat passe derrière la lettre dès qu'il dépasse la verticale
    setTimeout(() => setFlapBehind(true), 560);
    setTimeout(onOpen, 2600);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 1, ease: EASE }}
      className="intro-gate fixed inset-0 z-[80] flex flex-col items-center justify-between py-5 px-4 sm:py-7 sm:px-6 overflow-hidden"
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

      {/* Header section: names and welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? -12 : 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="relative z-10 flex flex-col items-center shrink-0 mb-2 sm:mb-4"
      >
        <p className="text-center font-cinzel text-[11px] sm:text-xs font-semibold uppercase tracking-[0.38em] text-wedding-rose-light">
          {m.intro.invited}
        </p>
        <ClassicRule className="mt-2.5 sm:mt-3 max-w-[9rem] sm:max-w-[11rem]" tone="light" />
        <p className="mt-2.5 sm:mt-3 font-script text-2xl sm:text-4xl md:text-5xl text-[#FFF3D6] drop-shadow-[0_2px_14px_rgba(212,175,55,0.75)]">
          <TypewriterText text={coupleLabel} start={!opening} delay={600} speed={55} flowerAtStart flowerAtEnd />
        </p>
      </motion.div>

      {/* Envelope button with 3D flap and sliding letter */}
      <motion.button
        type="button"
        onClick={open}
        data-testid="open-invitation-button"
        aria-label={m.intro.openAria}
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        whileHover={opening ? undefined : { scale: 1.02 }}
        whileTap={opening ? undefined : { scale: 0.98 }}
        style={{ perspective: 1400 }}
        disabled={opening}
        className="intro-envelope-stage relative z-10 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default my-auto max-h-[44vh] shrink-0"
      >
        <div className="intro-envelope-glow pointer-events-none" aria-hidden="true" />
        <motion.div
          className="intro-envelope-body relative w-[min(88vw,430px)] aspect-[7/4.8] max-h-[38vh]"
          animate={opening ? { y: 40, scale: 0.97 } : { y: [0, -6, 0], scale: 1 }}
          transition={opening ? { duration: 1, delay: 0.7, ease: EASE } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          data-testid="intro-envelope"
        >
          {/* Envelope Back Plate */}
          <div
            className="absolute inset-0 rounded-[0.35rem_0.35rem_0.2rem_0.2rem] bg-gradient-to-br from-wedding-wine-accent via-wedding-wine to-wedding-wine-deep shadow-[0_48px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,175,55,0.18)]"
            style={{ zIndex: 0 }}
          />
          <div
            className="absolute inset-0 rounded-[0.35rem_0.35rem_0.2rem_0.2rem] bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none"
            style={{ zIndex: 1 }}
          />

          {/* The Letter Card inside: slides up out of the pocket */}
          <motion.div
            className="absolute inset-x-3.5 sm:inset-x-4 top-2.5 sm:top-3 bottom-2.5 sm:bottom-3 rounded-sm bg-wedding-on-dark shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
            style={{ zIndex: 10 }}
            initial={false}
            animate={opening ? { y: "-78%", scale: 1.03 } : { y: 0, scale: 1 }}
            transition={{ duration: 1.25, delay: 0.75, ease: EASE }}
            data-testid="intro-letter"
          >
            <div className="absolute inset-1 sm:inset-1.5 rounded-sm border border-wedding-gold-accent/40 pointer-events-none" />
            <div className="absolute inset-2 sm:inset-2.5 rounded-sm border border-wedding-rose/20 pointer-events-none" />
            <div className="relative flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center">
              <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.38em] uppercase text-wedding-wine-accent/90">
                {m.intro.weddingTag}
              </p>
              <ClassicRule className="my-2 sm:my-3 max-w-[8rem] sm:max-w-[9.5rem]" gem="♥" />
              <p className="font-display text-lg sm:text-2xl tracking-[0.2em] font-semibold text-wedding-ink">
                {initials}
              </p>
              <p className="mt-1.5 sm:mt-2 font-display text-xl sm:text-3xl font-medium italic leading-tight text-wedding-ink">
                {coupleLabel}
              </p>
              <ClassicRule className="my-2 sm:my-3 max-w-[7rem] sm:max-w-[8.5rem]" />
              <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-wedding-wine-accent font-medium">
                {dateLabel}
              </p>
            </div>
          </motion.div>

          {/* Front Pocket: covers the letter from sides and bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            {/* Left triangular fold */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 50% 50%, 0 100%)",
                background: "linear-gradient(135deg, var(--wine-accent) 0%, var(--wine) 60%, var(--wine-deep) 100%)",
              }}
            />
            {/* Right triangular fold */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(100% 0, 50% 50%, 100% 100%)",
                background: "linear-gradient(225deg, var(--wine-accent) 0%, var(--wine) 60%, var(--wine-deep) 100%)",
              }}
            />
            {/* Bottom fold overlapping cleanly at center */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
                background: "linear-gradient(0deg, var(--wine-deep) 0%, var(--wine) 65%, var(--wine-accent) 100%)",
                filter: "drop-shadow(0 -3px 8px rgba(0, 0, 0, 0.35))",
              }}
            />
            {/* Subtle gold line on the bottom fold */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
                boxShadow: "inset 0 1px 0 rgba(212, 175, 55, 0.6)",
              }}
            />
          </div>

          {/* Top Flap: in front when closed, flips open and drops behind the letter */}
          <motion.div
            className="intro-envelope-flap-container absolute top-0 left-0 right-0 origin-top"
            style={{
              height: "52%",
              zIndex: flapBehind ? 5 : 30,
              transformPerspective: 1200,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
            initial={false}
            animate={{ rotateX: opening ? 180 : 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            data-testid="intro-flap"
          >
            {/* Flap Outer Face (faces user when closed) */}
            <div
              className="intro-envelope-flap-face"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, var(--rose) 0%, var(--wine-accent) 55%, var(--wine-deep) 100%)",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, transparent 70%, rgba(212, 175, 55, 0.5) 100%)",
                }}
              />
            </div>

            {/* Flap Lining Face (visible when open 180deg, pointing UP behind letter) */}
            <div
              className="intro-envelope-flap-face"
              style={{
                transform: "rotateY(180deg)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, var(--wine-deep) 0%, var(--wine) 45%, var(--wine-accent) 100%)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "radial-gradient(ellipse at 50% 100%, rgba(212, 175, 55, 0.45) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-[3px] pointer-events-none opacity-60"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  borderTop: "1.5px solid rgba(212, 175, 55, 0.65)",
                }}
              />
            </div>
          </motion.div>

          {/* Wax Seal at the center junction */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{ transform: "translate(-50%, -50%)", zIndex: 40 }}
          >
            <motion.div
              animate={opening ? { scale: [1, 1.35, 0], opacity: [1, 1, 0], rotate: [0, 12, 0] } : { scale: 1 }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
              data-testid="intro-seal"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-wedding-gold-accent/80 bg-gradient-to-br from-wedding-rose-bright via-wedding-rose to-wedding-wine-deep shadow-[0_14px_36px_rgba(237,30,121,0.55),0_0_0_4px_rgba(212,175,55,0.25)]">
                <span className="font-cinzel text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-wedding-on-dark drop-shadow-sm">
                  {letterGroom}&{letterBride}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      {/* Footer section: button and instructions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? 12 : 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 shrink-0 mt-2 sm:mt-4"
      >
        <ClassicRule className="max-w-[8rem] sm:max-w-[9rem]" tone="light" gem="✦" />
        <button
          type="button"
          onClick={open}
          disabled={opening}
          data-testid="intro-open-cta"
          className="btn-rejoindre text-xs sm:text-sm py-2.5 px-6 sm:py-3 sm:px-8"
        >
          <span className="relative z-[1]">{m.intro.open}</span>
          <ArrowRight size={16} className="btn-rejoindre-icon relative z-[1]" aria-hidden />
        </button>
        <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#F2D7DF] font-medium">
          {m.intro.tapEnvelope}
        </p>
      </motion.div>
    </motion.div>
  );
}
