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
      {/* Vagues & orbes de soie organiques en mouvement */}
      <div className="fluid-silk-blob fluid-silk-blob--rose" />
      <div className="fluid-silk-blob fluid-silk-blob--champagne" />
      <div className="fluid-silk-blob fluid-silk-blob--pearl" />
      <div className="fluid-silk-blob fluid-silk-blob--berry" />

      {/* Voiles de soie ondulants vectoriels */}
      <svg
        className="fluid-silk-svg-ribbons"
        viewBox="0 0 1600 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="silk-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9D7E5" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FDEBCB" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#F6C3D8" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="silk-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2DC" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#F4BFD6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FAF0F4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="silk-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ECC2D5" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#FFE7BD" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C43673" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Vague soyeuse haute */}
        <path
          className="silk-ribbon silk-ribbon--1"
          d="M-200,280 C250,140 600,420 1050,230 C1380,100 1650,340 1900,210 L1900,1100 L-200,1100 Z"
          fill="url(#silk-grad-1)"
        />

        {/* Vague soyeuse médiane */}
        <path
          className="silk-ribbon silk-ribbon--2"
          d="M-200,490 C280,620 720,310 1150,540 C1450,680 1680,410 1900,510 L1900,1100 L-200,1100 Z"
          fill="url(#silk-grad-2)"
        />

        {/* Vague soyeuse basse */}
        <path
          className="silk-ribbon silk-ribbon--3"
          d="M-200,720 C320,610 680,820 1120,680 C1460,560 1700,780 1900,690 L1900,1100 L-200,1100 Z"
          fill="url(#silk-grad-3)"
        />
      </svg>

      {/* Voile de lissage subtil */}
      <div className="fluid-silk-sheen" />
    </div>
  );
}
