export default function TornDivider({ top, bottom }) {
  return (
    <div className="relative h-[46px] sm:h-[60px] -my-px" style={{ background: bottom }} aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full block">
        <path
          d="M0 0 H1440 V16 C 1408 32, 1392 8, 1352 24 S 1294 42, 1254 20 S 1182 38, 1142 22 S 1068 6, 1028 28 S 954 44, 914 22 S 842 34, 802 16 S 730 40, 690 24 S 618 8, 578 30 S 506 44, 466 20 S 394 36, 354 18 S 282 40, 242 22 S 170 6, 130 26 S 58 40, 20 18 L0 24 Z"
          fill={top}
        />
      </svg>
    </div>
  );
}
