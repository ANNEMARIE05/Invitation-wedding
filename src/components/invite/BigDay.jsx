import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings, cap } from "@/lib/settings";
import Chapter from "./Chapter";
import { CornerAccent } from "./Flowers";
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
      `SUMMARY:${m.bigDay.icsSummary(bride, groom)}`,
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
    text: m.bigDay.icsSummary(bride, groom),
    dates: `${toIcs(start)}/${toIcs(end)}`,
    details: m.bigDay.icsDescription,
    location: `${venue.name} ${venue.address}`,
  }).toString()}`;

  return (
    <section
      id="grand-jour"
      className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 overflow-hidden bg-[linear-gradient(135deg,#5C0A20_0%,#9B1B4A_45%,#7A1538_100%)]"
      data-testid="bigday-section"
    >
      <span className="absolute top-12 left-4 sm:left-10 pointer-events-none opacity-70">
        <CornerAccent />
      </span>
      <span className="absolute top-12 right-4 sm:right-10 pointer-events-none opacity-70 -scale-x-100">
        <CornerAccent />
      </span>
      <span className="absolute bottom-12 left-4 sm:left-10 pointer-events-none opacity-50 -scale-y-100">
        <CornerAccent />
      </span>
      <span className="absolute bottom-12 right-4 sm:right-10 pointer-events-none opacity-50 -scale-100">
        <CornerAccent />
      </span>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, #FFD6E0 0%, transparent 45%), radial-gradient(circle at 80% 70%, #FFD6E0 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <Chapter index="II" eyebrow={m.bigDay.chapter} title={m.bigDay.title} script={m.bigDay.script} dark />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6" data-testid="countdown-grid">
          {countdownRows.map(({ key, label, value }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              className="relative border hairline-gold bg-white/[0.04] backdrop-blur-sm rounded-sm py-8 px-4 text-center overflow-hidden"
              data-testid={`countdown-${key}`}
            >
              <div className="relative h-14 sm:h-16 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={value}
                    initial={{ y: -22, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 22, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="font-display text-5xl sm:text-6xl text-[#FFD6E0] tabular-nums"
                  >
                    {String(value).padStart(2, "0")}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-2 font-cinzel text-[10px] font-semibold tracking-[0.35em] uppercase text-[#FFFBFC]/90">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-14 mx-auto max-w-sm border hairline-gold bg-white/[0.04] backdrop-blur-sm rounded-sm p-6 sm:p-8"
          data-testid="calendar-card"
        >
          <p className="text-center font-cinzel text-xs font-semibold tracking-[0.4em] uppercase text-[#FFD6E0]">{cal.label}</p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center font-cinzel text-[10px] font-medium tracking-widest text-[#FFFBFC]/80">
            {m.bigDay.weekdays.map((d, i) => (
              <span key={i} className="py-1">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-display text-lg text-[#FAF7F2]/85">
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
                      <svg viewBox="0 0 24 24" className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] animate-heart-beat" aria-hidden="true">
                        <path
                          d="M12 20.5s-7.2-4.7-9.4-9.4C1 7.5 3.5 4 7 4c2.1 0 4 1.1 5 2.9C13 5.1 14.9 4 17 4c3.5 0 6 3.5 4.4 7.1C19.2 15.8 12 20.5 12 20.5z"
                          fill="rgba(212,175,55,0.10)"
                          stroke="#FFD6E0"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span className="relative text-[#FFD6E0] font-semibold">{day}</span>
                    </>
                  ) : (
                    day
                  )}
                </span>
              );
            })}
          </div>
          <p className="mt-5 text-center font-cinzel text-[10px] font-medium tracking-[0.3em] uppercase text-[#FFFBFC]/85">
            {m.bigDay.calendarFooter(dateLabel)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <button
            data-testid="download-ics-button"
            onClick={downloadIcs}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFFBFC] text-[#5C0A20] font-cinzel text-[11px] font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-[#FFD6E0] hover:shadow-[0_10px_30px_rgba(255,214,224,0.35)] transition-all duration-300"
          >
            <CalendarPlus size={16} /> {m.bigDay.addCalendar}
          </button>
          <a
            data-testid="google-calendar-link"
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border hairline-gold text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-white/10 transition-all duration-300"
          >
            {m.bigDay.googleCalendar}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
