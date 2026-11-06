import { useId } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import SparkleField from "@/components/invite/SparkleField";
import CoupleAuthShell from "./CoupleAuthShell";

function WeddingMark({ compact = false }) {
  const id = useId().replace(/:/g, "");
  const gold = `wg-gold-${id}`;
  const rose = `wg-rose-${id}`;

  return (
    <div className={`wedding-loader${compact ? " wedding-loader--compact" : ""}`} aria-hidden="true">
      <span className="wedding-loader__glow" />
      <span className="wedding-loader__spark wedding-loader__spark--1" />
      <span className="wedding-loader__spark wedding-loader__spark--2" />
      <span className="wedding-loader__spark wedding-loader__spark--3" />
      <svg className="wedding-loader__svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5E5B8" />
            <stop offset="48%" stopColor="#E5C158" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id={rose} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FA5C9F" />
            <stop offset="100%" stopColor="#A3235A" />
          </linearGradient>
        </defs>
        <g className="wedding-loader__orbit">
          <circle cx="80" cy="80" r="70" fill="none" stroke={`url(#${gold})`} strokeWidth="0.7" opacity="0.55" />
          <circle cx="80" cy="10" r="2.3" fill="#F5E5B8" />
        </g>
        <g className="wedding-loader__orbit wedding-loader__orbit--rev">
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="rgba(245, 229, 184, 0.55)"
            strokeWidth="0.6"
            strokeDasharray="1.5 7"
          />
        </g>
        <circle className="wedding-loader__band" cx="66" cy="86" r="26" stroke={`url(#${gold})`} />
        <circle className="wedding-loader__band" cx="94" cy="86" r="26" stroke={`url(#${gold})`} />
        <circle className="wedding-loader__shine" cx="66" cy="86" r="26" />
        <circle className="wedding-loader__shine wedding-loader__shine--rev" cx="94" cy="86" r="26" />
        <circle cx="66" cy="60" r="2.7" fill="#F5E5B8" />
        <circle cx="65.2" cy="59.2" r="0.85" fill="#fff" />
        <circle cx="94" cy="60" r="2.7" fill="#F5E5B8" />
        <circle cx="93.2" cy="59.2" r="0.85" fill="#fff" />
        <path
          className="wedding-loader__heart"
          fill={`url(#${rose})`}
          d="M80 93.5C80 93.5 71.2 86.2 71.2 79.6C71.2 75.4 74.2 73 77.4 73C78.8 73 80 74.3 80 74.3C80 74.3 81.2 73 82.6 73C85.8 73 88.8 75.4 88.8 79.6C88.8 86.2 80 93.5 80 93.5Z"
        />
      </svg>
    </div>
  );
}

export function WeddingButtonMark() {
  return (
    <span className="wedding-btn-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle className="wedding-btn-mark__ring" cx="9" cy="12" r="5.15" />
        <circle className="wedding-btn-mark__ring wedding-btn-mark__ring--rev" cx="15" cy="12" r="5.15" />
      </svg>
    </span>
  );
}

export function WeddingLoader({ label, compact = false }) {
  return (
    <div
      className={`wedding-loader-block${compact ? " wedding-loader-block--compact" : ""}`}
      role="status"
      aria-live="polite"
    >
      <WeddingMark compact={compact} />
      {label ? <p className="wedding-loader-block__label">{label}</p> : null}
    </div>
  );
}

/** Écran affiché avant l'enveloppe, le temps que l'invitation soit prête. */
export function InviteArrivalGate({ slow = false }) {
  const { m } = useI18n();
  const t = m.intro.gate;
  const subtitle = slow ? t.slow : t.subtitle;

  return (
    <motion.div
      className="intro-gate couple-auth-page--fit fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#25040E] px-5"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      role="status"
      aria-live="polite"
      aria-label={subtitle}
      data-testid="invite-arrival-gate"
    >
      <div className="pointer-events-none absolute inset-0 hero-atmosphere" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-25" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hero-veil" aria-hidden="true" />
      <div className="grain-overlay opacity-[0.04]" aria-hidden="true" />
      <SparkleField count={12} className="z-[2] opacity-80" />
      <div className="intro-gate-vignette pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />
      <div className="hero-corners intro-gate-corners pointer-events-none absolute z-[5]" aria-hidden="true">
        <span className="hero-corner hero-corner--tl" />
        <span className="hero-corner hero-corner--tr" />
        <span className="hero-corner hero-corner--bl" />
        <span className="hero-corner hero-corner--br" />
      </div>
      <div className="wedding-gate relative z-10">
        <WeddingMark />
        <p className="wedding-gate__eyebrow">{t.eyebrow}</p>
        <h1 className="wedding-gate__title">{t.title}</h1>
        <p className="wedding-gate__script">{t.script}</p>
        <p className="wedding-gate__sub">{subtitle}</p>
        <div className="wedding-gate__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </motion.div>
  );
}

/** Écran affiché pendant la vérification d'accès, avant le backoffice. */
export default function CoupleAuthGate() {
  const { m } = useI18n();
  const t = m.coupleSpace.gate;

  return (
    <CoupleAuthShell backLabel={t.back} backTo="/" showCoupleBanner viewportFit>
      <div className="wedding-gate" role="status" aria-live="polite" aria-label={t.subtitle} data-testid="couple-auth-gate">
        <WeddingMark />
        <p className="wedding-gate__eyebrow">{t.eyebrow}</p>
        <h1 className="wedding-gate__title">{t.title}</h1>
        <p className="wedding-gate__script">{t.script}</p>
        <p className="wedding-gate__sub">{t.subtitle}</p>
        <div className="wedding-gate__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </CoupleAuthShell>
  );
}
