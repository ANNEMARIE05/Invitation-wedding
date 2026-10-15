import { Fragment, useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings, cap } from "@/lib/settings";
import Chapter from "./Chapter";
import { CornerAccent } from "./Flowers";
import SparkleField from "./SparkleField";
const compute = (target) => {
  const d = Math.max(0, target - Date.now());
  return {
    jours: Math.floor(d / 86400000),
    heures: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    secondes: Math.floor((d / 1000) % 60),
  };
};

const toIcs = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function ChicWeddingHeart() {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  return (
    <span className="bigday-chic-heart animate-heart-beat" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="bigday-chic-heart__svg">
        <defs>
          <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="45%" stopColor="#C9A962" />
            <stop offset="100%" stopColor="#7A1538" />
          </linearGradient>
          <linearGradient id={`${uid}-rose`} x1="12" y1="5" x2="12" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD6E0" />
            <stop offset="55%" stopColor="#ED1E79" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#9B1B4A" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id={`${uid}-glint`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 7.2) rotate(90) scale(4.5)">
            <stop stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(12 12) scale(1.14) translate(-12 -12)">
          <path
            className="bigday-chic-heart__outer"
            d="M12 20.5s-7.2-4.7-9.4-9.4C1 7.5 3.5 4 7 4c2.1 0 4 1.1 5 2.9C13 5.1 14.9 4 17 4c3.5 0 6 3.5 4.4 7.1C19.2 15.8 12 20.5 12 20.5z"
            stroke={`url(#${uid}-gold)`}
          />
        </g>
        <path
          className="bigday-chic-heart__inner"
          d="M12 20.5s-7.2-4.7-9.4-9.4C1 7.5 3.5 4 7 4c2.1 0 4 1.1 5 2.9C13 5.1 14.9 4 17 4c3.5 0 6 3.5 4.4 7.1C19.2 15.8 12 20.5 12 20.5z"
          fill={`url(#${uid}-rose)`}
          stroke={`url(#${uid}-gold)`}
        />
        <circle className="bigday-chic-heart__shine" cx="12" cy="7.2" r="0.95" fill={`url(#${uid}-glint)`} />
        <path
          d="M12 5.4l0.45 0.9 1 0.15-0.72 0.7 0.17 1-0.9-0.48-0.9 0.48 0.17-1-0.72-0.7 1-0.15z"
          fill="#E8D5A8"
          opacity="0.92"
        />
      </svg>
    </span>
  );
}

export default function BigDay() {
  const { bride, groom, dateIso, dateLabel, venue, locale } = useSettings();
  const { m } = useI18n();
  const locTag = locale === "en" ? "en-GB" : "fr-FR";
  const target = useMemo(() => new Date(dateIso).getTime(), [dateIso]);
  const [t, setT] = useState(() => compute(target));
  const countdownRows = [
    { key: "days", label: m.bigDay.units.days, value: t.jours },
    { key: "hours", label: m.bigDay.units.hours, value: t.heures },
    { key: "minutes", label: m.bigDay.units.minutes, value: t.minutes },
    { key: "seconds", label: m.bigDay.units.seconds, value: t.secondes },
  ];

  useEffect(() => {
    const i = setInterval(() => setT(compute(target)), 1000);
    return () => clearInterval(i);
  }, [target]);

  const cal = useMemo(() => {
    const d = new Date(dateIso);
    const y = d.getFullYear();
    const m = d.getMonth();
    return {
      first: (new Date(y, m, 1).getDay() + 6) % 7,
      days: new Date(y, m + 1, 0).getDate(),
      day: d.getDate(),
      label: cap(new Date(y, m, 1).toLocaleDateString(locTag, { month: "long", year: "numeric" })),
    };
  }, [dateIso, locTag]);

  const start = new Date(dateIso);
  const end = new Date(start.getTime() + 4 * 3600000);

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//InvitationMariage//FR", "BEGIN:VEVENT",
      `UID:mariage-${start.getTime()}@invitation`,
      `DTSTAMP:${toIcs(new Date())}`,
      `DTSTART:${toIcs(start)}`,
      `DTEND:${toIcs(end)}`,
      `SUMMARY:${m.bigDay.icsSummary(groom, bride)}`,
      `LOCATION:${venue.name}`,
      `DESCRIPTION:${m.bigDay.icsDescription.replace(/,/g, "\\,")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mariage.ics";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(m.bigDay.icsOk);
  };

  const googleUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: m.bigDay.icsSummary(groom, bride),
    dates: `${toIcs(start)}/${toIcs(end)}`,
    details: m.bigDay.icsDescription,
    location: `${venue.name} ${venue.address}`,
  }).toString()}`;

  return (
    <section
      id="grand-jour"
      className="relative py-24 md:py-36 px-2.5 sm:px-8 lg:px-16 overflow-hidden bg-[linear-gradient(135deg,#5C0A20_0%,#9B1B4A_45%,#7A1538_100%)]"
      data-testid="bigday-section"
    >
      <SparkleField count={18} chic className="z-[1] opacity-75" />
      <span className="absolute top-12 left-4 sm:left-10 pointer-events-none opacity-60">
        <CornerAccent />
      </span>
      <span className="absolute top-12 right-4 sm:right-10 pointer-events-none opacity-60 -scale-x-100">
        <CornerAccent />
      </span>
      <span className="absolute bottom-12 left-4 sm:left-10 pointer-events-none opacity-40 -scale-y-100">
        <CornerAccent />
      </span>
      <span className="absolute bottom-12 right-4 sm:right-10 pointer-events-none opacity-40 -scale-100">
        <CornerAccent />
      </span>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #FFD6E0 0%, transparent 45%), radial-gradient(circle at 80% 70%, #FFD6E0 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <Chapter index="II" eyebrow={m.bigDay.chapter} title={m.bigDay.title} script={m.bigDay.script} dark />

        <div className="bigday-panel-frame">
          <span className="bigday-panel-corner bigday-panel-corner--tl" aria-hidden="true" />
          <span className="bigday-panel-corner bigday-panel-corner--tr" aria-hidden="true" />
          <span className="bigday-panel-corner bigday-panel-corner--bl" aria-hidden="true" />
          <span className="bigday-panel-corner bigday-panel-corner--br" aria-hidden="true" />

        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="bigday-card relative overflow-hidden rounded-sm bg-[#FFFBFC] text-[#2A050B] shadow-[0_24px_70px_rgba(0,0,0,0.35)] px-3 py-10 sm:px-11 sm:py-12"
          data-testid="calendar-card"
        >
          <span className="bigday-card-corner bigday-card-corner--tl" aria-hidden="true" />
          <span className="bigday-card-corner bigday-card-corner--tr" aria-hidden="true" />
          <span className="bigday-card-corner bigday-card-corner--bl" aria-hidden="true" />
          <span className="bigday-card-corner bigday-card-corner--br" aria-hidden="true" />
          <span className="bigday-card-ornament bigday-card-ornament--top" aria-hidden="true" />
          <span className="bigday-card-ornament bigday-card-ornament--bottom" aria-hidden="true" />
          <SparkleField count={14} chic onLight className="z-0 opacity-90" />
          <div className="relative z-[1]">
          <div
            className="bigday-countdown flex flex-nowrap justify-center items-baseline gap-x-0.5 sm:gap-x-2.5"
            data-testid="countdown-grid"
          >
            {countdownRows.map(({ key, label, value }, i) => (
              <Fragment key={key}>
                {i > 0 ? (
                  <span
                    className="bigday-countdown__sep font-display text-[1.65rem] sm:text-[2.75rem] text-[#7A1538] leading-none select-none shrink-0"
                    aria-hidden="true"
                  >
                    :
                  </span>
                ) : null}
                <div className="bigday-countdown__unit text-center shrink-0" data-testid={`countdown-${key}`}>
                  <p className="bigday-countdown__value font-display text-[1.65rem] sm:text-[2.75rem] font-semibold text-[#5C0A20] tabular-nums leading-none">
                    {key === "days" ? String(value) : String(value).padStart(2, "0")}
                  </p>
                  <p className="bigday-countdown__label mt-2 sm:mt-2.5 font-cinzel text-[8px] sm:text-[10px] font-semibold tracking-[0.14em] sm:tracking-[0.32em] uppercase text-[#6B2440]/90">
                    {label}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>

          <div className="my-9 sm:my-10 h-px bg-gradient-to-r from-transparent via-[#7A1538]/20 to-transparent" />

          <p className="text-center font-cinzel text-[11px] font-semibold tracking-[0.38em] uppercase text-[#7A1538]">
            {cal.label}
          </p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center font-cinzel text-[10px] font-medium tracking-widest text-[#6B2440]/75">
            {m.bigDay.weekdays.map((d, i) => (
              <span key={i} className="py-1">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-display text-lg text-[#2A050B]/80">
            {[...Array(cal.first)].map((_, i) => <span key={`empty-${i}`} />)}
            {[...Array(cal.days)].map((_, i) => {
              const day = i + 1;
              const isWeddingDay = day === cal.day;
              return (
                <span
                  key={day}
                  data-testid={isWeddingDay ? "calendar-wedding-day" : undefined}
                  className={isWeddingDay ? "relative inline-flex items-center justify-center py-1.5" : "py-1.5"}
                >
                  {isWeddingDay ? (
                    <>
                      <ChicWeddingHeart />
                      <span className="relative z-[1] font-display text-lg font-semibold text-[#5C0A20]">{day}</span>
                    </>
                  ) : (
                    day
                  )}
                </span>
              );
            })}
          </div>
          <p className="mt-6 text-center font-cinzel text-[10px] font-medium tracking-[0.28em] uppercase text-[#6B2440]/85 leading-relaxed">
            {m.bigDay.calendarFooter(dateLabel)}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              data-testid="download-ics-button"
              onClick={downloadIcs}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7A1538] text-[#FFFBFC] font-cinzel text-[10px] font-semibold tracking-[0.22em] uppercase px-6 py-3.5 hover:bg-[#5C0A20] transition-colors duration-300"
            >
              <CalendarPlus size={15} strokeWidth={1.5} /> {m.bigDay.addCalendar}
            </button>
            <a
              data-testid="google-calendar-link"
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7A1538]/35 text-[#5C0A20] font-cinzel text-[10px] tracking-[0.22em] uppercase px-6 py-3.5 hover:bg-[#FFF0F4] transition-colors duration-300"
            >
              {m.bigDay.googleCalendar}
            </a>
          </div>
          </div>
        </motion.article>
        </div>
      </div>
    </section>
  );
}
