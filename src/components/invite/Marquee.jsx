import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";

export default function Marquee() {
  const { bride, groom, dateShort, venue } = useSettings();
  const { m } = useI18n();
  const items = [m.marquee.saveTheDate, dateShort, venue.name, `${bride} & ${groom}`];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[#ED1E79]/12 bg-gradient-to-r from-[#FFF0F4] via-[#FFFBFC] to-[#FFF0F4] py-4 backdrop-blur-sm" data-testid="marquee-ribbon">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((t, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className={i % 2 === 0
                  ? "font-cinzel text-xs font-semibold sm:text-sm tracking-[0.4em] uppercase text-[#5C0A20] px-8"
                  : "font-display text-xl italic sm:text-2xl text-[#9B1B4A] px-8"}>
                  {t}
                </span>
                <span className="text-[#B8BCC8] text-sm">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
