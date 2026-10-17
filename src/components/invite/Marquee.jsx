import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";

export default function Marquee() {
  const { coupleLabel, dateShort, venue } = useSettings();
  const { m } = useI18n();
  const items = [m.marquee.saveTheDate, dateShort, venue.name, coupleLabel];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-wedding-rose/12 bg-gradient-to-r from-wedding-ivory via-wedding-on-dark to-wedding-ivory py-4 backdrop-blur-sm" data-testid="marquee-ribbon">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((t, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span
                  className={
                    t === coupleLabel
                      ? "marquee-couple-name font-display text-xl italic sm:text-2xl text-wedding-wine-accent px-8"
                      : i % 2 === 0
                        ? "font-cinzel text-xs font-semibold sm:text-sm tracking-[0.4em] uppercase text-wedding-wine-deep px-8"
                        : "font-display text-xl italic sm:text-2xl text-wedding-wine-accent px-8"
                  }
                >
                  {t}
                </span>
                <span className="text-wedding-silver text-sm">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
