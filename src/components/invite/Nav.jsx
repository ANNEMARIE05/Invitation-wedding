import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { NAV_LINKS, scrollToId } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";

export default function Nav() {
  const { bride, groom } = useSettings();
  const [soir, setSoir] = useState(() => localStorage.getItem("theme-soir") === "1");

  useEffect(() => {
    document.documentElement.classList.toggle("soir", soir);
    localStorage.setItem("theme-soir", soir ? "1" : "0");
  }, [soir]);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#FAF7F2]/70 border-b hairline"
      data-testid="main-nav"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button
          data-testid="nav-logo-button"
          onClick={() => scrollToId("#hero")}
          className="font-script text-2xl text-[#4A0E17] leading-none pt-1"
        >
          {bride.charAt(0).toUpperCase()} <span className="text-[#D4AF37] text-lg align-middle">&</span> {groom.charAt(0).toUpperCase()}
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              onClick={() => scrollToId(l.href)}
              className="gold-underline font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#5C4F51] hover:text-[#4A0E17] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            data-testid="soir-toggle-button"
            onClick={() => setSoir(!soir)}
            aria-label={soir ? "Revenir au thème jour" : "Passer au thème soirée"}
            title={soir ? "Thème jour" : "Thème soirée"}
            className="w-10 h-10 rounded-full border hairline flex items-center justify-center text-[#4A0E17] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
          >
            {soir ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
          </button>
          <button
            data-testid="nav-rsvp-button"
            onClick={() => scrollToId("#rsvp")}
            className="rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-[#6B1724] hover:shadow-[0_8px_24px_rgba(74,14,23,0.35)] transition-all duration-300"
          >
            Confirmer
          </button>
        </div>
      </div>
    </motion.header>
  );
}
