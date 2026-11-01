import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import WeddingPetals from "@/components/invite/WeddingPetals";
import { FloralCornerOverlay } from "@/components/invite/Flowers";

const LOGIN_ORBS = [
  { className: "hero-orb hero-orb--magenta left-[10%] top-[12%] h-[min(40vw,280px)] w-[min(40vw,280px)]", delay: 0 },
  { className: "hero-orb hero-orb--wine right-[8%] bottom-[18%] h-[min(44vw,320px)] w-[min(44vw,320px)]", delay: 3 },
];

const HUB_ORBS = [
  { className: "hero-orb hero-orb--magenta left-[8%] top-[18%] h-[min(42vw,320px)] w-[min(42vw,320px)]", delay: 0 },
  { className: "hero-orb hero-orb--wine right-[5%] bottom-[12%] h-[min(50vw,380px)] w-[min(50vw,380px)]", delay: 2 },
  { className: "hero-orb hero-orb--silver left-[42%] top-[55%] h-[min(28vw,200px)] w-[min(28vw,200px)]", delay: 4 },
];

export default function CoupleAuthShell({
  children,
  backLabel,
  backTo = "/",
  narrow = false,
  showCoupleBanner = true,
  contentAlign = "center",
}) {
  const { coupleLabel, initials } = useSettings();

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
      className={`couple-auth-page ${pageClass} text-wedding-on-dark antialiased`}
      data-testid="couple-auth-shell"
    >
      <div className="pointer-events-none absolute inset-0 hero-atmosphere" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" aria-hidden />
      {(narrow ? LOGIN_ORBS : HUB_ORBS).map((o) => (
        <div key={o.className} className={`pointer-events-none absolute ${o.className}`} style={{ animationDelay: `${o.delay}s` }} aria-hidden />
      ))}
      <div className="pointer-events-none absolute inset-0 hero-veil" aria-hidden />
      <div className="grain-overlay opacity-[0.04]" aria-hidden />
      {!narrow && <FloralCornerOverlay variant="hero" />}
      <WeddingPetals active density={narrow ? 12 : 10} variant="hero" />

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
          className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-4"
        >
          <Link
            to={backTo}
            data-testid="couple-auth-back"
            className="couple-auth-back"
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden />
            {backLabel}
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-wedding-gold-accent/50 sm:block" />
            <span
              className="couple-auth-monogram flex h-10 w-10 items-center justify-center rounded-[8px] font-cinzel text-[9px] tracking-[0.12em] text-wedding-gold-soft"
              aria-hidden
            >
              {initials.replace(/\s/g, "")}
            </span>
          </div>
        </motion.header>

        <div
          className={`mx-auto flex w-full min-h-0 flex-1 flex-col items-center ${
            contentAlign === "start" ? "justify-start pt-2 sm:pt-4" : "justify-center"
          } ${narrow ? "max-w-md" : "max-w-5xl"}`}
        >
          {showCoupleBanner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
              className="mb-4 shrink-0 text-center sm:mb-5"
            >
              <p className="type-eyebrow--on-dark font-cinzel text-[10px] tracking-[0.32em] sm:text-[11px] sm:tracking-[0.42em]">
                {coupleLabel}
              </p>
            </motion.div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
