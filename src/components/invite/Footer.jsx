import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings";
import { usePhoto } from "@/lib/photos";
import { IMAGES, EASE } from "@/lib/invite-data";

export default function Footer() {
  const { bride, groom, dateLabel } = useSettings();
  const portrait = usePhoto("portrait", IMAGES.portrait);
  return (
    <footer
      className="relative pt-28 pb-20 px-6 text-center bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)]"
      data-testid="footer"
    >
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto mb-10 w-fit"
          data-testid="footer-cadre"
        >
          <div className="relative bg-[#FAF7F2] p-2.5 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-1.5 border border-[#D4AF37]/60 pointer-events-none z-10" />
            <img src={portrait} alt={`${bride} et ${groom}`} className="w-52 sm:w-64 aspect-[4/5] object-cover rounded-sm" />
          </div>
          <p className="mt-3 font-script text-2xl text-[#C48B92]">les futurs mariés</p>
        </motion.div>
        <p className="font-script text-5xl sm:text-6xl text-[#D4AF37]">
          {bride} & {groom}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-14 bg-[#D4AF37]/50" />
          <span className="text-[#D4AF37]">✦</span>
          <span className="h-px w-14 bg-[#D4AF37]/50" />
        </div>
        <p className="mt-6 font-cinzel text-[11px] tracking-[0.4em] uppercase text-[#C48B92]">{dateLabel}</p>
        <p className="mt-10 text-xs text-[#FAF7F2]/40">Fait avec amour — nous avons hâte de célébrer avec vous.</p>
        <Link
          to="/reponses"
          data-testid="footer-espace-maries"
          className="mt-6 inline-block font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C48B92]/60 hover:text-[#D4AF37] transition-colors"
        >
          Espace mariés
        </Link>
      </div>
    </footer>
  );
}
