import { useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { REVEAL_VIEWPORT } from "@/lib/motion-viewport";

const CHAPTER_REVEAL = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.16, delayChildren: 0.02 },
  },
};

const CHAPTER_ITEM_REVEAL = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: EASE },
  },
};

const TITLE_SLOT = {
  hidden: {},
  show: {},
};

const TITLE_REVEAL = {
  hidden: { y: "112%" },
  show: {
    y: "0%",
    transition: { duration: 1.05, ease: EASE },
  },
};

export function ChapterRule() {
  return (
    <div className="chapter-ornament mt-6" aria-hidden="true">
      <span className="chapter-ornament__line" />
      <span className="chapter-ornament__gem">◆</span>
      <span className="chapter-ornament__line chapter-ornament__line--flip" />
    </div>
  );
}

export default function Chapter({ index, eyebrow, title, script, dark = false }) {
  const [presented, setPresented] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      onViewportEnter={() => setPresented(true)}
      variants={CHAPTER_REVEAL}
      viewport={REVEAL_VIEWPORT}
      className={`text-center mb-10 sm:mb-14 md:mb-20 ${presented ? "chapter-presented" : ""}`}
    >
      <motion.p
        variants={CHAPTER_ITEM_REVEAL}
        className={`type-eyebrow ${dark ? "type-eyebrow--on-dark" : ""}`}
        data-testid={`chapter-${index}-eyebrow`}
      >
        Chapitre {index} — {eyebrow}
      </motion.p>
      <motion.div className="chapter-title-mask mt-3 sm:mt-4" variants={TITLE_SLOT}>
        <motion.h2
          variants={TITLE_REVEAL}
          className={`type-display text-[1.75rem] leading-[1.12] sm:text-5xl lg:text-6xl ${dark ? "type-display--on-dark" : ""}`}
        >
          {title}
        </motion.h2>
      </motion.div>
      {script && (
        <motion.p
          variants={CHAPTER_ITEM_REVEAL}
          className={`type-display-script mt-2 sm:mt-3 text-base sm:text-2xl ${dark ? "type-display-script--on-dark" : ""}`}
        >
          {script}
        </motion.p>
      )}
      <motion.div variants={CHAPTER_ITEM_REVEAL}>
        <ChapterRule />
      </motion.div>
    </motion.div>
  );
}
