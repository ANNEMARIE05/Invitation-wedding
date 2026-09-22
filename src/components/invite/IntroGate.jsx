import { useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";

export default function IntroGate({ onOpen }) {
  const { bride, groom, initials, dateLabel } = useSettings();
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    window.dispatchEvent(new Event("wedding-music-start"));
    setOpening(true);
    setTimeout(onOpen, 2400);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1, ease: EASE }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center px-5 overflow-hidden bg-[radial-gradient(ellipse_at_center,#FCF6F0_0%,#F4E5E0_100%)]"
      data-testid="intro-gate"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? -16 : 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="relative z-10 text-center mb-9"
      >
        <p className="font-cinzel font-bold text-[10px] sm:text-[11px] tracking-[0.45em] uppercase text-[#C48B92]">
          Vous êtes invité·e·s au mariage de
        </p>
        <h1 className="mt-3 font-script text-5xl sm:text-6xl text-[#4A0E17] leading-tight" data-testid="intro-names">
          {bride} <span className="text-[#C48B92]">&</span> {groom}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#D4AF37]/70" />
          <span className="text-[#D4AF37]">✦</span>
          <span className="h-px w-12 bg-[#D4AF37]/70" />
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={open}
        data-testid="open-invitation-button"
        aria-label="Ouvrir l'invitation"
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
        whileHover={opening ? undefined : { scale: 1.03 }}
        whileTap={opening ? undefined : { scale: 0.98 }}
        style={{ perspective: 1400 }}
        className="relative z-10 cursor-pointer"
      >
        <motion.div
          className="relative w-[88vw] max-w-[520px] aspect-[7/5]"
          animate={opening ? { y: 30, scale: 0.97 } : { y: [0, -10, 0], scale: 1 }}
          transition={opening ? { duration: 0.9, delay: 1.2, ease: EASE } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          data-testid="intro-envelope"
        >
          {/* dos de l'enveloppe */}
          <div className="absolute inset-0 rounded-md bg-[#3B0910] shadow-[0_40px_90px_rgba(74,14,23,0.35)]" />

          {/* la lettre */}
          <motion.div
            className="absolute inset-x-4 top-3 bottom-3 z-10 bg-[#FAF7F2] shadow-[0_20px_60px_rgba(74,14,23,0.35)]"
            animate={opening ? { y: "-72%" } : { y: 0 }}
            transition={{ duration: 1.15, delay: 0.75, ease: EASE }}
            data-testid="intro-letter"
          >
            <div className="absolute inset-1.5 border border-[#D4AF37]/50 pointer-events-none" />
            <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
              <p className="font-script text-2xl text-[#D4AF37]">{initials}</p>
              <p className="mt-2 font-cinzel text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-[#8C7B7E]">
                Célébration du mariage
              </p>
              <p className="mt-3 font-script text-4xl sm:text-5xl text-[#4A0E17] leading-tight">
                {bride} <span className="text-2xl text-[#C48B92]">&</span> {groom}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-[#D4AF37]/60" />
                <span className="text-[#D4AF37] text-xs">✦</span>
                <span className="h-px w-8 bg-[#D4AF37]/60" />
              </div>
              <p className="mt-3 font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#5C4F51]">{dateLabel}</p>
            </div>
          </motion.div>

          {/* poche avant */}
          <div
            className="absolute inset-0 z-20 rounded-md pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(180deg,#5A1120 0%,#4A0E17 100%)",
              boxShadow: "inset 0 -6px 24px rgba(0,0,0,0.25)",
            }}
          />

          {/* rabat */}
          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "56%",
              transformOrigin: "top center",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg,#6B1724 0%,#4A0E17 100%)",
            }}
            animate={opening ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            data-testid="intro-flap"
          />

          {/* cachet de cire */}
          <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={opening ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: [0, 10, 0] } : { scale: 1 }}
              transition={{ duration: 0.55, times: [0, 0.5, 1] }}
              data-testid="intro-seal"
            >
              <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_35%_30%,#C82434_0%,#8E1220_55%,#5C0A14_100%)] shadow-[0_10px_25px_rgba(74,14,23,0.45)] flex items-center justify-center border border-[#D4AF37]/50">
                <span className="font-script text-xl text-[#D4AF37]">{initials}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.9, delay: 1.3 }}
        className="relative z-10 mt-8 font-cinzel font-bold text-[10px] tracking-[0.45em] uppercase text-[#8C7B7E]"
      >
        Touchez l'enveloppe
      </motion.p>
    </motion.div>
  );
}
