import { useI18n } from "@/lib/locale";

const btn =
  "min-w-[2.25rem] px-2.5 py-2 font-cinzel text-[10px] font-bold tracking-[0.12em] uppercase rounded-[8px] transition-all duration-300 leading-none hover:scale-[1.04] active:scale-95";

export default function LangToggle({ floating = false, solid = false }) {
  const { locale, setLocale } = useI18n();

  const shell = floating
    ? "fixed z-[95] top-7 right-7 flex items-center gap-0.5 rounded-[8px] border hairline bg-wedding-on-dark/98 backdrop-blur-md p-0.5 shadow-[0_10px_24px_-8px_rgba(232,61,137,0.4)] sm:top-9 sm:right-9"
    : solid
      ? "flex shrink-0 items-center gap-0.5 rounded-[8px] border border-wedding-rose-light/40 bg-wedding-on-dark p-0.5 shadow-[0_8px_18px_-8px_rgba(232,61,137,0.28)]"
      : "flex shrink-0 items-center gap-0.5 rounded-[8px] border hairline bg-wedding-ivory/90 p-0.5 shadow-[0_8px_18px_-8px_rgba(232,61,137,0.28)]";

  return (
    <div
      className={shell}
      data-testid="lang-toggle"
      role="group"
      aria-label="Language"
    >
      {["fr", "en"].map((code) => (
        <button
          key={code}
          type="button"
          data-testid={`lang-${code}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className={`${btn} ${
            locale === code
              ? "bg-wedding-wine-deep text-wedding-on-dark shadow-sm"
              : "text-wedding-wine hover:text-wedding-rose"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
