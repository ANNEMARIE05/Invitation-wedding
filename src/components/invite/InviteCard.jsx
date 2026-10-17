import { useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { ensureInviteCardFontsReady } from "@/lib/invite-card-capture";
import { buildInviteCardShareText, deliverInviteCardOnWhatsApp } from "@/lib/invite-card-share";
import { EASE } from "@/lib/invite-data";
import { REVEAL_VIEWPORT } from "@/lib/motion-viewport";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import SparkleField from "./SparkleField";

/** Faire-part affiché sur le site (visuel complet, sans personnalisation). */
const SHOWCASE_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-showcase.jpg?v=20261017-florale`;

function ShowcaseCardArt({ className = "faire-part-bg" }) {
  return (
    <img
      src={SHOWCASE_CARD_BG}
      alt=""
      className={className}
      aria-hidden
      decoding="async"
      draggable={false}
    />
  );
}

/** @param {{ testId?: string }} props */
export function FairePart({ testId = "invite-card" }) {
  const settings = useSettings();
  const { m } = useI18n();
  const ariaLabel = `${m.inviteSection.title} — ${settings.groom} & ${settings.bride}, ${settings.dateLabel}`;

  const articleCls =
    "invite-card-article relative mx-auto w-full max-w-[min(100%,20rem)] overflow-visible [container-type:inline-size] sm:max-w-[24rem] md:max-w-[26rem]";

  return (
    <article data-testid={testId} className={articleCls} aria-label={ariaLabel}>
      <motion.div
        initial={{ rotateX: 10, y: 32, opacity: 0 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
        whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 1.1, ease: EASE }}
        className="faire-part-stage"
      >
        <div className="faire-part-aura" aria-hidden="true" />
        <div className="faire-part-stack faire-part-stack--template">
          <div className="faire-part-gold-ring" aria-hidden="true">
            <span className="faire-part-gold-point faire-part-gold-point--tl" />
            <span className="faire-part-gold-point faire-part-gold-point--tr" />
            <span className="faire-part-gold-point faire-part-gold-point--bl" />
            <span className="faire-part-gold-point faire-part-gold-point--br" />
          </div>
          <div className="faire-part-shell">
            <ShowcaseCardArt />
          </div>
        </div>
      </motion.div>
    </article>
  );
}

export const captureCard = async (cardTestId) => {
  const node = document.querySelector(`[data-testid="${cardTestId}"]`);
  if (!node) return null;
  const target =
    node.querySelector(".personal-invite-shell") || node.querySelector(".faire-part-shell") || node;
  target.classList.add("faire-part-shell--capture");
  try {
    if (target.classList.contains("personal-invite-shell")) {
      await ensureInviteCardFontsReady();
    }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 80));
    const bg = "#FDF8F0";
    return await toPng(target, { pixelRatio: 2, backgroundColor: bg, cacheBust: true });
  } finally {
    target.classList.remove("faire-part-shell--capture");
  }
};

export function CardActions({
  cardTestId,
  fileName = "carte-invitation.png",
  className = "",
  guest = null,
  showWhatsApp = true,
}) {
  const { m } = useI18n();
  const settings = useSettings();
  const [busy, setBusy] = useState(false);
  const [busyWa, setBusyWa] = useState(false);

  const downloadCard = async () => {
    setBusy(true);
    try {
      const dataUrl = await captureCard(cardTestId);
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(m.inviteSection.downloadOk);
    } catch {
      toast.error(m.inviteSection.downloadErr);
    } finally {
      setBusy(false);
    }
  };

  const shareWhatsApp = async () => {
    setBusyWa(true);
    try {
      const firstName = guest?.nom ? String(guest.nom).trim().split(/\s+/)[0] : "";
      const shareText = buildInviteCardShareText(m, firstName, settings.dateLabel);
      const result = await deliverInviteCardOnWhatsApp({
        captureCard,
        cardTestId,
        fileName,
        shareText,
        telephone: guest?.telephone || "",
      });
      if (result.ok && result.method === "native_share") {
        toast.success(m.inviteSection.shareWhatsAppOk);
      } else if (result.ok) {
        toast.success(m.inviteSection.downloadOk);
      } else {
        toast.error(m.inviteSection.shareWhatsAppErr);
      }
    } catch {
      toast.error(m.inviteSection.shareWhatsAppErr);
    } finally {
      setBusyWa(false);
    }
  };

  return (
    <div
      className={`mt-6 flex flex-wrap items-center justify-center gap-3 ${className}`.trim()}
      data-testid={`${cardTestId}-actions`}
    >
      {showWhatsApp ? (
        <button
          type="button"
          data-testid={`${cardTestId}-share-whatsapp`}
          onClick={shareWhatsApp}
          disabled={busy || busyWa}
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#25D366]/40 bg-[#25D366]/15 px-6 py-3.5 font-cinzel text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0d5925] backdrop-blur-sm transition-all duration-300 hover:border-[#25D366]/70 hover:bg-[#25D366]/25 disabled:opacity-60"
        >
          <MessageCircle size={16} className="text-[#25D366]" />
          {busyWa ? m.inviteSection.shareWhatsAppBusy : m.inviteSection.shareWhatsApp}
        </button>
      ) : null}
      <button
        type="button"
        data-testid={`${cardTestId}-download`}
        onClick={downloadCard}
        disabled={busy || busyWa}
        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-wedding-rose/30 bg-white/90 px-6 py-3.5 font-cinzel text-[11px] font-semibold uppercase tracking-[0.16em] text-wedding-wine-deep backdrop-blur-sm transition-all duration-300 hover:border-wedding-rose/55 hover:bg-[#FFF5F8] disabled:opacity-60"
      >
        <Download size={15} className="text-wedding-rose" />
        {busy ? m.inviteSection.downloadBusy : m.inviteSection.download}
      </button>
    </div>
  );
}

export default function InviteCard() {
  const { m } = useI18n();
  return (
    <section id="faire-part" className="relative overflow-x-visible overflow-y-visible px-[clamp(1.15rem,5.2vw,1.75rem)] py-16 sm:px-10 md:py-24" data-testid="invite-card-section">
      <SparkleField count={14} className="opacity-70" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-[1] mb-10 text-center"
      >
        <p className="type-eyebrow text-wedding-rose">{m.inviteSection.eyebrow}</p>
        <h2 className="type-display mt-3 text-4xl sm:text-5xl">{m.inviteSection.title}</h2>
        {m.inviteSection.script ? (
          <p className="type-display-script mt-3 text-xl">{m.inviteSection.script}</p>
        ) : null}
      </motion.div>

      <div className="invite-card-showcase relative z-[1] mx-auto w-full max-w-[min(100%,20rem)] overflow-visible sm:max-w-[24rem] md:max-w-[26rem]">
        <FairePart />
      </div>
    </section>
  );
}
