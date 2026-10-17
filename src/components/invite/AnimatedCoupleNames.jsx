import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import TypewriterText from "./TypewriterText";
import CoupleNameMotion from "./CoupleNameMotion";

/**
 * Prénoms du couple — apparition + effet machine à écrire.
 */
export default function AnimatedCoupleNames({
  groom,
  bride,
  start = true,
  variant = "stack",
  className = "",
  baseDelay = 0,
  speed = 58,
  motionDelay = 0,
}) {
  const brideDelay = baseDelay + groom.length * speed + 320;

  const nameCls =
    variant === "script"
      ? "font-script text-3xl sm:text-4xl text-wedding-gold-accent"
      : variant === "footer"
        ? "couple-name-shimmer font-script text-5xl sm:text-6xl"
        : "font-display text-2xl font-medium italic text-wedding-rose-light sm:text-3xl";

  const showFlowers = variant !== "footer";

  const ampCls =
    variant === "footer"
      ? "my-2 font-cinzel text-sm tracking-[0.45em] text-[#C48B92]"
      : "my-1 font-cinzel text-xs sm:text-sm tracking-[0.4em] text-wedding-rose";

  return (
    <motion.div
      className={`couple-names-animate text-center ${variant === "footer" ? "couple-names-animate--footer" : ""} ${className}`.trim()}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={start ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(6px)" }}
      transition={{ duration: 0.9, delay: motionDelay, ease: EASE }}
    >
      {variant === "footer" ? (
        <>
          <CoupleNameMotion preset="footer-groom" className="flex w-full justify-center">
            <TypewriterText
              text={groom}
              start={start}
              delay={baseDelay}
              speed={speed}
              showCursor={false}
              className={`${nameCls} couple-name-shimmer--c`}
            />
          </CoupleNameMotion>
          <CoupleNameMotion preset="footer-amp">
            <p className="couple-name-amp couple-name-amp--footer my-2 font-cinzel text-sm tracking-[0.45em]">&</p>
          </CoupleNameMotion>
          <CoupleNameMotion preset="footer-bride" className="flex w-full justify-center">
            <TypewriterText
              text={bride}
              start={start}
              delay={brideDelay}
              speed={speed}
              showCursor={false}
              className={`${nameCls} couple-name-shimmer--d`}
            />
          </CoupleNameMotion>
        </>
      ) : variant === "inline" ? (
        <p className={nameCls}>
          <TypewriterText
            text={groom}
            start={start}
            delay={baseDelay}
            speed={speed}
            flowerAtStart={showFlowers}
            flowerAtEnd={showFlowers}
          />
          <span className="mx-2 font-cinzel not-italic tracking-[0.35em] text-wedding-rose">&</span>
          <TypewriterText
            text={bride}
            start={start}
            delay={brideDelay}
            speed={speed}
            flowerAtEnd={showFlowers}
          />
        </p>
      ) : (
        <>
          <p className={nameCls}>
            <TypewriterText
              text={groom}
              start={start}
              delay={baseDelay}
              speed={speed}
              flowerAtStart={showFlowers}
              flowerAtEnd={showFlowers}
            />
          </p>
          <p className={ampCls}>&</p>
          <p className={nameCls}>
            <TypewriterText
              text={bride}
              start={start}
              delay={brideDelay}
              speed={speed}
              flowerAtEnd={showFlowers}
            />
          </p>
        </>
      )}
    </motion.div>
  );
}
