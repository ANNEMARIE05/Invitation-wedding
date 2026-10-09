import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import WeddingPetals from "@/components/invite/WeddingPetals";

const SHELL_ORBS = [
  { className: "hero-orb hero-orb--magenta left-[10%] top-[12%] h-[min(40vw,280px)] w-[min(40vw,280px)]", delay: 0 },
  { className: "hero-orb hero-orb--wine right-[8%] bottom-[18%] h-[min(44vw,320px)] w-[min(44vw,320px)]", delay: 3 },
];

export default function CoupleAuthShell({
  children,
  backLabel,
  backTo = "/",
  narrow = false,
  showCoupleBanner = true,
}) {
  const { bride, groom, initials } = useSettings();

  useEffect(() => {
    if (!narrow) return undefined;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [narrow]);

  const pageClass = narrow
    ? "relative flex h-dvh max-h-dvh flex-col overflow-hidden"
    : "relative min-h-screen overflow-x-clip";

  return (
    <div
      className={`couple-auth-page ${pageClass} text-[#FAF7F2] antialiased`}
      data-testid="couple-auth-shell"
    >
      <div className="pointer-events-none absolute inset-0 hero-atmosphere" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-20" aria-hidden />
      {SHELL_ORBS.map((o) => (
        <div key={o.className} className={`pointer-events-none absolute ${o.className}`} style={{ animationDelay: `${o.delay}s` }} aria-hidden />
      ))}
      <div className="pointer-events-none absolute inset-0 hero-veil" aria-hidden />
      <div className="grain-overlay opacity-[0.04]" aria-hidden />
      {narrow && <WeddingPetals active density={12} variant="hero" />}

      <div className="hero-corners couple-auth-corners pointer-events-none absolute z-[1]" aria-hidden>
        <span className="hero-corner hero-corner--tl" />
        <span className="hero-corner hero-corner--tr" />
        <span className="hero-corner hero-corner--bl" />
        <span className="hero-corner hero-corner--br" />
      </div>

      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 sm:px-10 ${
          narrow ? "h-full min-h-0 py-5 sm:py-6" : "min-h-screen py-8 sm:py-12"
        }`}
      >
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex shrink-0 flex-wrap items-center justify-between gap-4"
        >
          <Link
            to={backTo}
            data-testid="couple-auth-back"
            className="inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.28em] uppercase text-[#C48B92] transition-colors hover:text-[#D4AF37]"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            {backLabel}
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/50 sm:block" />
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#FAF7F2]/5 font-cinzel text-[9px] tracking-[0.12em] text-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.12)]"
              aria-hidden
            >
              {initials.replace(/\s/g, "")}
            </span>
          </div>
        </motion.header>

        <div
          className={`mx-auto flex w-full min-h-0 flex-1 flex-col items-center justify-center ${narrow ? "max-w-md" : "max-w-4xl"}`}
        >
          {showCoupleBanner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
              className="mb-4 shrink-0 text-center sm:mb-5"
            >
              <p className="font-cinzel text-[9px] tracking-[0.32em] uppercase text-[#C48B92] sm:text-[10px] sm:tracking-[0.42em]">
                {bride} & {groom}
              </p>
            </motion.div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
