/** Bord de nuage net et élégant entre deux sections. */
export default function TornDivider({ top, bottom }) {
  return (
    <div
      className="relative -my-px h-12 overflow-hidden sm:h-16"
      aria-hidden="true"
      style={{ backgroundColor: bottom }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          d="M0 0 H1440 V42 C1412 42 1404 64 1376 64 C1347 64 1339 37 1309 37 C1280 37 1272 59 1243 59 C1214 59 1206 31 1177 31 C1147 31 1139 56 1110 56 C1081 56 1073 39 1044 39 C1015 39 1007 67 978 67 C949 67 941 44 912 44 C883 44 875 29 846 29 C817 29 809 58 780 58 C751 58 743 39 714 39 C685 39 677 68 648 68 C619 68 611 46 582 46 C553 46 545 32 516 32 C487 32 479 61 450 61 C421 61 413 42 384 42 C355 42 347 69 318 69 C289 69 281 48 252 48 C223 48 215 34 186 34 C157 34 149 61 120 61 C91 61 83 42 54 42 C30 42 22 55 0 55 Z"
          fill={top}
          stroke="rgba(212, 175, 55, 0.45)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
