import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";

export default function Marquee() {
  const { coupleLabel, dateShort, venue } = useSettings();
  const { m } = useI18n();
  const items = [m.marquee.saveTheDate, dateShort, venue.name, coupleLabel];
  const row = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y border-wedding-rose-light/25 bg-gradient-to-r from-wedding-wine-deep via-wedding-wine to-wedding-wine-deep py-4"
      data-testid="marquee-ribbon"
    >
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((t, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span
                  className={
                    t === coupleLabel
                      ? "marquee-couple-name invite-on-wine font-display text-xl italic sm:text-2xl px-8"
                      : i % 2 === 0
                        ? "invite-on-wine-accent font-cinzel text-xs font-semibold sm:text-sm tracking-[0.4em] uppercase px-8"
                        : "invite-on-wine-caption font-display text-xl italic sm:text-2xl px-8"
                  }
                >
                  {t}
                </span>
                <span className="invite-on-wine-accent text-sm">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
