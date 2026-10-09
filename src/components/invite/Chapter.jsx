import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";

export default function Chapter({ index, eyebrow, title, script, dark = false }) {
  const ink = dark ? "text-[#FFFBFC]" : "text-[#2A050B]";
  const sub = dark ? "text-[#FFD6E0]" : "text-[#7A1538]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="text-center mb-14 md:mb-20"
    >
      <p className={`font-cinzel text-[11px] tracking-[0.45em] uppercase ${sub}`} data-testid={`chapter-${index}-eyebrow`}>
        Chapitre {index} — {eyebrow}
      </p>
      <h2 className={`mt-4 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight ${ink}`}>{title}</h2>
      {script && (
        <p className={`mt-3 font-display text-xl italic sm:text-2xl ${dark ? "text-[#FFD6E0]/95" : "text-[#6B2440]"}`}>
          {script}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0.6, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mt-6 flex items-center justify-center gap-3"
      >
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#ED1E79]/55" />
        <span className="font-cinzel text-[10px] tracking-[0.35em] text-[#ED1E79]">◆</span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#ED1E79]/55" />
      </motion.div>
    </motion.div>
  );
}
