import { useI18n } from "@/lib/locale";

const btn =
  "min-w-[2.25rem] px-2.5 py-2 font-cinzel text-[10px] font-bold tracking-[0.12em] uppercase rounded-full transition-all duration-300 leading-none";

export default function LangToggle({ floating = false }) {
  const { locale, setLocale } = useI18n();

  const shell = floating
    ? "fixed z-[95] top-4 right-4 flex items-center gap-0.5 rounded-full border hairline bg-[#FFF0F4]/95 backdrop-blur-md p-0.5 shadow-[0_6px_24px_rgba(42,5,11,0.12)] sm:top-5 sm:right-5"
    : "flex shrink-0 items-center gap-0.5 rounded-full border hairline bg-[#FFF0F4]/90 p-0.5 shadow-[0_4px_16px_rgba(42,5,11,0.08)]";

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
              ? "bg-[#2A050B] text-[#FFFBFC] shadow-sm"
              : "text-[#6B2440] hover:text-[#ED1E79]"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
