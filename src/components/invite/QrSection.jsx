import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Share2, Smartphone, Navigation } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";

const downloadQr = (canvasId, name) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = name;
  a.click();
  toast.success("QR code téléchargé.");
};

const QrCard = ({ icon: Icon, title, text, canvasId, value, testId }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, ease: EASE }}
    className="flex-1 bg-white border hairline rounded-sm shadow-[0_20px_60px_rgba(74,14,23,0.08)] p-8 sm:p-10 text-center"
    data-testid={`${testId}-card`}
  >
    <span className="mx-auto w-12 h-12 rounded-full bg-[#F7E8E9] flex items-center justify-center">
      <Icon size={20} className="text-[#6B1724]" strokeWidth={1.5} />
    </span>
    <h3 className="mt-5 font-display text-2xl text-[#4A0E17]">{title}</h3>
    <p className="mt-2 text-sm text-[#8C7B7E] leading-relaxed">{text}</p>
    <div className="mt-6 inline-block p-4 border hairline-gold rounded-sm bg-[#FAF7F2]">
      <QRCodeCanvas id={canvasId} value={value} size={180} bgColor="#FAF7F2" fgColor="#4A0E17" level="M" includeMargin={false} />
    </div>
    <div>
      <button
        data-testid={`${testId}-download-button`}
        onClick={() => downloadQr(canvasId, `${testId}.png`)}
        className="mt-6 inline-flex items-center gap-2 rounded-full border hairline text-[#4A0E17] font-cinzel text-[11px] tracking-[0.2em] uppercase px-6 py-3 hover:border-[#D4AF37] hover:bg-[#FAF7F2] transition-all duration-300"
      >
        <Download size={14} /> Télécharger
      </button>
    </div>
  </motion.div>
);

export default function QrSection() {
  const { venue } = useSettings();
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://example.com";

  const share = async () => {
    await navigator.clipboard.writeText(siteUrl);
    toast.success("Lien de l'invitation copié — partagez-le à vos proches.");
  };

  return (
    <section id="qr" className="py-24 md:py-36 px-5 sm:px-8 lg:px-16" data-testid="qr-section">
      <div className="max-w-4xl mx-auto">
        <Chapter index="IX" eyebrow="À partager" title="Les Cartes QR" script="scannez, c'est offert" />
        <div className="flex flex-col md:flex-row gap-8">
          <QrCard
            icon={Smartphone}
            title="L'Invitation Web"
            text="Scannez pour ouvrir l'invitation sur n'importe quel smartphone — idéale à glisser dans vos faire-part papier."
            canvasId="qr-site-canvas"
            value={siteUrl}
            testId="qr-site"
          />
          <QrCard
            icon={Navigation}
            title="L'Itinéraire GPS"
            text={`Scannez le jour J : Google Maps s'ouvre directement avec le guidage vers ${venue.name}.`}
            canvasId="qr-map-canvas"
            value={venue.mapsUrl}
            testId="qr-map"
          />
        </div>
        <div className="mt-10 text-center">
          <button
            data-testid="share-link-button"
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-[#6B1724] transition-all duration-300"
          >
            <Share2 size={15} /> Copier le lien de l'invitation
          </button>
        </div>
      </div>
    </section>
  );
}
