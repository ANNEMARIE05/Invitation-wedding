import { useSettings } from "@/lib/settings";

export default function Marquee() {
  const { bride, groom, dateShort, venue } = useSettings();
  const items = ["Save the Date", dateShort, venue.name, `${bride} & ${groom}`];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y hairline-gold bg-[#F3ECE2] py-5" data-testid="marquee-ribbon">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((t, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className={i % 2 === 0
                  ? "font-cinzel text-xs sm:text-sm tracking-[0.4em] uppercase text-[#6B1724] px-8"
                  : "font-script text-2xl sm:text-3xl text-[#C48B92] px-8"}>
                  {t}
                </span>
                <span className="text-[#D4AF37] text-lg">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
