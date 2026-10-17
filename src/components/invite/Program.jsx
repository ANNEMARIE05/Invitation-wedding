import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { REVEAL_VIEWPORT } from "@/lib/motion-viewport";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";
import ProgramSticker from "./ProgramSticker";

/** Évite une coupure de ligne au milieu de « Jéhovah » sur mobile. */
const protectJehovah = (text) => text.replace(/Jéhovah/g, "Jéh\u2060ovah");

export default function Program() {
  const { m } = useI18n();
  const { dateLabel } = useSettings();
  return (
    <section id="programme" className="relative overflow-hidden py-24 md:py-36 px-5 sm:px-8 lg:px-16" data-testid="program-section">
      <div className="relative z-10 max-w-4xl mx-auto">
        <Chapter index="III" eyebrow={m.program.chapter} title={m.program.title} script={dateLabel} />
        <div className="relative">
          <div
            className="program-timeline-rail pointer-events-none absolute left-1/2 top-0 bottom-0 z-0 w-px -translate-x-1/2 max-md:w-0.5"
            aria-hidden="true"
          />
          <div className="space-y-10 md:space-y-12">
            {m.program.items.map((p, i) => (
              <motion.div
                key={p.time}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ duration: 0.9, ease: EASE }}
                className={`program-event-row relative z-[1] isolate w-full md:w-[52%] ${
                  i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
                }`}
                data-testid={`program-item-${i}`}
              >
                <span
                  className={`program-event-dot absolute z-20 h-3.5 w-3.5 rounded-full border-2 border-[#C0C0C0] bg-wedding-on-dark shadow-[0_0_0_4px_rgba(192,192,192,0.22)] left-1/2 top-7 -translate-x-1/2 md:top-6 md:translate-x-0 ${
                    i % 2 === 0 ? "md:left-auto md:-right-[7px]" : "md:-left-[7px]"
                  }`}
                />
                <LuxeCard
                  lift
                  className={`program-event-card relative overflow-visible p-6 pt-10 text-left sm:p-7 sm:pt-10 ${
                    i % 2 === 0 ? "md:text-right" : ""
                  }`}
                >
                  {p.sticker ? (
                    <ProgramSticker
                      kind={p.sticker}
                      flip={i % 2 !== 0}
                      side={i % 2 === 0 ? "left" : "right"}
                    />
                  ) : null}
                  <p className="type-accent-time text-2xl sm:text-3xl">{p.time}</p>
                  <h3 className="type-card-title mt-1 text-xl sm:text-2xl">{p.title}</h3>
                  <p className="type-prose mt-2 text-sm sm:text-base">{protectJehovah(p.text)}</p>
                </LuxeCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
