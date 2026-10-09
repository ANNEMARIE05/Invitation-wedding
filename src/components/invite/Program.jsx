import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";
import ProgramSticker from "./ProgramSticker";

export default function Program() {
  const { m } = useI18n();
  const { dateLabel } = useSettings();
  return (
    <section id="programme" className="relative overflow-hidden py-24 md:py-36 px-5 sm:px-8 lg:px-16" data-testid="program-section">
      <div className="relative z-10 max-w-4xl mx-auto">
        <Chapter index="III" eyebrow={m.program.chapter} title={m.program.title} script={dateLabel} />
        <div className="relative">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent" />
          <div className="space-y-12">
            {m.program.items.map((p, i) => (
              <motion.div
                key={p.time}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className={`relative pl-14 md:pl-0 md:w-[52%] ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}
                data-testid={`program-item-${i}`}
              >
                <span className={`absolute top-6 left-[13px] z-10 h-3.5 w-3.5 rounded-full border-2 border-[#C0C0C0] bg-[#FFFBFC] shadow-[0_0_0_4px_rgba(192,192,192,0.2)] ${i % 2 === 0 ? "md:left-auto md:-right-[7px]" : "md:-left-[7px]"}`} />
                <LuxeCard
                  lift
                  className={`program-event-card relative overflow-visible p-6 pt-9 sm:p-7 sm:pt-10 ${i % 2 === 0 ? "md:text-right" : ""}`}
                >
                  {p.sticker ? (
                    <ProgramSticker
                      kind={p.sticker}
                      flip={i % 2 !== 0}
                      side={i % 2 === 0 ? "left" : "right"}
                    />
                  ) : null}
                  <p className="font-display text-2xl font-semibold italic text-[#9B1B4A] lining-nums tabular-nums sm:text-3xl">{p.time}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-[#2A050B] sm:text-2xl">{p.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#4A1025] sm:text-base">{p.text}</p>
                </LuxeCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
