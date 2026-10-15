import { motion, useReducedMotion } from "framer-motion";

/** Courbe douce, type mouvement « luxe ». */
const CHIC_EASE = [0.42, 0, 0.58, 1];

const PRESETS = {
  "hero-groom": {
    animate: { rotate: [-2.8, 2, -2.8], y: [0, -7, 0], scale: [1, 1.045, 1] },
    transition: { duration: 9.5, repeat: Infinity, ease: CHIC_EASE },
  },
  "hero-bride": {
    animate: { rotate: [2.4, -3, 2.4], y: [0, 6, 0], scale: [1, 1.058, 1] },
    transition: { duration: 11, repeat: Infinity, ease: CHIC_EASE, delay: 0.9 },
  },
  "hero-amp": {
    animate: { scale: [1, 1.12, 1], opacity: [0.86, 1, 0.86] },
    transition: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
  },
  "footer-groom": {
    animate: { rotate: [-3.5, 0, 3.5, 0, -3.5], scale: [1, 1.04, 1.07, 1.04, 1] },
    transition: { duration: 10, repeat: Infinity, ease: CHIC_EASE },
  },
  "footer-bride": {
    animate: { rotate: [2.5, -2.5, 2.5], y: [0, 5, 0], scale: [1, 1.05, 1] },
    transition: { duration: 10.5, repeat: Infinity, ease: CHIC_EASE, delay: 0.55 },
  },
  "footer-amp": {
    animate: { scale: [1, 1.18, 1], y: [0, -3, 0], opacity: [0.9, 1, 0.9] },
    transition: { duration: 6.8, repeat: Infinity, ease: CHIC_EASE },
  },
};

export default function CoupleNameMotion({ preset, as: Tag = "div", className = "", children }) {
  const reduce = useReducedMotion();
  const cfg = PRESETS[preset];

  if (!cfg) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <MotionTag
      className={className}
      style={{ transformOrigin: "50% 55%" }}
      animate={reduce ? undefined : cfg.animate}
      transition={cfg.transition}
    >
      {children}
    </MotionTag>
  );
}
