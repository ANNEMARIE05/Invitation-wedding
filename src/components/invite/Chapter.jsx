import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";

export default function Chapter({ index, eyebrow, title, script, dark = false }) {
  const ink = dark ? "text-[#FAF7F2]" : "text-[#4A0E17]";
  const sub = dark ? "text-[#D4AF37]" : "text-[#C48B92]";
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
      {script && <p className="mt-3 font-script text-3xl text-[#D4AF37]">{script}</p>}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-[#D4AF37]/60" />
        <span className="text-[#D4AF37]">✦</span>
        <span className="h-px w-12 bg-[#D4AF37]/60" />
      </div>
    </motion.div>
  );
}
