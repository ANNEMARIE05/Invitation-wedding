import { motion } from "framer-motion";
import { scrollToId } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { bride, groom } = useSettings();
  const { m } = useI18n();
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#FFF0F4]/85 border-b border-[#ED1E79]/15"
      data-testid="main-nav"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button
          data-testid="nav-logo-button"
          onClick={() => scrollToId("#hero")}
          className="font-display text-xl font-medium tracking-[0.08em] text-[#2A050B] leading-none pt-0.5"
        >
          {bride.charAt(0).toUpperCase()}
          <span className="mx-1.5 font-cinzel text-xs tracking-[0.35em] text-[#D4AF37] align-middle">&</span>
          {groom.charAt(0).toUpperCase()}
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {m.nav.links.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              onClick={() => scrollToId(l.href)}
              className="gold-underline font-cinzel text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B2440] hover:text-[#ED1E79] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <LangToggle />
          <button
            type="button"
            data-testid="nav-rsvp-button"
            onClick={() => scrollToId("#rsvp")}
            className="btn-rejoindre !min-w-0 !px-5 !py-2.5 !text-[10px] !shadow-[0_10px_28px_rgba(237,30,121,0.3)]"
          >
            <span className="relative z-[1]">{m.nav.confirm}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
