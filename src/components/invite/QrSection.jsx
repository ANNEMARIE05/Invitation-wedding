import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { EASE } from "@/lib/invite-data";

export default function QrSection() {
  const url = typeof window !== "undefined" ? window.location.origin : "https://mariage.example.com";

  return (
    <section id="partage" className="relative py-20 md:py-24 px-5 bg-[#F3ECE2] overflow-hidden" data-testid="qr-section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-sm mx-auto text-center"
      >
        <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#C48B92]">Un geste, un souvenir</p>
        <p className="mt-3 font-script text-4xl sm:text-5xl text-[#4A0E17]">Partagez l'invitation</p>

        <div className="relative mt-9 mx-auto w-fit bg-[#FAF7F2] p-7 rounded-sm shadow-[0_20px_50px_rgba(74,14,23,0.12)]">
          <div className="absolute inset-2 border border-[#D4AF37]/60 pointer-events-none" />
          <div className="absolute inset-3.5 border border-[#D4AF37]/30 pointer-events-none" />
          <div className="relative p-2 bg-[#FAF7F2]">
            <QRCodeSVG value={url} size={150} bgColor="#FAF7F2" fgColor="#4A0E17" level="M" data-testid="qr-code" />
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#D4AF37]/70" />
          <span className="text-[#D4AF37]">✦</span>
          <span className="h-px w-10 bg-[#D4AF37]/70" />
        </div>
        <p className="mt-5 font-cinzel text-[10px] tracking-[0.35em] uppercase text-[#8C7B7E]">
          Scannez pour retrouver l'invitation
        </p>
      </motion.div>
    </section>
  );
}
