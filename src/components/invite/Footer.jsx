import { motion } from "framer-motion";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import { EASE, IMAGES } from "@/lib/invite-data";
import { usePhoto } from "@/lib/photos";

export default function Footer() {
  const { bride, groom, dateLabel } = useSettings();
  const { m } = useI18n();
  const footerPhoto = usePhoto("footer", IMAGES.footerPhoto);
  return (
    <footer
      className="relative pt-28 pb-20 px-6 text-center bg-[linear-gradient(160deg,#5C0A20_0%,#9B1B4A_55%,#7A1538_100%)]"
      data-testid="footer"
    >
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mx-auto mb-10 w-fit"
          data-testid="footer-cadre"
        >
          <div className="relative rounded-sm bg-[#FAF7F2] p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-1.5 z-10 rounded-sm border border-[#C0C0C0]/50" />
            <img
              src={footerPhoto}
              alt={m.footer.photoAlt}
              className="aspect-[4/5] w-52 rounded-sm object-cover sm:w-64"
            />
          </div>
          <p className="mt-3 font-script text-2xl text-[#C48B92]">{m.footer.love}</p>
        </motion.div>
        <p className="font-script text-5xl sm:text-6xl text-[#D4AF37]">
          {bride} & {groom}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#C0C0C0]/60" />
          <span className="text-[#D4AF37]">✦</span>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#C0C0C0]/60" />
        </div>
        <p className="mt-6 font-cinzel text-[11px] tracking-[0.4em] uppercase text-[#C48B92]">{dateLabel}</p>
        <p className="mt-10 text-xs text-[#FAF7F2]/40">{m.footer.thanks}</p>
      </div>
    </footer>
  );
}
