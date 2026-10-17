import { motion } from "framer-motion";
import { EASE, IMAGES } from "@/lib/invite-data";
import { usePhoto } from "@/lib/photos";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
export default function Story() {
  const { coupleLabel, story } = useSettings();
  const portrait = usePhoto("portrait", IMAGES.portrait);
  return (
    <section id="histoire" className="py-24 md:py-36 px-5 sm:px-8 lg:px-16" data-testid="story-section">
      <div className="max-w-6xl mx-auto">
        <Chapter index="I" eyebrow="Manifeste" title="Notre Histoire" script="trois instants, une vie" />
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 1, ease: EASE }}
            className="relative md:sticky md:top-28"
          >
            <div className="absolute -top-4 -left-4 right-4 bottom-4 border border-wedding-gold-accent/50 rounded-sm" />
            <img
              src={portrait}
              alt={`Portrait de ${coupleLabel}`}
              className="relative w-full aspect-[3/4] object-cover clipped-frame"
              data-testid="story-portrait"
            />
            <p className="absolute -bottom-6 right-6 bg-wedding-wine-deep text-wedding-on-dark font-script text-2xl px-6 py-2 shadow-xl">
              pour toujours
            </p>
          </motion.div>

          <div className="space-y-14 pt-4">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="type-display-script text-2xl sm:text-3xl"
            >
              « Certaines rencontres ressemblent à des évidences que le destin aurait signées à l'encre d'or. »
            </motion.p>
            {story.map((s, i) => (
              <motion.div
                key={s.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
                className="relative pl-10 border-l hairline-gold"
                data-testid={`story-item-${s.year}`}
              >
                <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-wedding-gold-accent shadow-[0_0_0_4px_rgba(212,175,55,0.2)]" />
                <p className="font-cinzel text-sm tracking-[0.3em] text-wedding-wine-accent">{s.year}</p>
                <h3 className="type-card-title mt-2 text-2xl sm:text-3xl">{s.title}</h3>
                <p className="type-prose mt-3 text-sm sm:text-base">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
