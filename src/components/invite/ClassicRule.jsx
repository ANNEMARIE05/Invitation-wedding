/** Séparateur typographique — faire-part classique */
export default function ClassicRule({ className = "", gem = "✦", tone = "paper" }) {
  const gemClass = tone === "light" ? "text-[#FFD6E0]/90" : "text-[#D4AF37]";
  const lineClass =
    tone === "light"
      ? "classic-rule__line classic-rule__line--light"
      : "classic-rule__line";

  return (
    <div className={`classic-rule ${className}`} aria-hidden="true">
      <span className={lineClass} />
      <span className={`classic-rule__gem font-cinzel ${gemClass}`}>{gem}</span>
      <span className={lineClass} />
    </div>
  );
}
