import { motion, useMotionValue, useSpring } from "framer-motion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import { FlowerCorner } from "./Flowers";

const cardCorners = [
  "top-6 left-6",
  "top-6 right-6 -scale-x-100",
  "bottom-6 left-6 -scale-y-100",
  "bottom-6 right-6 -scale-100",
];

export default function InviteCard() {
  const { bride, groom, initials, dateLabel, timeLabel, deadlineLabel, venue } = useSettings();
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const downloadCard = async () => {
    const node = document.querySelector('[data-testid="invite-card"]');
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#FAF7F2" });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "faire-part-eleonore-augustin.png";
      a.click();
      toast.success("Faire-part téléchargé en image — prêt à être envoyé sur WhatsApp.");
    } catch {
      toast.error("Le téléchargement a échoué — merci de réessayer.");
    }
  };

  return (
    <section id="faire-part" className="py-24 md:py-36 px-5 sm:px-8" data-testid="invite-card-section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="text-center mb-14"
      >
        <p className="font-cinzel text-[11px] tracking-[0.45em] uppercase text-[#C48B92]">Le Faire-Part</p>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#4A0E17]">L'Invitation</h2>
      </motion.div>

      <div style={{ perspective: 1200 }} className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: EASE }}
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="relative bg-[#FAF7F2] shadow-[0_40px_100px_rgba(74,14,23,0.18)]"
          data-testid="invite-card"
        >
          <div className="absolute inset-3 border border-[#D4AF37]/60 pointer-events-none" />
          <div className="absolute inset-5 border border-[#D4AF37]/30 pointer-events-none" />
          {cardCorners.map((pos) => (
            <span key={pos} className={`absolute ${pos} pointer-events-none opacity-80`}>
              <FlowerCorner className="w-14 h-14 sm:w-16 sm:h-16 animate-sway" />
            </span>
          ))}
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[#D4AF37] text-xs">✦</span>
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[#D4AF37] text-xs">✦</span>

          <div className="relative px-8 py-14 sm:px-16 sm:py-16 text-center">
            <p className="font-display italic text-3xl text-[#D4AF37]">{initials}</p>
            <p className="mt-6 font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#8C7B7E]">
              Avec la bénédiction de leurs familles
            </p>

            <h3 className="mt-8 font-script text-6xl sm:text-7xl text-[#4A0E17] leading-tight">
              {bride}
              <span className="block text-4xl text-[#C48B92] my-1">&</span>
              {groom}
            </h3>

            <p className="mt-8 font-display italic text-lg sm:text-xl text-[#5C4F51] leading-relaxed">
              ont la joie de vous convier à la célébration
              <br />
              de leur mariage
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-[#D4AF37]/60" />
              <span className="text-[#D4AF37]">✦</span>
              <span className="h-px w-14 bg-[#D4AF37]/60" />
            </div>

            <p className="mt-6 font-cinzel text-sm sm:text-base tracking-[0.3em] uppercase text-[#4A0E17]" data-testid="invite-card-date">
              {dateLabel}
            </p>
            <p className="mt-2 font-display italic text-xl text-[#D4AF37] lining-nums tabular-nums">à {timeLabel}</p>
            <p className="mt-5 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#8C7B7E]">
              {venue.name}
            </p>

            <p className="mt-10 text-[10px] font-cinzel tracking-[0.2em] uppercase text-[#C48B92]">
              Réponse souhaitée {deadlineLabel}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mt-10 flex flex-wrap justify-center gap-4"
          data-testid="invite-card-actions"
        >
          <button
            data-testid="invite-card-download-button"
            onClick={downloadCard}
            className="inline-flex items-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-[#6B1724] hover:shadow-[0_10px_30px_rgba(74,14,23,0.3)] transition-all duration-300"
          >
            <Download size={15} /> Télécharger la carte
          </button>
        </motion.div>
      </div>
    </section>
  );
}
