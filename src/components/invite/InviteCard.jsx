import { useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { EASE, WHATSAPP_NUMBER } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";

const partySize = (guest) => 1 + Number(guest?.accompagnants || 0);

const regimeLabel = (regime) => (regime || "").replace(" (préciser en message)", "");

const compactTime = (label) => label.replace(" heures ", "h").replace(" heure ", "h");

const FRAME = { w: 1000, h: 1253, margin: 18, tooth: 34, amp: 13 };

const zigzagPath = ({ w, h, margin, tooth, amp }) => {
  const left = margin;
  const top = margin;
  const right = w - margin;
  const bottom = h - margin;
  const cmds = [`M ${left} ${top}`];
  const walk = (length, at) => {
    const count = Math.max(8, Math.round(length / tooth));
    const step = length / count;
    for (let i = 0; i < count; i += 1) {
      at(i * step, (i + 0.5) * step, (i + 1) * step);
    }
  };
  walk(right - left, (a, b, c) => {
    cmds.push(`L ${left + b} ${top + amp} L ${left + c} ${top}`);
  });
  walk(bottom - top, (a, b, c) => {
    cmds.push(`L ${right - amp} ${top + b} L ${right} ${top + c}`);
  });
  walk(right - left, (a, b, c) => {
    cmds.push(`L ${right - b} ${bottom - amp} L ${right - c} ${bottom}`);
  });
  walk(bottom - top, (a, b, c) => {
    cmds.push(`L ${left + amp} ${bottom - b} L ${left} ${bottom - c}`);
  });
  cmds.push("Z");
  return cmds.join(" ");
};

const ZIGZAG = zigzagPath(FRAME);
const INNER = {
  x: FRAME.margin + FRAME.amp + 16,
  y: FRAME.margin + FRAME.amp + 16,
  w: FRAME.w - 2 * (FRAME.margin + FRAME.amp + 16),
  h: FRAME.h - 2 * (FRAME.margin + FRAME.amp + 16),
};

const ink = "[text-shadow:0_1px_0_rgba(255,255,255,0.9),0_0_16px_rgba(255,248,246,0.95)]";

export function FairePart({ guest, testId = "invite-card" }) {
  const { bride, groom, dateLabel, timeLabel, venue } = useSettings();
  const personnes = guest ? partySize(guest) : null;
  const regime = guest ? regimeLabel(guest.regime) : "";

  return (
    <article
      data-testid={testId}
      className="relative mx-auto w-full max-w-[460px] border border-[#6B1524] bg-[#F8F1EA] p-[7px] [container-type:inline-size]"
    >
      <div className="pointer-events-none absolute inset-[3px] border border-[#C4A36A]" aria-hidden="true" />
      <div className="relative border border-[#6B1524]/80">
      <img src="/img/carte-florale.jpg" alt="" className="block h-auto w-full" />

      <svg
        viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-[11%] bottom-[26%] top-[19%]"
        aria-hidden="true"
      >
        <path d={ZIGZAG} fill="rgba(255,248,246,0.46)" stroke="#6B1524" strokeWidth="2.4" />
        <rect
          x={INNER.x}
          y={INNER.y}
          width={INNER.w}
          height={INNER.h}
          fill="none"
          stroke="#C4A36A"
          strokeWidth="1.6"
        />
      </svg>

      <div className={`pointer-events-none absolute inset-x-[17%] bottom-[30%] top-[21%] flex flex-col items-center text-center text-[#3D0C16] ${ink}`}>
        <p className="mt-8 font-cinzel text-[clamp(0.62rem,2.4cqi,0.78rem)] uppercase tracking-[0.42em] text-[#6B2430]">Mariage de</p>
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-evenly">
        <div>
          <p className="font-script text-[clamp(2.7rem,13cqi,3.6rem)] leading-[0.84]">{bride}</p>
          <p className="font-script text-[clamp(1.5rem,6cqi,2rem)] leading-none text-[#8E3A48]">&</p>
          <p className="font-script text-[clamp(2.7rem,13cqi,3.6rem)] leading-[0.84]">{groom}</p>
        </div>

        {guest && (
          <div>
            <p className="font-cinzel text-[clamp(0.58rem,2.1cqi,0.72rem)] uppercase tracking-[0.32em] text-[#6B2430]">Au nom de</p>
            <p className="mt-0.5 font-script text-[clamp(1.8rem,8cqi,2.5rem)] leading-none">{guest.nom}</p>
            <p className="mt-1 font-cinzel text-[clamp(0.62rem,2.2cqi,0.78rem)] uppercase tracking-[0.12em]">
              {personnes} personne{personnes > 1 ? "s" : ""}
              {regime && regime !== "Aucun" ? ` · ${regime}` : ""}
            </p>
          </div>
        )}

        <div>
          <p data-testid="invite-card-date" className="font-display text-[clamp(1.05rem,4.2cqi,1.35rem)] font-medium leading-tight">
            {dateLabel}
          </p>
          <p className="mt-1 font-display text-[clamp(1rem,3.6cqi,1.2rem)] italic text-[#6B2430]">à {compactTime(timeLabel)}</p>
          <p className="mx-auto mt-2 max-w-[16rem] font-cinzel text-[clamp(0.68rem,2.5cqi,0.85rem)] uppercase leading-snug tracking-[0.16em]">
            {venue.name}
          </p>
        </div>
        </div>
      </div>
      </div>
    </article>
  );
}

const captureCard = async (cardTestId) => {
  const node = document.querySelector(`[data-testid="${cardTestId}"]`);
  if (!node) return null;
  return toPng(node, { pixelRatio: 2, backgroundColor: "#F8F1EA", cacheBust: true });
};

export function CardActions({ cardTestId, fileName = "carte-invitation.png", whatsappText }) {
  const [busy, setBusy] = useState("");

  const downloadCard = async () => {
    setBusy("download");
    try {
      const dataUrl = await captureCard(cardTestId);
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();
      toast.success("Carte téléchargée.");
    } catch {
      toast.error("Le téléchargement a échoué — merci de réessayer.");
    } finally {
      setBusy("");
    }
  };

  const sendCard = async () => {
    setBusy("share");
    try {
      const dataUrl = await captureCard(cardTestId);
      if (dataUrl) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text: whatsappText, title: "Carte d'invitation" });
          return;
        }
      }
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`, "_blank", "noopener,noreferrer");
    } catch (err) {
      if (err?.name === "AbortError") return;
      toast.error("L'envoi a échoué — merci de réessayer.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3" data-testid={`${cardTestId}-actions`}>
      <button
        type="button"
        data-testid={`${cardTestId}-whatsapp`}
        onClick={sendCard}
        disabled={busy !== ""}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-6 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.16em] text-[#FAF7F2] transition-colors duration-300 hover:bg-[#6B1724] disabled:opacity-60"
      >
        <MessageCircle size={15} className="text-[#D4AF37]" />
        {busy === "share" ? "Préparation…" : "Envoyer sur WhatsApp"}
      </button>
      <button
        type="button"
        data-testid={`${cardTestId}-download`}
        onClick={downloadCard}
        disabled={busy !== ""}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6B1524] bg-[#F8F1EA] px-6 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.16em] text-[#4A0E17] transition-colors duration-300 hover:border-[#C4A36A] disabled:opacity-60"
      >
        <Download size={15} className="text-[#C4A36A]" />
        {busy === "download" ? "Préparation…" : "Télécharger la carte"}
      </button>
    </div>
  );
}

export default function InviteCard() {
  return (
    <section id="faire-part" className="px-5 py-16 sm:px-8 md:py-24" data-testid="invite-card-section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-8 text-center"
      >
        <p className="font-cinzel text-[11px] tracking-[0.45em] uppercase text-[#C48B92]">Le Faire-Part</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-[#4A0E17] sm:text-5xl">L'Invitation</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EASE }}
        className="mx-auto w-full max-w-[460px]"
      >
        <FairePart />
      </motion.div>
    </section>
  );
}
