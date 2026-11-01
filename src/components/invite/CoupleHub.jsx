import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Camera, LogOut, Settings2, ChevronRight, Heart, Link2 } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { getRsvps } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { useCoupleAuth } from "@/lib/useCoupleAuth";
import ClassicRule from "@/components/invite/ClassicRule";
import CoupleBackofficeLayout from "@/components/invite/CoupleBackofficeLayout";

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
      to: "/infos",
      testId: "hub-card-infos",
      icon: Settings2,
      title: t.cards.infos.title,
      desc: t.cards.infos.desc,
      badge: t.cards.infos.badge,
    },
  ];

  return (
    <CoupleBackofficeLayout
      backLabel={t.backInvitation}
      backTo="/"
      panel={{
        testId: "couple-hub",
        eyebrow: t.eyebrow,
        title: t.title,
        subtitle: t.subtitle,
        intro: t.intro,
      }}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
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
              className="couple-hub-tile luxe-card luxe-card--light luxe-card--no-inset group flex h-full flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="couple-hub-tile__icon" aria-hidden>
                  <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.45} />
                </span>
                <ChevronRight
                  size={17}
                  className="couple-hub-tile__chevron shrink-0 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
              <h2 className="couple-hub-tile__title mt-4 font-display text-xl sm:mt-5 sm:text-[1.35rem]">{title}</h2>
              <p className="couple-hub-tile__desc mt-2 flex-1 text-sm leading-relaxed">{desc}</p>
              <p className="couple-hub-tile__badge mt-4">{badge}</p>
            </Link>
          </motion.li>
        ))}
      </ul>

      <ClassicRule className="mx-auto mt-9 max-w-xs sm:mt-11" gem="♥" />
      <footer className="mt-6 flex flex-col items-center gap-4 sm:mt-7">
        <p className="couple-hub-wish flex items-center gap-2">
          <Heart size={13} className="text-wedding-wine-accent" fill="currentColor" aria-hidden />
          <span>{t.wish}</span>
        </p>
        <button
          type="button"
          data-testid="couple-logout"
          onClick={signOut}
          className="btn-couple-classic couple-hub-logout inline-flex w-full max-w-xs items-center justify-center gap-2 sm:w-auto sm:min-w-[14rem]"
        >
          <LogOut size={14} strokeWidth={1.5} aria-hidden />
          {t.logout}
        </button>
      </footer>
    </CoupleBackofficeLayout>
  );
}
