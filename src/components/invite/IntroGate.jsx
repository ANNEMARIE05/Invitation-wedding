import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";

export default function IntroGate({ onOpen }) {
  const { bride, groom, initials, dateLabel } = useSettings();
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 1.1, ease: EASE }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-5 bg-[radial-gradient(ellipse_at_center,#58111A_0%,#2A050B_70%)]"
      data-testid="intro-gate"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        className="relative w-full max-w-md bg-[#FAF7F2] shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        data-testid="intro-card"
      >
        <div className="absolute inset-2 border border-[#D4AF37]/60 pointer-events-none" />
        <div className="absolute inset-3.5 border border-[#D4AF37]/30 pointer-events-none" />

        <div className="relative px-8 py-12 sm:px-12 sm:py-14 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.9, type: "spring", bounce: 0.4 }}
            className="mx-auto mb-8 w-20 h-20 relative"
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/70 animate-seal-spin" />
            <div className="absolute inset-1.5 rounded-full bg-[#4A0E17] flex items-center justify-center shadow-lg">
              <span className="font-script text-2xl text-[#D4AF37]">{initials}</span>
            </div>
          </motion.div>

          <p className="font-cinzel text-[10px] tracking-[0.45em] uppercase text-[#C48B92]">
            Vous êtes invité·e·s au mariage de
          </p>
          <h1 className="mt-5 font-script text-5xl sm:text-6xl text-[#4A0E17] leading-tight">
            {bride}
            <span className="block text-3xl text-[#D4AF37] my-1">&</span>
            {groom}
          </h1>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]/60" />
            <span className="text-[#D4AF37] text-sm">✦</span>
            <span className="h-px w-10 bg-[#D4AF37]/60" />
          </div>
          <p className="mt-4 font-cinzel text-xs tracking-[0.3em] uppercase text-[#5C4F51]">{dateLabel}</p>

          <button
            data-testid="open-invitation-button"
            onClick={onOpen}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.25em] uppercase px-9 py-4 hover:bg-[#6B1724] hover:shadow-[0_15px_40px_rgba(74,14,23,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <MailOpen size={16} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
            Ouvrir l'invitation
          </button>
          <p className="mt-5 text-[10px] text-[#8C7B7E] tracking-wide">Le son de l'invitation s'activera à l'ouverture</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
