import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { REVEAL_VIEWPORT } from "@/lib/motion-viewport";

const CHAPTER_REVEAL = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.04 },
  },
};

const CHAPTER_ITEM_REVEAL = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: EASE },
  },
};

export default function Chapter({ index, eyebrow, title, script, dark = false }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={CHAPTER_REVEAL}
      viewport={REVEAL_VIEWPORT}
      className="text-center mb-10 sm:mb-14 md:mb-20"
    >
      <motion.p
        variants={CHAPTER_ITEM_REVEAL}
        className={`type-eyebrow ${dark ? "type-eyebrow--on-dark" : ""}`}
        data-testid={`chapter-${index}-eyebrow`}
      >
        Chapitre {index} — {eyebrow}
      </motion.p>
      <motion.h2
        variants={CHAPTER_ITEM_REVEAL}
        className={`type-display mt-3 sm:mt-4 text-[1.75rem] leading-[1.12] sm:text-5xl lg:text-6xl ${dark ? "type-display--on-dark" : ""}`}
      >
        {title}
      </motion.h2>
      {script && (
        <motion.p
          variants={CHAPTER_ITEM_REVEAL}
          className={`type-display-script mt-2 sm:mt-3 text-base sm:text-2xl ${dark ? "type-display-script--on-dark" : ""}`}
        >
          {script}
        </motion.p>
      )}
      <motion.div
        variants={CHAPTER_ITEM_REVEAL}
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
