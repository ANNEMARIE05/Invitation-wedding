import { useMemo } from "react";

export default function SparkleField({ count = 12, className = "" }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${8 + ((i * 19) % 78)}%`,
        left: `${4 + ((i * 31) % 90)}%`,
        delay: `${(i * 0.45) % 4}s`,
        scale: 0.6 + (i % 3) * 0.25,
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="sparkle-star"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            transform: `scale(${s.scale})`,
          }}
        />
      ))}
    </div>
  );
}
