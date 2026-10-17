import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 600));

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          whileTap={{ opacity: 0.88 }}
          onClick={toTop}
          data-testid="back-to-top-button"
          aria-label="Revenir en haut"
          className="back-to-top-btn fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-wedding-wine-deep text-wedding-gold-accent shadow-[0_10px_30px_rgba(42,5,11,0.4)] hover:bg-[#6B1724]"
        >
          <span className="back-to-top-btn__ring" aria-hidden="true" />
          <span className="back-to-top-btn__ring back-to-top-btn__ring--trace" aria-hidden="true" />
          <ArrowUp size={18} strokeWidth={1.8} className="relative z-[1]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
