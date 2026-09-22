import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, Church, GlassWater, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useSettings, cap } from "@/lib/settings";
import Chapter from "./Chapter";
import { FlowerCorner, Petals } from "./Flowers";
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

const BADGES = [
  { icon: Church, label: "Cérémonie Laïque", time: "15h30" },
  { icon: GlassWater, label: "Vin d'Honneur", time: "17h30" },
  { icon: UtensilsCrossed, label: "Dîner d'Exception", time: "20h00" },
];

export default function BigDay() {
  const { bride, groom, dateIso, dateLabel, venue } = useSettings();
  const target = useMemo(() => new Date(dateIso).getTime(), [dateIso]);
  const [t, setT] = useState(() => compute(target));

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
      label: cap(new Date(y, m, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })),
    };
  }, [dateIso]);

  const start = new Date(dateIso);
  const end = new Date(start.getTime() + 9.5 * 3600000);

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//InvitationMariage//FR", "BEGIN:VEVENT",
      `UID:mariage-${start.getTime()}@invitation`,
      `DTSTAMP:${toIcs(new Date())}`,
      `DTSTART:${toIcs(start)}`,
      `DTEND:${toIcs(end)}`,
      `SUMMARY:Mariage de ${bride} & ${groom}`,
      `LOCATION:${venue.name}`,
      "DESCRIPTION:Cérémonie\, vin d'honneur et dîner d'exception.",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mariage.ics";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Événement téléchargé — ouvrez-le pour l'ajouter à votre calendrier.");
  };

  const googleUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: `Mariage de ${bride} & ${groom}`,
    dates: `${toIcs(start)}/${toIcs(end)}`,
    details: "Cérémonie, vin d'honneur et dîner d'exception.",
    location: `${venue.name} ${venue.address}`,
  }).toString()}`;

  return (
    <section
      id="grand-jour"
      className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 overflow-hidden bg-[linear-gradient(135deg,#3B0910_0%,#58111A_50%,#2A050B_100%)]"
      data-testid="bigday-section"
    >
      <Petals count={10} />
      <span className="absolute top-16 left-4 sm:left-10 pointer-events-none opacity-50">
        <FlowerCorner className="w-20 h-20 sm:w-28 sm:h-28 animate-sway" />
      </span>
      <span className="absolute top-16 right-4 sm:right-10 pointer-events-none opacity-50 -scale-x-100">
        <FlowerCorner className="w-20 h-20 sm:w-28 sm:h-28 animate-sway" />
      </span>
      <span className="absolute bottom-16 left-4 sm:left-10 pointer-events-none opacity-40 -scale-y-100">
        <FlowerCorner className="w-20 h-20 sm:w-28 sm:h-28 animate-sway" />
      </span>
      <span className="absolute bottom-16 right-4 sm:right-10 pointer-events-none opacity-40 -scale-100">
        <FlowerCorner className="w-20 h-20 sm:w-28 sm:h-28 animate-sway" />
      </span>

      <div className="relative z-10 max-w-5xl mx-auto">
        <Chapter index="II" eyebrow="Le Grand Jour" title="Le Compte à Rebours" script="plus que quelques instants" dark />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6" data-testid="countdown-grid">
          {Object.entries(t).map(([label, value], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              className="relative border hairline-gold bg-white/[0.04] backdrop-blur-sm rounded-sm py-8 px-4 text-center overflow-hidden"
              data-testid={`countdown-${label}`}
            >
              <div className="relative h-14 sm:h-16 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={value}
                    initial={{ y: -22, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 22, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="font-display text-5xl sm:text-6xl text-[#D4AF37] tabular-nums"
                  >
                    {String(value).padStart(2, "0")}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-2 font-cinzel text-[10px] tracking-[0.35em] uppercase text-[#C48B92]">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-14 flex flex-wrap justify-center gap-4"
        >
          {BADGES.map(({ icon: Icon, label, time }) => (
            <div
              key={label}
              className="flex items-center gap-3 border hairline-gold rounded-full px-6 py-3 bg-white/[0.03]"
              data-testid={`badge-${label.toLowerCase().replace(/[^a-z]/g, "-")}`}
            >
              <Icon size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
              <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-[#FAF7F2]">{label}</span>
              <span className="font-display italic text-[#C48B92] lining-nums tabular-nums">{time}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-14 mx-auto max-w-sm border hairline-gold bg-white/[0.04] backdrop-blur-sm rounded-sm p-6 sm:p-8"
          data-testid="calendar-card"
        >
          <p className="text-center font-cinzel text-xs tracking-[0.4em] uppercase text-[#D4AF37]">{cal.label}</p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center font-cinzel text-[10px] tracking-widest text-[#C48B92]">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
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
                          stroke="#D4AF37"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span className="relative text-[#D4AF37] font-semibold">{day}</span>
                    </>
                  ) : (
                    day
                  )}
                </span>
              );
            })}
          </div>
          <p className="mt-5 text-center font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C48B92]">
            {dateLabel} — Le Grand Jour
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
            className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] text-[#2A050B] font-cinzel text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-[#B89428] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-all duration-300"
          >
            <CalendarPlus size={16} /> Ajouter au calendrier
          </button>
          <a
            data-testid="google-calendar-link"
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border hairline-gold text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-white/10 transition-all duration-300"
          >
            Google Agenda
          </a>
        </motion.div>
      </div>
    </section>
  );
}
