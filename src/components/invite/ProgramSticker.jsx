import { Landmark, UtensilsCrossed } from "lucide-react";

function KingdomHallIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v3.5" />
      <path d="M10.5 6.5h3L12 9l-1.5-2.5z" />
      <path d="M12 9v1.8" />
      <path d="M4.5 20V11.5L12 7l7.5 4.5V20" />
      <path d="M3 20h18" />
      <path d="M9.5 20v-5.5h5V20" />
      <path d="M12 13.2v2.3" />
    </svg>
  );
}

const STICKERS = {
  civil: { Icon: Landmark, tilt: -8 },
  church: { Icon: KingdomHallIcon, tilt: 9 },
  dining: { Icon: UtensilsCrossed, tilt: -6 },
};

export default function ProgramSticker({ kind, flip, side = "left" }) {
  const cfg = STICKERS[kind];
  if (!cfg) return null;
  const { Icon, tilt } = cfg;
  const rotate = flip ? -tilt : tilt;
  const onRight = side === "right";

  return (
    <span
      aria-hidden="true"
      className={`program-sticker pointer-events-none absolute z-20 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border-2 left-auto right-[0.85rem] top-[-0.65rem] sm:h-[3.5rem] sm:w-[3.5rem] ${
        onRight ? "md:left-auto md:right-[0.85rem]" : "md:left-[0.85rem] md:right-auto"
      }`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {kind === "church" ? (
        <Icon className="h-[1.65rem] w-[1.65rem] sm:h-[1.75rem] sm:w-[1.75rem]" />
      ) : (
        <Icon size={26} strokeWidth={1.65} />
      )}
    </span>
  );
}
