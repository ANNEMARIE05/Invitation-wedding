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
    setTimeout(() => setFlapBehind(true), 600);
    setTimeout(onOpen, 2200);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.85, ease: EASE }}
      className="intro-gate fixed inset-0 z-[80] flex flex-col items-center justify-between py-5 px-4 sm:py-7 sm:px-6 overflow-hidden bg-[#25040E]"
      style={{ pointerEvents: opening ? "none" : "auto" }}
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
          <TypewriterText text={coupleLabel} start={!opening} delay={600} speed={55} flowerAtStart flowerAtEnd instantOnMobile />
        </p>
      </motion.div>

      {/* Interactive Envelope */}
      <motion.div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") open(); }}
        data-testid="open-invitation-button"
        aria-label={m.intro.openAria}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        whileHover={opening ? undefined : { scale: 1.015 }}
        whileTap={opening ? undefined : { scale: 0.985 }}
        className="intro-envelope-stage relative z-10 cursor-pointer border-0 bg-transparent p-0 my-auto shrink-0 select-none outline-none focus-visible:ring-2 focus-visible:ring-wedding-gold-accent"
      >
        <div className="intro-envelope-glow pointer-events-none" aria-hidden="true" />
        <motion.div
          className="intro-envelope-body relative w-[min(88vw,420px)] max-h-[38vh]"
          style={{
            aspectRatio: "7 / 4.8",
            minHeight: "220px",
          }}
          animate={opening ? { y: 28, scale: 0.98 } : { y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          data-testid="intro-envelope"
        >
          {/* Envelope Back Plate */}
          <div
            className="absolute inset-0 rounded-[0.45rem] shadow-[0_30px_70px_rgba(0,0,0,0.65),0_0_0_1px_rgba(212,175,55,0.35)]"
            style={{
              zIndex: 1,
              background: "linear-gradient(145deg, #7E1538 0%, #5C0D26 50%, #3D0617 100%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-[0.45rem] bg-gradient-to-b from-black/40 via-transparent to-black/25 pointer-events-none"
            style={{ zIndex: 2 }}
          />

          {/* The Letter Card inside: slides up out of the pocket */}
          <motion.div
            className="absolute inset-x-3.5 sm:inset-x-4 top-2.5 sm:top-3 bottom-2.5 sm:bottom-3 rounded-[0.35rem] bg-[#FFF9FB] shadow-[0_20px_50px_rgba(0,0,0,0.45)] pointer-events-none"
            style={{ zIndex: 10 }}
            initial={false}
            animate={opening ? { y: "-74%", scale: 1.02 } : { y: 0, scale: 1 }}
            transition={{ duration: 1.15, delay: 0.55, ease: EASE }}
            data-testid="intro-letter"
          >
            <div className="absolute inset-1 sm:inset-1.5 rounded-sm border border-[#D4AF37]/45 pointer-events-none" />
            <div className="absolute inset-2 sm:inset-2.5 rounded-sm border border-[#A3235A]/20 pointer-events-none" />
            <div className="relative flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center">
              <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.38em] uppercase text-[#A3235A] font-semibold">
                {m.intro.weddingTag}
              </p>
              <ClassicRule className="my-1.5 sm:my-2.5 max-w-[8rem] sm:max-w-[9.5rem]" gem="♥" />
              <p className="font-display text-lg sm:text-2xl tracking-[0.2em] font-semibold text-[#520B2A]">
                {initials}
              </p>
              <p className="mt-1 sm:mt-1.5 font-display text-xl sm:text-3xl font-medium italic leading-tight text-[#520B2A]">
                {coupleLabel}
              </p>
              <ClassicRule className="my-1.5 sm:my-2.5 max-w-[7rem] sm:max-w-[8.5rem]" />
              <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#A3235A] font-medium">
                {dateLabel}
              </p>
            </div>
          </motion.div>

          {/* Front Pocket: SVG perfectly covering sides and bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 400 270"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pocket-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8E1840" />
                  <stop offset="60%" stopColor="#680E2B" />
                  <stop offset="100%" stopColor="#4A081E" />
                </linearGradient>
                <linearGradient id="pocket-right-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8E1840" />
                  <stop offset="60%" stopColor="#680E2B" />
                  <stop offset="100%" stopColor="#4A081E" />
                </linearGradient>
                <linearGradient id="pocket-bottom-grad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#3D0617" />
                  <stop offset="65%" stopColor="#680E2B" />
                  <stop offset="100%" stopColor="#8E1840" />
                </linearGradient>
                <filter id="bottom-fold-shadow" x="-10%" y="-30%" width="120%" height="160%">
                  <feDropShadow dx="0" dy="-4" stdDeviation="5" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>
              {/* Left triangular fold */}
              <polygon points="0,0 200,135 0,270" fill="url(#pocket-left-grad)" />
              {/* Right triangular fold */}
              <polygon points="400,0 200,135 400,270" fill="url(#pocket-right-grad)" />
              {/* Bottom fold overlapping cleanly at center */}
              <polygon points="0,270 200,135 400,270" fill="url(#pocket-bottom-grad)" filter="url(#bottom-fold-shadow)" />
              {/* Gold foil seam lines */}
              <polyline points="0,270 200,135 400,270" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            </svg>
          </div>

          {/* Top Flap: in front when closed, flips open 180deg and rests behind the letter */}
          <motion.div
            className="intro-envelope-flap-container absolute top-0 left-0 right-0 origin-top pointer-events-none"
            style={{
              height: "52%",
              zIndex: flapBehind ? 5 : 30,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
            initial={false}
            animate={{ rotateX: opening ? 180 : 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            data-testid="intro-flap"
          >
            {/* Flap Outer Face (visible when closed / opening 0deg -> 90deg) */}
            <motion.div
              className="intro-envelope-flap-face"
              initial={false}
              animate={{ opacity: opening ? [1, 1, 0, 0] : 1 }}
              transition={{ duration: 0.85, delay: 0.15, times: [0, 0.52, 0.58, 1] }}
              style={{
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))",
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="flap-outer-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#9B1B4A" />
                    <stop offset="55%" stopColor="#7E1538" />
                    <stop offset="100%" stopColor="#5C0D26" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 400,0 200,140" fill="url(#flap-outer-grad)" />
                <polyline points="0,0 200,140 400,0" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              </svg>
            </motion.div>

            {/* Flap Lining Face (visible when open 180deg, pointing UP behind the letter) */}
            <motion.div
              className="intro-envelope-flap-face intro-envelope-flap-face--back pointer-events-none"
              initial={false}
              animate={{ opacity: opening ? [0, 0, 1, 1] : 0 }}
              transition={{ duration: 0.85, delay: 0.15, times: [0, 0.52, 0.58, 1] }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="flap-inner-grad" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#3D0617" />
                    <stop offset="50%" stopColor="#5C0D26" />
                    <stop offset="100%" stopColor="#7E1538" />
                  </linearGradient>
                  <radialGradient id="flap-inner-gold" cx="50%" cy="100%" r="70%">
                    <stop offset="0%" stopColor="rgba(212, 175, 55, 0.35)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <polygon points="0,0 400,0 200,140" fill="url(#flap-inner-grad)" />
                <polygon points="0,0 400,0 200,140" fill="url(#flap-inner-gold)" />
                <polyline points="0,0 200,140 400,0" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1.5" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Wax Seal at the center junction */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{ transform: "translate(-50%, -50%)", zIndex: 40 }}
          >
            <motion.div
              animate={opening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              data-testid="intro-seal"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-wedding-gold-accent bg-gradient-to-br from-[#B82352] via-[#8E1840] to-[#4A081E] shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_0_3px_rgba(212,175,55,0.25)]">
                <span className="font-cinzel text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-wedding-on-dark drop-shadow-sm">
                  {letterGroom}&{letterBride}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

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
