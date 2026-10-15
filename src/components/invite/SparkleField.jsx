import { useMemo } from "react";

export default function SparkleField({ count = 12, className = "", chic = false, onLight = false }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${8 + ((i * 19) % 78)}%`,
        left: `${4 + ((i * 31) % 90)}%`,
        delay: `${(i * 0.45) % 4}s`,
        scale: 0.6 + (i % 3) * 0.25,
        diamond: chic && i % 2 === 0,
      })),
    [count, chic],
  );

  const shell = onLight ? "sparkle-field--on-light" : "";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${shell} ${className}`} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className={`sparkle-star ${s.diamond ? "sparkle-star--diamond" : ""}`}
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            ["--sparkle-scale"]: s.scale,
          }}
        />
      ))}
    </div>
  );
}
