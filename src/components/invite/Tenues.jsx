import { motion } from "framer-motion";
import { EASE, IMAGES } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import { mergeTheme } from "@/lib/theme";
import Chapter from "./Chapter";

const swatchStyle = (color) => {
  if (color.metallic) {
    return {
      background:
        "linear-gradient(145deg, #f8f9fb 0%, #e8eaef 18%, #ffffff 38%, var(--silver) 52%, #dfe2e8 72%, #a8adb8 100%)",
      boxShadow: "inset 0 2px 6px rgba(255,255,255,0.65), inset 0 -2px 5px rgba(80,85,95,0.18)",
    };
  }
  if (color.id === "magenta") {
    return {
      background: `linear-gradient(160deg, var(--rose-bright) 0%, ${color.hex} 55%, var(--wine-accent) 100%)`,
    };
  }
  return { background: color.hex };
};

export default function Tenues() {
  const { m } = useI18n();
  const { dressPalette } = useSettings();
  const palette = dressPalette?.length ? dressPalette : mergeTheme({}).dressPalette;
  const colorNames = palette.map((c) => m.tenues.colorLabels[c.id] || c.label).join(", ");

  return (
    <section
      id="tenues"
      className="relative overflow-hidden py-16 px-5 sm:px-8 sm:py-24 md:py-36 lg:px-16"
      data-testid="tenues-section"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <Chapter index="V" eyebrow={m.tenues.chapter} title={m.tenues.title} script={m.tenues.script} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-10 sm:mt-14"
          data-testid="dresscode-inspiration"
        >
          <img
            src={IMAGES.dresscodeInspiration}
            alt={m.tenues.inspirationAlt}
            className="mx-auto block h-auto w-full max-w-5xl object-contain"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.85, delay: 0.06, ease: EASE }}
          className="type-display-script mx-auto mt-8 max-w-3xl text-center text-base sm:mt-12 sm:text-xl md:text-2xl"
          data-testid="wedding-colors"
        >
          {m.tenues.paletteText}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12 sm:gap-5"
          role="img"
          aria-label={colorNames}
        >
          {palette.map((color) => (
            <span
              key={color.id}
              className="relative flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F7ECD0] via-wedding-gold to-[#8A6424] p-[3px] shadow-[0_6px_18px_rgba(201,169,98,0.28)] sm:h-14 sm:w-14"
              title={m.tenues.colorLabels[color.id] || color.label}
              data-testid={`color-${color.id}`}
            >
              <span
                className="h-full w-full rounded-full ring-2 ring-white/85 ring-offset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)]"
                style={swatchStyle(color)}
                aria-hidden="true"
              />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
