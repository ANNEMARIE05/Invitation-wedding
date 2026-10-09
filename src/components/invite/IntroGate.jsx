import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";

export default function IntroGate({ onOpen }) {
  const { bride, groom, dateLabel } = useSettings();
  const { m } = useI18n();
  const letterBride = bride.charAt(0).toUpperCase();
  const letterGroom = groom.charAt(0).toUpperCase();
  const [opening, setOpening] = useState(false);

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(237,30,121,0.18),transparent_55%),linear-gradient(180deg,#fff5f9_0%,#ffe8f0_100%)]" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-4 sm:inset-8" aria-hidden="true">
        <span className="absolute top-0 left-0 h-12 w-12 border-l-2 border-t-2 border-[#ED1E79]/40 sm:h-16 sm:w-16" />
        <span className="absolute top-0 right-0 h-12 w-12 border-r-2 border-t-2 border-[#B8BCC8]/55 sm:h-16 sm:w-16" />
        <span className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-[#B8BCC8]/55 sm:h-16 sm:w-16" />
        <span className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-[#ED1E79]/40 sm:h-16 sm:w-16" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? -8 : 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="relative z-10 mb-6 text-center font-cinzel text-[10px] font-bold uppercase tracking-[0.42em] text-[#9B1B4A] sm:mb-8 sm:text-[11px]"
      >
        {m.intro.invited}
      </motion.p>

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
        className="relative z-10 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
      >
        <motion.div
          className="relative w-[88vw] max-w-[480px] aspect-[7/5]"
          animate={opening ? { y: 30, scale: 0.97 } : { y: [0, -8, 0], scale: 1 }}
          transition={opening ? { duration: 0.9, delay: 1.2, ease: EASE } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          data-testid="intro-envelope"
        >
          <div className="absolute inset-0 rounded-[0.35rem_0.35rem_0.2rem_0.2rem] bg-gradient-to-br from-[#5C0A20] to-[#2A050B] shadow-[0_40px_90px_rgba(92,10,32,0.35)]" />

          <motion.div
            className="absolute inset-x-4 top-3 bottom-3 z-10 bg-[#FFFBFC] shadow-[0_20px_60px_rgba(74,14,23,0.28)] rounded-sm"
            animate={opening ? { y: "-72%" } : { y: 0 }}
            transition={{ duration: 1.15, delay: 0.75, ease: EASE }}
            data-testid="intro-letter"
          >
            <div className="absolute inset-1.5 border border-[#ED1E79]/25 pointer-events-none rounded-sm" />
            <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
              <p className="font-display text-xl tracking-[0.2em] text-[#2A050B]">
                {letterBride}
                <span className="mx-1.5 font-cinzel text-xs tracking-[0.45em] text-[#ED1E79]">&</span>
                {letterGroom}
              </p>
              <p className="mt-3 font-cinzel text-[8px] sm:text-[9px] tracking-[0.38em] uppercase text-[#6B2440]">
                {m.intro.weddingTag}
              </p>
              <p className="mt-4 font-display text-3xl sm:text-4xl italic font-medium text-[#2A050B] leading-tight">
                {bride} & {groom}
              </p>
              <p className="mt-4 font-cinzel text-[9px] tracking-[0.28em] uppercase text-[#9B1B4A]">{dateLabel}</p>
            </div>
          </motion.div>

          <div
            className="absolute inset-0 z-20 rounded-[0.35rem_0.35rem_0.2rem_0.2rem] pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(180deg,#7A1538 0%,#5C0A20 100%)",
              boxShadow: "inset 0 -6px 24px rgba(0,0,0,0.22)",
            }}
          />

          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "56%",
              transformOrigin: "top center",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg,#9B1B4A 0%,#5C0A20 100%)",
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
              <div className="flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full border-2 border-[#E8EAEF]/90 bg-gradient-to-br from-[#ED1E79] to-[#5C0A20] shadow-[0_10px_28px_rgba(237,30,121,0.45)]">
                <span className="font-cinzel text-[10px] font-semibold tracking-[0.18em] text-[#FFFBFC]">
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
        className="relative z-10 mt-8 flex flex-col items-center gap-4"
      >
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
        <p className="font-cinzel text-[10px] tracking-[0.32em] uppercase text-[#6b2440]/90">{m.intro.tapEnvelope}</p>
      </motion.div>
    </motion.div>
  );
}
