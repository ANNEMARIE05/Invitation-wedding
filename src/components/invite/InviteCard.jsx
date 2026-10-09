import { useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { messages } from "@/lib/translations";
import { useSettings } from "@/lib/settings";
import SparkleField from "./SparkleField";

const FAIRE_PART_BG = `${process.env.PUBLIC_URL || ""}/images/faire-part-bg.jpg`;

const partySize = (guest) => 1 + Number(guest?.accompagnants || 0);

const regimeLabel = (regime) => (regime || "").replace(" (préciser en message)", "");

const compactTime = (label) => label.replace(" heures ", "h").replace(" heure ", "h");

function FairePartBody({ guest, dateLabel, timeLabel, venue, bride, groom, m }) {
  const noneRegime = messages.fr.rsvp.regimes[0];
  const personnes = guest ? partySize(guest) : null;
  const regime = guest ? regimeLabel(guest.regime) : "";

  return (
    <div className="faire-part-body text-center">
      <p className="relative font-cinzel text-[clamp(0.52rem,2.1cqi,0.68rem)] font-bold uppercase tracking-[0.32em] text-[#B8326A]">
        {m.inviteSection.placeLine}
      </p>
      <p className="relative mt-0.5 font-cinzel text-[clamp(0.5rem,1.9cqi,0.64rem)] font-semibold uppercase tracking-[0.22em] text-[#5C0A20]/90">
        {m.inviteSection.honor}
      </p>

      <div className="relative mx-auto mt-[clamp(0.75rem,4cqi,1.25rem)] max-w-[88%] border-y border-[#C9A962]/50 py-[clamp(0.5rem,2.5cqi,0.85rem)]">
        <p className="font-display text-[clamp(2.45rem,11cqi,3.25rem)] font-semibold italic leading-[0.9] text-[#2A050B] drop-shadow-sm">
          {bride}
        </p>
        <p className="my-2 font-cinzel text-[clamp(0.75rem,2.8cqi,0.9rem)] tracking-[0.65em] text-[#ED1E79]">&</p>
        <p className="font-display text-[clamp(2.45rem,11cqi,3.25rem)] font-semibold italic leading-[0.9] text-[#2A050B] drop-shadow-sm">
          {groom}
        </p>
      </div>

      <div className="relative mx-auto mt-[clamp(0.5rem,3cqi,0.85rem)] inline-flex rounded-full bg-white/55 px-4 py-1.5 ring-1 ring-[#C9A962]/35 backdrop-blur-[1px]">
        <p className="font-cinzel text-[clamp(0.58rem,2.1cqi,0.72rem)] font-bold uppercase tracking-[0.22em] text-[#5C0A20]">
          {m.inviteSection.toWedding}
        </p>
      </div>

      {guest && (
        <div className="relative z-[1] mx-auto mt-[clamp(0.5rem,3.5cqi,1rem)] w-full max-w-[97%] rounded-lg border border-[#C9A962]/45 bg-white/75 px-[clamp(0.65rem,3.2cqi,1.1rem)] py-[clamp(0.55rem,2.8cqi,0.85rem)] shadow-[0_8px_24px_rgba(92,10,32,0.08)] backdrop-blur-[2px]">
          <p className="font-cinzel text-[clamp(0.52rem,1.9cqi,0.65rem)] font-bold uppercase tracking-[0.24em] text-[#9B1B4A]">
            {m.inviteSection.reserved}
          </p>
          <p className="mt-1 px-0.5 font-display text-[clamp(1.35rem,5.6cqi,1.9rem)] font-medium italic leading-[1.12] text-[#2A050B]">
            {guest.nom}
          </p>
          <p className="mt-1 font-cinzel text-[clamp(0.55rem,2cqi,0.68rem)] font-semibold uppercase tracking-[0.06em] text-[#6B2440]">
            {personnes} {personnes > 1 ? m.inviteSection.persons : m.inviteSection.person}
            {regime && regime !== noneRegime ? ` · ${regime}` : ""}
          </p>
        </div>
      )}

      <div className="relative z-[1] mx-auto mt-[clamp(0.5rem,3.5cqi,1rem)] w-full max-w-[92%] space-y-0.5 rounded-lg bg-white/50 px-3 py-3 backdrop-blur-[2px] ring-1 ring-[#C9A962]/25">
        <p
          data-testid="invite-card-date"
          className="font-display text-[clamp(1.08rem,4.2cqi,1.35rem)] font-bold capitalize leading-snug text-[#2A050B]"
        >
          {dateLabel}
        </p>
        <p className="font-display text-[clamp(1rem,3.8cqi,1.22rem)] font-semibold italic text-[#ED1E79]">
          {m.inviteSection.at} {compactTime(timeLabel)}
        </p>
        <p className="mx-auto mt-2 max-w-[17rem] font-cinzel text-[clamp(0.62rem,2.2cqi,0.76rem)] font-bold uppercase leading-snug tracking-[0.08em] text-[#5C0A20]">
          {venue.name}
        </p>
      </div>

      <p className="relative z-[1] mt-[clamp(0.45rem,3cqi,0.85rem)] font-display text-[clamp(1rem,3.8cqi,1.3rem)] font-medium italic text-[#7A1538]">
        {m.inviteSection.joy}
      </p>
    </div>
  );
}

function FairePartShell({ guest, settings, m }) {
  const { bride, groom, dateLabel, timeLabel, venue } = settings;
  return (
    <div className="faire-part-shell faire-part-shell--flat">
      <img
        src={FAIRE_PART_BG}
        alt=""
        className="faire-part-bg"
        aria-hidden
        decoding="async"
        draggable={false}
      />
      <FairePartBody guest={guest} dateLabel={dateLabel} timeLabel={timeLabel} venue={venue} bride={bride} groom={groom} m={m} />
    </div>
  );
}

/** @param {{ guest?: object, testId?: string, variant?: "showcase" | "flat" }} props */
export function FairePart({ guest, testId = "invite-card", variant = "showcase" }) {
  const settings = useSettings();
  const { m } = useI18n();

  const articleCls =
    "relative mx-auto w-full max-w-[min(100%,480px)] overflow-visible [container-type:inline-size] sm:max-w-[520px]";

  if (variant === "flat") {
    return (
      <article data-testid={testId} className={articleCls}>
        <FairePartShell guest={guest} settings={settings} m={m} />
      </article>
    );
  }

  return (
    <article data-testid={testId} className={articleCls}>
      <motion.div
        initial={{ rotateX: 10, y: 32, opacity: 0 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
        whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE }}
        className="faire-part-stage"
      >
        <div className="faire-part-aura" aria-hidden="true" />
        <div className="faire-part-stack">
          <div className="faire-part-gold-ring" aria-hidden="true">
            <span className="faire-part-gold-point faire-part-gold-point--tl" />
            <span className="faire-part-gold-point faire-part-gold-point--tr" />
            <span className="faire-part-gold-point faire-part-gold-point--bl" />
            <span className="faire-part-gold-point faire-part-gold-point--br" />
          </div>
          <div className="faire-part-shell">
            <img
              src={FAIRE_PART_BG}
              alt=""
              className="faire-part-bg"
              aria-hidden
              decoding="async"
              draggable={false}
            />
            <FairePartBody
              guest={guest}
              dateLabel={settings.dateLabel}
              timeLabel={settings.timeLabel}
              venue={settings.venue}
              bride={settings.bride}
              groom={settings.groom}
              m={m}
            />
          </div>
        </div>
      </motion.div>
    </article>
  );
}

const captureCard = async (cardTestId) => {
  const node = document.querySelector(`[data-testid="${cardTestId}"]`);
  if (!node) return null;
  const target = node.querySelector(".faire-part-shell") || node;
  return toPng(target, { pixelRatio: 2, backgroundColor: "#FFF9F5", cacheBust: true });
};

export function CardActions({ cardTestId, fileName = "carte-invitation.png", className = "" }) {
  const { m } = useI18n();
  const [busy, setBusy] = useState(false);

  const downloadCard = async () => {
    setBusy(true);
    try {
      const dataUrl = await captureCard(cardTestId);
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();
      toast.success(m.inviteSection.downloadOk);
    } catch {
      toast.error(m.inviteSection.downloadErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`mt-6 flex flex-wrap items-center justify-center gap-3 ${className}`.trim()}
      data-testid={`${cardTestId}-actions`}
    >
      <button
        type="button"
        data-testid={`${cardTestId}-download`}
        onClick={downloadCard}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#ED1E79]/30 bg-white/90 px-6 py-3.5 font-cinzel text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5C0A20] backdrop-blur-sm transition-all duration-300 hover:border-[#ED1E79]/55 hover:bg-[#FFF5F8] disabled:opacity-60"
      >
        <Download size={15} className="text-[#ED1E79]" />
        {busy ? m.inviteSection.downloadBusy : m.inviteSection.download}
      </button>
    </div>
  );
}

export default function InviteCard() {
  const { m } = useI18n();
  return (
    <section id="faire-part" className="relative overflow-x-clip overflow-y-visible px-5 py-16 sm:px-8 md:py-24" data-testid="invite-card-section">
      <SparkleField count={14} className="opacity-70" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-[1] mb-10 text-center"
      >
        <p className="font-cinzel text-[11px] font-semibold tracking-[0.45em] uppercase text-[#ED1E79]">{m.inviteSection.eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#2A050B] sm:text-5xl">{m.inviteSection.title}</h2>
        <p className="mt-3 font-display text-xl italic text-[#7A1538]">{m.inviteSection.script}</p>
      </motion.div>

      <div className="relative z-[1] mx-auto w-full max-w-[min(100%,480px)] overflow-visible sm:max-w-[520px]">
        <FairePart />
      </div>
    </section>
  );
}
