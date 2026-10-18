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
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-sm mx-auto text-center"
      >
        <p className="type-eyebrow">Un geste, un souvenir</p>
        <p className="type-script mt-3 text-[1.65rem] sm:text-5xl">Partagez l'invitation</p>

        <div className="relative mt-9 mx-auto w-fit bg-wedding-on-dark p-7 rounded-sm shadow-[0_20px_50px_rgba(74,14,23,0.12)]">
          <div className="absolute inset-2 border border-wedding-gold-accent/60 pointer-events-none" />
          <div className="absolute inset-3.5 border border-wedding-gold-accent/30 pointer-events-none" />
          <div className="relative p-2 bg-wedding-on-dark">
            <QRCodeSVG value={url} size={150} bgColor="#FAF7F2" fgColor="#8A2648" level="M" data-testid="qr-code" />
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-wedding-gold-accent/70" />
          <span className="text-wedding-gold-accent">✦</span>
          <span className="h-px w-10 bg-wedding-gold-accent/70" />
        </div>
        <p className="type-eyebrow mt-5">
          Scannez pour retrouver l'invitation
        </p>
      </motion.div>
    </section>
  );
}
