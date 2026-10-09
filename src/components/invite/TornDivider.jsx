/** Fondu discret entre sections — sans forme agressive */
export default function TornDivider({ top, bottom }) {
  return (
    <div
      className="relative h-5 sm:h-6 -my-px"
      aria-hidden="true"
      style={{
        background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`,
      }}
    />
  );
}
