import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";

export default function CoupleAuthShell({ children, backLabel, backTo = "/", narrow = false }) {
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
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_0%,rgba(237,30,121,0.28),transparent_50%),radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(212,175,55,0.12),transparent_55%),linear-gradient(168deg,#4A1224_0%,#6B2440_42%,#8B3550_100%)]"
        aria-hidden
      />
      <div className="grain-overlay opacity-[0.03]" aria-hidden />

      <div className="pointer-events-none absolute inset-5 sm:inset-10" aria-hidden>
        <span className="absolute top-0 left-0 h-14 w-14 border-l border-t border-[#D4AF37]/35 sm:h-20 sm:w-20" />
        <span className="absolute top-0 right-0 h-14 w-14 border-r border-t border-[#C0C0C0]/25 sm:h-20 sm:w-20" />
        <span className="absolute bottom-0 left-0 h-14 w-14 border-b border-l border-[#C0C0C0]/25 sm:h-20 sm:w-20" />
        <span className="absolute bottom-0 right-0 h-14 w-14 border-b border-r border-[#D4AF37]/35 sm:h-20 sm:w-20" />
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
          {children}
        </div>
      </div>
    </div>
  );
}
