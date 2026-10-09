import { useEffect, useMemo, useState } from "react";

const COLORS = ["#ED1E79", "#FFD6E0", "#FFFBFC", "#F7338B", "#E8EAEF", "#9B1B4A"];
const MOBILE_MQ = "(max-width: 639px)";

function densityForViewport(density) {
  if (typeof window === "undefined") return density;
  return window.matchMedia(MOBILE_MQ).matches
    ? Math.max(6, Math.round(density * 0.4))
    : density;
}

function useMobileDensity(density) {
  const [count, setCount] = useState(() => densityForViewport(density));

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const apply = () => setCount(densityForViewport(density));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [density]);

  return count;
}

/** Pétales & confettis floraux — chute + lancer type bouquet */
export default function WeddingPetals({ active = true, density = 18, variant = "page" }) {
  const effectiveDensity = useMobileDensity(density);
  const petals = useMemo(
    () =>
      Array.from({ length: effectiveDensity }, (_, i) => ({
        id: i,
        left: `${((i * 23 + 11) % 97) + 1}%`,
        delay: `${(i * 1.15) % 12}s`,
        duration: `${9 + (i % 6) * 2.4}s`,
        size: 12 + (i % 5) * 4,
        drift: `${-36 + (i % 9) * 10}px`,
        rot: (i * 53) % 360,
        color: COLORS[i % COLORS.length],
        kind: i % 4 === 0 ? "toss" : i % 5 === 0 ? "spark" : "petal",
      })),
    [effectiveDensity],
  );

  if (!active) return null;

  const shell =
    variant === "hero"
      ? "wedding-petals wedding-petals--hero pointer-events-none absolute inset-0 overflow-hidden"
      : "wedding-petals pointer-events-none fixed inset-0 overflow-hidden";

  return (
    <div className={shell} aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={
            p.kind === "spark"
              ? "wedding-spark"
              : p.kind === "toss"
                ? "wedding-petal wedding-petal--toss"
                : "wedding-petal"
          }
          style={{
            "--petal-left": p.left,
            "--petal-delay": p.delay,
            "--petal-dur": p.duration,
            "--petal-drift": p.drift,
            "--petal-size": `${p.size}px`,
            "--petal-rot": `${p.rot}deg`,
            "--petal-color": p.color,
          }}
        />
      ))}
    </div>
  );
}
