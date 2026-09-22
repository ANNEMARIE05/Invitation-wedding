import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE, GALLERY } from "@/lib/invite-data";
import { PhotosContext, fileUrl } from "@/lib/photos";
import Chapter from "./Chapter";
import CloudEdge from "./CloudEdge";

const spanClass = {
  tall: "md:row-span-2 max-md:aspect-[3/4]",
  wide: "md:col-span-2 max-md:aspect-[16/10]",
  square: "max-md:aspect-[4/5]",
};

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const photos = useContext(PhotosContext);
  const items = GALLERY.map((g, i) => ({
    ...g,
    src: photos[`gallery-${i}`] ? fileUrl(photos[`gallery-${i}`]) : g.src,
  }));

  return (
    <section id="galerie" className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 bg-[#F3ECE2]" data-testid="gallery-section">
      <CloudEdge tone="sand" position="top" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <Chapter index="V" eyebrow="Souvenirs" title="Galerie" script="nos plus beaux instants" />
        <div
          className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[200px] gap-3 sm:gap-4"
          data-testid="gallery-grid"
        >
          {items.map((g, i) => (
            <motion.button
              key={g.src + i}
              type="button"
              data-testid={`gallery-item-${i}`}
              onClick={() => setSelected(i)}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: EASE }}
              className={`group relative overflow-hidden clipped-frame ${spanClass[g.span]}`}
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A050B]/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <p className="absolute bottom-4 left-4 right-4 font-script text-2xl text-[#D4AF37] text-left opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                {g.caption}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#2A050B]/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
            data-testid="gallery-lightbox"
          >
            <button
              data-testid="lightbox-close-button"
              className="absolute top-6 right-6 text-[#FAF7F2]/80 hover:text-[#D4AF37] transition-colors"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              <X size={30} strokeWidth={1.2} />
            </button>
            <button
              data-testid="lightbox-prev-button"
              className="absolute left-4 sm:left-8 text-[#FAF7F2]/70 hover:text-[#D4AF37] transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + items.length) % items.length); }}
              aria-label="Précédent"
            >
              <ChevronLeft size={36} strokeWidth={1.2} />
            </button>
            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              src={items[selected].src}
              alt={items[selected].caption}
              className="max-h-[80vh] max-w-full object-contain outline outline-1 outline-[#D4AF37]/50 outline-offset-8"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              data-testid="lightbox-next-button"
              className="absolute right-4 sm:right-8 text-[#FAF7F2]/70 hover:text-[#D4AF37] transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % items.length); }}
              aria-label="Suivant"
            >
              <ChevronRight size={36} strokeWidth={1.2} />
            </button>
            <p className="absolute bottom-8 inset-x-0 text-center font-script text-3xl text-[#D4AF37]">
              {items[selected].caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
