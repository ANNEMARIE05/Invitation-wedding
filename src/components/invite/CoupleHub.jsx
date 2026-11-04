import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Camera, LogOut, Settings2, ChevronRight, Heart, Link2, Feather } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { getGuestbook, getRsvps } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { useCoupleAuth } from "@/lib/useCoupleAuth";
import LangToggle from "@/components/invite/LangToggle";
import ClassicRule from "@/components/invite/ClassicRule";
import CoupleAuthShell from "./CoupleAuthShell";

const CARD_EASE = EASE;
const stagger = 0.08;

export default function CoupleHub() {
  const { m } = useI18n();
  const t = m.coupleSpace.hub;
  const navigate = useNavigate();
  const { logout } = useCoupleAuth();

  const signOut = () => {
    logout();
    navigate("/espace-maries", { replace: true });
  };
  const [stats, setStats] = useState({ total: null, presents: null });
  const [guestbookCount, setGuestbookCount] = useState(null);

  const refreshStats = useCallback(() => {
    getRsvps()
      .then((rows) => {
        const presents = rows.filter((r) => r.present).length;
        setStats({ total: rows.length, presents });
      })
      .catch(() => setStats({ total: 0, presents: 0 }));
  }, []);

  const refreshGuestbookCount = useCallback(() => {
    getGuestbook()
      .then((rows) => {
        const n = (Array.isArray(rows) ? rows : []).filter(
          (r) => !/^testeur$/i.test(String(r?.nom || "").trim()),
        ).length;
        setGuestbookCount(n);
      })
      .catch(() => setGuestbookCount(0));
  }, []);

  useEffect(() => {
    refreshStats();
    refreshGuestbookCount();
  }, [refreshStats, refreshGuestbookCount]);

  useStoreSync("rsvps", refreshStats);
  useStoreSync("guestbook", refreshGuestbookCount);

  const cards = [
    {
      to: "/reponses",
      testId: "hub-card-rsvp",
      icon: BarChart3,
      title: t.cards.rsvp.title,
      desc: t.cards.rsvp.desc,
      badge:
        stats.total !== null
          ? t.cards.rsvp.badge(stats.presents, stats.total)
          : t.cards.rsvp.loading,
    },
    {
      to: "/liens-invitation",
      testId: "hub-card-invites",
      icon: Link2,
      title: t.cards.invites.title,
      desc: t.cards.invites.desc,
      badge: t.cards.invites.badge,
    },
    {
      to: "/photos",
      testId: "hub-card-photos",
      icon: Camera,
      title: t.cards.photos.title,
      desc: t.cards.photos.desc,
      badge: t.cards.photos.badge,
    },
    {
      to: "/mots-doux",
      testId: "hub-card-guestbook",
      icon: Feather,
      title: t.cards.guestbook.title,
      desc: t.cards.guestbook.desc,
      badge:
        guestbookCount !== null
          ? t.cards.guestbook.badge(guestbookCount)
          : t.cards.guestbook.loading,
    },
    {
      to: "/infos",
      testId: "hub-card-infos",
      icon: Settings2,
      title: t.cards.infos.title,
      desc: t.cards.infos.desc,
      badge: t.cards.infos.badge,
    },
  ];

  return (
    <CoupleAuthShell backLabel={t.backInvitation} backTo="/">
      <LangToggle floating />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: CARD_EASE }}
        className="text-center"
        data-testid="couple-hub"
      >
        <p className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-[#C48B92] sm:text-[10px] sm:tracking-[0.4em]">
          {t.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-[1.75rem] font-medium italic leading-tight text-wedding-on-dark sm:mt-3 sm:text-4xl sm:leading-normal md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-1.5 font-script text-xl text-wedding-gold-accent sm:mt-2 sm:text-3xl">{t.subtitle}</p>
        <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-[#C48B92]/90 sm:mt-5 sm:text-sm">{t.intro}</p>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.1, ease: CARD_EASE }}
        className="couple-classic-card couple-backoffice-panel couple-backoffice-panel--wide relative mx-auto mt-6 w-full sm:mt-10"
      >
        <div className="couple-classic-card__frame pointer-events-none" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--tl couple-classic-card__corner" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--tr couple-classic-card__corner" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--bl couple-classic-card__corner" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--br couple-classic-card__corner" aria-hidden />

        <div className="relative px-3 py-5 sm:px-8 sm:py-10">
          <ul className="grid auto-rows-fr grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-5">
            {cards.map(({ to, testId, icon: Icon, title, desc, badge }, i) => (
              <motion.li
                key={to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12 + i * stagger, ease: CARD_EASE }}
                className="min-h-0"
              >
                <Link
                  to={to}
                  data-testid={testId}
                  className="couple-hub-tile couple-hub-tile--grid luxe-card luxe-card--light luxe-card--no-inset group flex h-full flex-col text-left"
                >
                  <div className="flex items-center justify-between gap-1 sm:items-start sm:gap-2">
                    <span className="couple-hub-tile__icon" aria-hidden>
                      <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" strokeWidth={1.45} />
                    </span>
                    <ChevronRight
                      size={17}
                      className="couple-hub-tile__chevron hidden shrink-0 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <h2 className="couple-hub-tile__title mt-2 font-display text-base font-semibold leading-snug text-[#3a061c] sm:mt-5 sm:text-[1.35rem] sm:font-medium sm:leading-normal">
                    {title}
                  </h2>
                  <p className="couple-hub-tile__desc mt-1.5 flex-1 text-xs font-medium leading-snug text-[#4a1028] sm:mt-2 sm:text-sm sm:font-normal sm:leading-relaxed">
                    {desc}
                  </p>
                  <p className="couple-hub-tile__badge mt-2 text-left sm:mt-4">{badge}</p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.article>

      <ClassicRule className="mx-auto mt-9 max-w-xs sm:mt-11" gem="♥" />
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="mt-6 flex flex-col items-center gap-4 sm:mt-7"
      >
        <p className="flex items-center gap-2 text-[#C48B92]/60">
          <Heart size={14} className="text-wedding-rose/70" fill="currentColor" aria-hidden />
          <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase">{t.wish}</span>
        </p>
        <button
          type="button"
          data-testid="couple-logout"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-[8px] border border-wedding-rose/30 px-5 py-2.5 font-cinzel text-[10px] tracking-[0.22em] uppercase text-[#C48B92] shadow-[0_10px_24px_-10px_rgba(232,61,137,0.4)] transition-all hover:border-wedding-rose/50 hover:text-wedding-on-dark"
        >
          <LogOut size={14} strokeWidth={1.5} aria-hidden />
          {t.logout}
        </button>
      </motion.footer>
    </CoupleAuthShell>
  );
}
