export const FLORALS = {
  cosmos: "/img/fleurs/cosmos.png",
  roses: "/img/fleurs/roses.png",
  pivoines: "/img/fleurs/pivoines.png",
  bouquet: "/img/fleurs/bouquet.png",
  dahlia: "/img/fleurs/dahlia.png",
  tige: "/img/fleurs/tige.png",
};

export const Floral = ({ src, className = "" }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`pointer-events-none select-none ${className}`}
  />
);

export const Petals = ({ count = 12 }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => {
      const left = (i * 61) % 100;
      const delay = ((i * 137) % 90) / 10;
      const dur = 9 + ((i * 7) % 6);
      const size = 9 + ((i * 5) % 12);
      const tint = i % 3 === 0 ? "#D4AF37" : "#C48B92";
      return (
        <span
          key={i}
          className="petal"
          style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
        >
          <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 1C14 5.5 15.5 10 10 19C4.5 10 6 5.5 10 1Z" fill={tint} fillOpacity="0.7" />
          </svg>
        </span>
      );
    })}
  </div>
);

export const FlowerCorner = ({ className = "", color = "#D4AF37" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 112 C 30 92, 44 74, 52 48" />
      <path d="M24 94 C 15 82, 15 70, 26 64 C 32 75, 32 87, 24 94 Z" />
      <path d="M38 76 C 46 65, 58 61, 66 66 C 59 77, 47 81, 38 76 Z" />
      <circle cx="54" cy="40" r="13" />
      <path d="M54 31 a9 9 0 1 1 -9 9 a6 6 0 1 0 6 -6 a3 3 0 1 1 -3 3" />
      <circle cx="54" cy="40" r="18" strokeOpacity="0.35" strokeDasharray="2 5" />
      <circle cx="86" cy="96" r="4" fill={color} stroke="none" fillOpacity="0.6" />
      <circle cx="98" cy="80" r="3" fill={color} stroke="none" fillOpacity="0.45" />
    </g>
  </svg>
);

export const Rose = ({ size = 80, tone = 0 }) => {
  const palettes = [
    ["#4A0E17", "#6B1724", "#9C3244"],
    ["#C48B92", "#D8A3AC", "#E8BEC4"],
    ["#EBD0D5", "#F4E4E7", "#FBF1F2"],
  ];
  const [c1, c2, c3] = palettes[tone % 3];
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <path d="M14 68 C 9 54, 16 43, 29 41 C 27 53, 22 63, 14 68 Z" fill={c1} opacity="0.65" />
      <path d="M66 68 C 71 54, 64 43, 51 41 C 53 53, 58 63, 66 68 Z" fill={c1} opacity="0.65" />
      <circle cx="40" cy="42" r="26" fill={c3} />
      <circle cx="40" cy="42" r="19" fill={c2} />
      <path
        d="M40 24 a18 18 0 1 1 -18 18 a13 13 0 1 0 13 -13 a8 8 0 1 1 -8 8 a4 4 0 1 0 4 -4"
        fill="none"
        stroke={c1}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="40" cy="42" r="3.5" fill={c1} />
    </svg>
  );
};

const ROSES = [
  { s: 72, t: 2, mb: -10 },
  { s: 104, t: 0, mb: -20 },
  { s: 62, t: 1, mb: -4 },
  { s: 124, t: 0, mb: -26 },
  { s: 82, t: 1, mb: -10 },
  { s: 112, t: 2, mb: -20 },
  { s: 66, t: 1, mb: -6 },
  { s: 98, t: 0, mb: -16 },
  { s: 76, t: 2, mb: -8 },
];

export const RoseCluster = () => (
  <div className="pointer-events-none absolute bottom-0 inset-x-0 z-0 flex items-end justify-center" aria-hidden="true">
    {ROSES.map((r, i) => (
      <span
        key={i}
        className="animate-sway"
        style={{ marginBottom: r.mb, marginLeft: i ? -14 : 0, animationDelay: `${i * 0.8}s`, transformOrigin: "bottom center" }}
      >
        <Rose size={r.s} tone={r.t} />
      </span>
    ))}
  </div>
);
