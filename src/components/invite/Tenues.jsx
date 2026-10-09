import { motion } from "framer-motion";
import { Sparkles, Shirt } from "lucide-react";
import { EASE, WEDDING_PALETTE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";
import SparkleField from "./SparkleField";

const GEM = {
  berry: "h-[5.5rem] w-[5.5rem] sm:h-[6.25rem] sm:w-[6.25rem]",
  wine: "h-[5rem] w-[5rem] sm:h-[5.75rem] sm:w-[5.75rem]",
  blush: "h-[5.25rem] w-[5.25rem] sm:h-[6rem] sm:w-[6rem]",
  silver: "h-[4.75rem] w-[4.75rem] sm:h-[5.5rem] sm:w-[5.5rem]",
};

const gemStyle = (color) => {
  if (color.metallic) {
    return {
      background:
        "linear-gradient(145deg, #ffffff 0%, #e8eaef 30%, #ffffff 48%, #b8bcc8 55%, #f3f4f6 78%, #c0c0c0 100%)",
    };
  }
  if (color.id === "wine") {
    return {
      background: `linear-gradient(145deg, ${color.hex} 0%, #3b0910 100%)`,
      boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35)",
    };
  }
  return {
    background: color.hex,
    boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.4), 0 16px 36px ${color.hex}44`,
  };
};

export default function Tenues() {
  const { m } = useI18n();
  return (
    <section
      id="tenues"
      className="relative overflow-hidden py-24 md:py-36 px-5 sm:px-8 lg:px-16"
      data-testid="tenues-section"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <Chapter index="V" eyebrow={m.tenues.chapter} title={m.tenues.title} script={m.tenues.script} />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-12 sm:mt-16"
        >
          <LuxeCard noInset className="relative overflow-hidden !p-0" data-testid="wedding-colors">
            <SparkleField count={16} />
            <div className="relative bg-gradient-to-br from-[#FFF0F4] via-[#FFFBFC] to-[#FFE8F0] px-6 py-12 sm:px-10 sm:py-16">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ED1E79]/10 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[#C9A962]/15 blur-3xl" aria-hidden="true" />

              <p className="relative text-center font-cinzel text-[10px] font-bold tracking-[0.45em] uppercase text-[#ED1E79]">
                {m.tenues.paletteTitle}
              </p>
              <p className="relative mx-auto mt-3 max-w-lg text-center font-display text-lg font-medium leading-relaxed text-[#4A1025] sm:text-xl">
                {m.tenues.paletteText}
              </p>

              <div className="relative mx-auto mt-12 flex max-w-3xl flex-wrap items-end justify-center gap-x-10 gap-y-10 sm:gap-x-14">
                {WEDDING_PALETTE.map((color, i) => (
                  <motion.div
                    key={color.id}
                    initial={{ opacity: 0, y: 28, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, delay: 0.08 * i, ease: EASE }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`palette-gem-ring ${GEM[color.id] || "h-24 w-24"}`}>
                      <div
                        className="palette-gem h-full w-full"
                        style={gemStyle(color)}
                        data-testid={`color-${color.id}`}
                      />
                    </div>
                    <span className="mt-4 font-cinzel text-[10px] font-bold tracking-[0.28em] uppercase text-[#5C0A20]">
                      {m.tenues.colorLabels[color.id] || color.label}
                    </span>
                    <span className="mt-1 font-display text-sm font-semibold tracking-wide text-[#7A1538]">{color.hex}</span>
                  </motion.div>
                ))}
              </div>

              <div className="relative mx-auto mt-12 flex max-w-md items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#ED1E79]/65" />
                <Sparkles size={14} className="text-[#C9A962]" strokeWidth={1.5} />
                <span className="font-cinzel text-[9px] font-bold tracking-[0.35em] uppercase text-[#9B1B4A]">Berry Love</span>
                <Sparkles size={14} className="text-[#C9A962]" strokeWidth={1.5} />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#ED1E79]/65" />
              </div>
            </div>
          </LuxeCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mt-10 grid gap-4 sm:grid-cols-2"
          data-testid="dresscode-card"
        >
          {m.tenues.dress.map(({ title, text }, idx) => {
            const Icon = idx === 0 ? Shirt : Sparkles;
            return (
            <LuxeCard key={title} lift className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#ED1E79]/25 bg-gradient-to-br from-[#FFF0F4] to-[#FFFBFC] text-[#ED1E79] shadow-[0_8px_20px_rgba(237,30,121,0.12)]">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-cinzel text-[11px] font-bold tracking-[0.25em] uppercase text-[#7A1538]">{title}</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#4A1025]">{text}</p>
                </div>
              </div>
            </LuxeCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
