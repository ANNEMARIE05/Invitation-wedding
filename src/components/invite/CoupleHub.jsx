import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Camera, LogOut, Settings2, ChevronRight, Heart } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { getRsvps } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { useCoupleAuth } from "@/lib/useCoupleAuth";
import LangToggle from "@/components/invite/LangToggle";
import CoupleAuthShell from "./CoupleAuthShell";

const CARD_EASE = EASE;
const stagger = 0.1;

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

  const refreshStats = useCallback(() => {
    getRsvps()
      .then((rows) => {
        const presents = rows.filter((r) => r.present).length;
        setStats({ total: rows.length, presents });
      })
      .catch(() => setStats({ total: 0, presents: 0 }));
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useStoreSync("rsvps", refreshStats);

  const cards = [
    {
      to: "/reponses",
      testId: "hub-card-rsvp",
      icon: BarChart3,
      title: t.cards.rsvp.title,
      desc: t.cards.rsvp.desc,
      accent: "from-[#D4AF37]/25 to-transparent",
      badge:
        stats.total !== null
          ? t.cards.rsvp.badge(stats.presents, stats.total)
          : t.cards.rsvp.loading,
    },
    {
      to: "/photos",
      testId: "hub-card-photos",
      icon: Camera,
      title: t.cards.photos.title,
      desc: t.cards.photos.desc,
      accent: "from-[#ED1E79]/20 to-transparent",
      badge: t.cards.photos.badge,
    },
    {
      to: "/infos",
      testId: "hub-card-infos",
      icon: Settings2,
      title: t.cards.infos.title,
      desc: t.cards.infos.desc,
      accent: "from-[#C0C0C0]/15 to-transparent",
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
        <h1 className="mt-2 font-display text-[1.75rem] font-medium italic leading-tight text-[#FAF7F2] sm:mt-3 sm:text-4xl sm:leading-normal md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-1.5 font-script text-2xl text-[#D4AF37] sm:mt-2 sm:text-3xl">{t.subtitle}</p>
        <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-[#C48B92]/90 sm:mt-5 sm:text-sm">{t.intro}</p>
      </motion.div>

      <ul className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-5">
        {cards.map(({ to, testId, icon: Icon, title, desc, accent, badge }, i) => (
          <motion.li
            key={to}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * stagger, ease: CARD_EASE }}
          >
            <Link
              to={to}
              data-testid={testId}
              className="couple-hub-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#FAF7F2]/10 bg-[#FAF7F2]/[0.05] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-500 hover:border-[#D4AF37]/35 hover:bg-[#FAF7F2]/[0.08] hover:shadow-[0_28px_60px_rgba(212,175,55,0.12)] sm:rounded-2xl sm:p-6 sm:shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden />
              <div className="relative flex items-start justify-between gap-2 sm:gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-[#2A050B]/60 text-[#D4AF37] transition-transform duration-500 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-xl">
                  <Icon className="h-[17px] w-[17px] sm:h-5 sm:w-5" strokeWidth={1.4} aria-hidden />
                </span>
                <ChevronRight
                  size={16}
                  className="mt-0.5 shrink-0 text-[#C48B92]/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#D4AF37] sm:mt-1 sm:h-[18px] sm:w-[18px]"
                  aria-hidden
                />
              </div>
              <h2 className="relative mt-3 font-display text-xl text-[#FAF7F2] sm:mt-5 sm:text-2xl">{title}</h2>
              <p className="relative mt-1.5 flex-1 text-xs leading-relaxed text-[#C48B92]/85 sm:mt-2 sm:text-sm">{desc}</p>
              <p className="relative mt-2.5 font-cinzel text-[8px] tracking-[0.18em] uppercase text-[#D4AF37]/80 sm:mt-4 sm:text-[9px] sm:tracking-[0.2em]">
                {badge}
              </p>
            </Link>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="mt-8 flex flex-col items-center gap-3 sm:mt-12 sm:gap-4"
      >
        <div className="flex items-center gap-2 text-[#C48B92]/60">
          <Heart size={14} className="text-[#ED1E79]/70" fill="currentColor" aria-hidden />
          <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase">{t.wish}</span>
        </div>
        <button
          type="button"
          data-testid="couple-logout"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-[#FAF7F2]/15 px-5 py-2.5 font-cinzel text-[10px] tracking-[0.22em] uppercase text-[#C48B92] transition-all hover:border-[#C48B92]/40 hover:text-[#FAF7F2]"
        >
          <LogOut size={14} strokeWidth={1.5} aria-hidden />
          {t.logout}
        </button>
      </motion.div>
    </CoupleAuthShell>
  );
}
