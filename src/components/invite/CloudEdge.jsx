export default function CloudEdge({ tone = "wine", position = "top" }) {
  return (
    <span
      className={`cloud-edge cloud-edge--${tone} cloud-edge--${position}`}
      aria-hidden="true"
    />
  );
}
