import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE, IMAGES, scrollToId } from "@/lib/invite-data";
import { usePhoto } from "@/lib/photos";
import { useSettings } from "@/lib/settings";
import { Petals } from "./Flowers";

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
  const { bride, groom, initials, dateLabel } = useSettings();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 220]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const heroImg = usePhoto("hero", IMAGES.hero);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <img src={heroImg} alt={`${bride} et ${groom}`} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 vignette-wine" />
      <Petals count={14} />

      <motion.div style={{ opacity: fade }} className="relative z-10 text-center px-6 pt-24 pb-32">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={start ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.35 }}
          className="mx-auto mb-10 w-28 h-28 relative animate-float-soft"
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
            <span className="text-6xl sm:text-7xl lg:text-8xl italic font-medium">{bride}</span>
          </MaskedLine>
          <MaskedLine delay={1.05} start={start}>
            <span className="font-script text-4xl sm:text-5xl text-[#C48B92] my-2 inline-block">&</span>
          </MaskedLine>
          <MaskedLine delay={1.25} start={start}>
            <span className="text-6xl sm:text-7xl lg:text-8xl italic font-medium">{groom}</span>
          </MaskedLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 1.7, ease: EASE }}
          className="mt-10 inline-flex items-center gap-4"
          data-testid="hero-date-badge"
        >
          <span className="h-px w-10 sm:w-16 bg-[#D4AF37]/70" />
          <span className="font-cinzel text-xs sm:text-sm tracking-[0.35em] uppercase text-[#FAF7F2]">{dateLabel}</span>
          <span className="h-px w-10 sm:w-16 bg-[#D4AF37]/70" />
        </motion.div>
      </motion.div>

      <motion.button
        data-testid="hero-scroll-button"
        onClick={() => scrollToId("#histoire")}
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#FAF7F2]/80 hover:text-[#D4AF37] transition-colors"
        aria-label="Défiler"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown size={28} strokeWidth={1.2} />
        </motion.div>
      </motion.button>
    </section>
  );
}
