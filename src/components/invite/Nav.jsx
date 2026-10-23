import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { scrollToId } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import { useNavActive } from "@/lib/use-nav-active";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { initials } = useSettings();
  const { m } = useI18n();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sectionIds = useMemo(() => m.nav.links.map((l) => l.href.slice(1)), [m.nav.links]);
  const [activeHref, activateOnNavigate] = useNavActive(sectionIds);

  const goTo = (href) => {
    activateOnNavigate(href === "#hero" ? null : href);
    setMobileNavOpen(false);
    scrollToId(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="invite-main-nav fixed top-0 inset-x-0 z-50 border-b border-wedding-rose-light/40 shadow-[0_8px_32px_rgba(42,5,11,0.12)] backdrop-blur-md"
      data-testid="main-nav"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 xl:px-8 h-16 flex items-center justify-between">
        <button
          data-testid="nav-logo-button"
          onClick={() => goTo("#hero")}
          className="whitespace-nowrap font-display text-xl font-semibold tracking-[0.08em] text-wedding-wine-deep leading-none pt-0.5"
        >
          {initials}
        </button>
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
          <LayoutGroup id="main-nav-links">
          {m.nav.links.map((l) => {
            const isActive = activeHref === l.href;
            return (
              <button
                key={l.href}
                type="button"
                data-testid={`nav-link-${l.href.slice(1)}`}
                onClick={() => goTo(l.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative whitespace-nowrap pb-1 font-cinzel text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors duration-500 ${
                  isActive
                    ? "text-wedding-wine-deep"
                    : "text-wedding-wine-deep hover:text-wedding-rose gold-underline"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute inset-x-0 bottom-0 h-px bg-[var(--gold)]"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
          </LayoutGroup>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            data-testid="nav-menu-toggle"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label={mobileNavOpen ? m.nav.closeMenu : m.nav.openMenu}
            aria-expanded={mobileNavOpen}
            aria-controls="invitation-mobile-nav"
            className="nav-menu-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-wedding-rose-light/70 text-wedding-wine-deep transition-colors hover:bg-wedding-ivory xl:hidden"
          >
            {mobileNavOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
          <LangToggle solid />
          <button
            type="button"
            data-testid="nav-rsvp-button"
            onClick={() => goTo("#rsvp")}
            className="btn-rejoindre !min-w-0 !whitespace-nowrap !px-3 sm:!px-5 !py-2.5 !text-[10px] !shadow-[0_10px_28px_rgba(237,30,121,0.3)]"
          >
            <span className="relative z-[1]">{m.nav.confirm}</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            id="invitation-mobile-nav"
            aria-label={m.nav.menu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mobile-nav-panel absolute inset-x-0 top-full z-50 grid gap-1 border-t border-wedding-rose-light/50 px-4 py-3 shadow-xl xl:hidden"
          >
            {m.nav.links.map((link) => (
              <button
                key={link.href}
                type="button"
                data-testid={`mobile-nav-link-${link.href.slice(1)}`}
                onClick={() => goTo(link.href)}
                aria-current={activeHref === link.href ? "true" : undefined}
                className={`w-full rounded-lg px-4 py-3 text-left font-cinzel text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${
                  activeHref === link.href
                    ? "bg-wedding-ivory text-wedding-wine-deep"
                    : "text-wedding-wine hover:bg-wedding-ivory"
                }`}
              >
                {link.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
