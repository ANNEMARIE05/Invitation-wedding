import { motion } from "framer-motion";
import ClassicRule from "@/components/invite/ClassicRule";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";

/** Carte blanche sortie de l'enveloppe — réutilisée dans l'intro et le hero (layoutId). */
export default function IntroLetterCard({
  layoutId = "intro-invitation-letter",
  className = "",
  compact = false,
  floating = false,
  initial,
  animate,
  transition,
  style,
}) {
  const { dateLabel, coupleLabel, initials } = useSettings();
  const { m } = useI18n();

  const inner = (
    <>
      <div className="absolute inset-1.5 rounded-sm border border-wedding-gold-accent/35 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-sm border border-wedding-rose/18 pointer-events-none" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center sm:px-8">
        <p className="font-cinzel text-[8px] tracking-[0.42em] uppercase text-wedding-wine-accent/85 sm:text-[9px]">
          {m.intro.weddingTag}
        </p>
        <ClassicRule className="my-3 max-w-[10rem] sm:my-4" gem="♥" />
        <p className="font-display text-xl tracking-[0.2em] text-wedding-ink sm:text-2xl">{initials}</p>
        <p
          className={`mt-4 font-display font-medium italic leading-tight text-wedding-ink ${
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-[2.65rem]"
          }`}
        >
          {coupleLabel}
        </p>
        <ClassicRule className="my-4 max-w-[9rem] sm:my-5" />
        <p className="font-cinzel text-[9px] tracking-[0.32em] uppercase text-wedding-wine-accent sm:text-[10px]">
          {dateLabel}
        </p>
      </div>
    </>
  );

  const shellCls = [
    "intro-letter-card relative overflow-hidden rounded-sm bg-wedding-on-dark",
    floating
      ? "shadow-[0_32px_90px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,175,55,0.12)]"
      : "shadow-[0_24px_70px_rgba(0,0,0,0.45)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        className={shellCls}
        data-testid="intro-letter-card"
        initial={initial}
        animate={animate}
        transition={transition}
        style={style}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <div className={shellCls} data-testid="intro-letter-card">
      {inner}
    </div>
  );
}
