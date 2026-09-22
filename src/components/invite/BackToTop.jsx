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
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          onClick={toTop}
          data-testid="back-to-top-button"
          aria-label="Revenir en haut"
          className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[#4A0E17] text-[#D4AF37] border hairline-gold flex items-center justify-center shadow-[0_10px_30px_rgba(42,5,11,0.4)] hover:bg-[#6B1724] hover:-translate-y-1 transition-all duration-300"
        >
          <ArrowUp size={18} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
