/** Accents décoratifs — sans motifs floraux */

export const CornerAccent = ({ className = "", flip = "" }) => (
  <span
    className={`inline-block ${flip} ${className}`}
    aria-hidden="true"
  >
    <span className="block h-9 w-9 border-[#D4AF37]/60 sm:h-11 sm:w-11 border-l border-t" />
  </span>
);

export const BerryCardDecor = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="berry-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ED1E79" />
        <stop offset="45%" stopColor="#E31B23" />
        <stop offset="100%" stopColor="#7A1538" />
      </linearGradient>
      <linearGradient id="berry-panel" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFF5F8" />
        <stop offset="100%" stopColor="#FFD6E0" />
      </linearGradient>
    </defs>
    <rect width="400" height="520" fill="url(#berry-bg)" />
    <ellipse cx="200" cy="480" rx="220" ry="80" fill="#5C0A20" fillOpacity="0.2" />
    <path
      d="M 40 120 Q 200 40 360 120 L 360 460 Q 200 500 40 460 Z"
      fill="url(#berry-panel)"
      stroke="#B8BCC8"
      strokeWidth="3"
    />
    <path d="M 52 132 Q 200 56 348 132" fill="none" stroke="#E8EAEF" strokeWidth="1.5" opacity="0.9" />
    <path d="M 56 88 L 344 88" stroke="#D4AF37" strokeWidth="0.75" opacity="0.35" />
    <path d="M 56 432 L 344 432" stroke="#D4AF37" strokeWidth="0.75" opacity="0.35" />
  </svg>
);
