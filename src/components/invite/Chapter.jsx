import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { REVEAL_VIEWPORT } from "@/lib/motion-viewport";

export default function Chapter({ index, eyebrow, title, script, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.9, ease: EASE }}
      className="text-center mb-14 md:mb-20"
    >
      <p
        className={`type-eyebrow ${dark ? "type-eyebrow--on-dark" : ""}`}
        data-testid={`chapter-${index}-eyebrow`}
      >
        Chapitre {index} — {eyebrow}
      </p>
      <h2
        className={`type-display mt-4 text-4xl sm:text-5xl lg:text-6xl ${dark ? "type-display--on-dark" : ""}`}
      >
        {title}
      </h2>
      {script && (
        <p
          className={`type-display-script mt-3 text-xl sm:text-2xl ${dark ? "type-display-script--on-dark" : ""}`}
        >
          {script}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0.6, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 0.8, ease: EASE }}
        className="chapter-ornament mt-6"
        aria-hidden="true"
      >
        <span className="chapter-ornament__line" />
        <span className="chapter-ornament__gem">◆</span>
        <span className="chapter-ornament__line chapter-ornament__line--flip" />
      </motion.div>
    </motion.div>
  );
}
