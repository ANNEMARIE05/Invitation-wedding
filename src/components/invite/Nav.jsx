import { useMemo } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { scrollToId } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import { useNavActive } from "@/lib/use-nav-active";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { initials } = useSettings();
  const { m } = useI18n();
  const sectionIds = useMemo(() => m.nav.links.map((l) => l.href.slice(1)), [m.nav.links]);
  const [activeHref, activateOnNavigate] = useNavActive(sectionIds);

  const goTo = (href) => {
    activateOnNavigate(href === "#hero" ? null : href);
    scrollToId(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 border-b border-wedding-rose-light/35 bg-wedding-on-dark/98 shadow-[0_8px_32px_rgba(42,5,11,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-wedding-on-dark/92"
      data-testid="main-nav"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button
          data-testid="nav-logo-button"
          onClick={() => goTo("#hero")}
          className="font-display text-xl font-semibold tracking-[0.08em] text-wedding-wine leading-none pt-0.5"
        >
          {initials}
        </button>
        <nav className="hidden md:flex items-center gap-8">
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
                className={`relative pb-1 font-cinzel text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-500 ${
                  isActive
                    ? "text-wedding-rose"
                    : "text-wedding-ink-soft hover:text-wedding-rose gold-underline"
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
        <div className="flex items-center gap-2 sm:gap-2.5">
          <LangToggle solid />
          <button
            type="button"
            data-testid="nav-rsvp-button"
            onClick={() => goTo("#rsvp")}
            className="btn-rejoindre !min-w-0 !px-5 !py-2.5 !text-[10px] !shadow-[0_10px_28px_rgba(237,30,121,0.3)]"
          >
            <span className="relative z-[1]">{m.nav.confirm}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
