import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Hauteur de la barre fixe (alignée sur scrollToId). */
const NAV_OFFSET = 72;

/**
 * Section de menu « active » au scroll (Lenis ou natif) et au clic pendant l’animation.
 * @param {string[]} sectionIds ids sans # (ex. versets, programme)
 */
export function useNavActive(sectionIds) {
  const [activeHref, setActiveHref] = useState(null);
  const pendingHrefRef = useRef(null);
  const updateRef = useRef(() => {});
  const sectionsKey = useMemo(() => sectionIds.join("|"), [sectionIds]);

  useEffect(() => {
    const computeActive = () => {
      const line = NAV_OFFSET + 40;
      let current = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      return current ? `#${current}` : null;
    };

    const update = () => {
      if (pendingHrefRef.current) return;
      setActiveHref(computeActive());
    };

    updateRef.current = () => setActiveHref(computeActive());

    update();
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", update);
      return () => lenis.off("scroll", update);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [sectionsKey, sectionIds]);

  const activateOnNavigate = useCallback((href) => {
    setActiveHref(href || null);
    pendingHrefRef.current = href || null;
    window.setTimeout(() => {
      pendingHrefRef.current = null;
      updateRef.current();
    }, 1700);
  }, []);

  return [activeHref, activateOnNavigate];
}
