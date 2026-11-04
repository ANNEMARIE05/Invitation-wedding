import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import ClassicRule from "@/components/invite/ClassicRule";

export default function CoupleBackofficePanel({
  eyebrow,
  title,
  subtitle,
  intro,
  headerExtra,
  children,
  wide = false,
  className = "",
  testId,
}) {
  const { coupleLabel } = useSettings();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE }}
      className={`couple-classic-card couple-backoffice-panel ${wide ? "couple-backoffice-panel--wide" : ""} relative mx-auto w-full ${className}`}
      data-testid={testId}
    >
      <div className="couple-classic-card__frame pointer-events-none" aria-hidden />
      <span className="faire-part-gold-point faire-part-gold-point--tl couple-classic-card__corner" aria-hidden />
      <span className="faire-part-gold-point faire-part-gold-point--tr couple-classic-card__corner" aria-hidden />
      <span className="faire-part-gold-point faire-part-gold-point--bl couple-classic-card__corner" aria-hidden />
      <span className="faire-part-gold-point faire-part-gold-point--br couple-classic-card__corner" aria-hidden />

      <div className="relative px-4 py-6 sm:px-10 sm:py-11">
        {(title || eyebrow) && (
          <header className="couple-backoffice-header text-center">
            {coupleLabel ? (
              <p className="couple-classic-card__kicker tracking-[0.22em] sm:tracking-[0.28em]">{coupleLabel}</p>
            ) : null}
            {eyebrow ? (
              <p className="couple-classic-card__kicker mt-1.5 text-center tracking-[0.26em] sm:mt-2 sm:tracking-[0.34em]">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1 className="couple-classic-card__title mt-2 text-center font-display text-[1.55rem] font-medium italic leading-tight text-[#2f0518] sm:mt-3 sm:text-[2.35rem]">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="type-script mt-1.5 text-center text-[1.35rem] text-[#6a1037] sm:mt-2 sm:text-[2rem]">
                {subtitle}
              </p>
            ) : null}
            {intro ? (
              <>
                <ClassicRule className="mx-auto mt-5 max-w-md sm:mt-6" />
                <p className="couple-hub-intro mx-auto mt-4 max-w-2xl text-pretty sm:mt-6">{intro}</p>
              </>
            ) : title || subtitle ? (
              <ClassicRule className="mx-auto mt-5 max-w-md sm:mt-6" />
            ) : null}
            {headerExtra ? <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6">{headerExtra}</div> : null}
          </header>
        )}

        <div className={title || eyebrow ? "mt-5 sm:mt-10" : ""}>{children}</div>
      </div>
    </motion.article>
  );
}
