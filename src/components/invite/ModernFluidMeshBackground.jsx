/**
 * Arrière-plan moderne "Vagues Soyeuses & Mesh Gradient Fluide"
 * - Ondulation lente et fluide de vagues de soie (ambiance haute couture épurée)
 * - Mesh gradient organique à déformations douces (rose poudré, champagne nacré, ivoire satin)
 * - Zéro particule/étoile : pure élégance contemporaine, 60fps GPU
 */
export default function ModernFluidMeshBackground({ active = true }) {
  if (!active) return null;

  return (
    <div
      className="fluid-silk-mesh-root pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Orbes de soie et mesh gradient fluide subtil */}
      <div className="fluid-silk-blob fluid-silk-blob--rose" />
      <div className="fluid-silk-blob fluid-silk-blob--champagne" />
      <div className="fluid-silk-blob fluid-silk-blob--pearl" />
      <div className="fluid-silk-blob fluid-silk-blob--berry" />

      {/* Voile de lissage satiné */}
      <div className="fluid-silk-sheen" />
    </div>
  );
}
