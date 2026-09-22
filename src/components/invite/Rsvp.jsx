import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { createRsvp } from "@/lib/api";
import { EASE, WHATSAPP_NUMBER } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import { CardActions, FairePart } from "./InviteCard";

const REGIMES = ["Aucun", "Végétarien", "Sans gluten", "Allergies (préciser en message)"];

const partySize = (d) => (d.present ? 1 + Number(d.accompagnants || 0) : 0);

const waMessage = (d) =>
  [
    "Confirmation de présence — Mariage",
    `Nom : ${d.nom}`,
    `WhatsApp : ${d.telephone}`,
    `Présence : ${d.present ? "Oui, je serai là" : "Non, je ne pourrai pas venir"}`,
    `Nombre de personnes : ${partySize(d)}`,
    `Régime : ${d.regime}`,
    d.chanson ? `Chanson : ${d.chanson}` : "",
    d.message ? `Message : ${d.message}` : "",
  ].filter(Boolean).join("\n");

const initial = { nom: "", telephone: "", present: true, accompagnants: 0, regime: "Aucun", chanson: "", message: "" };

const fieldCls = "w-full bg-white border border-[#6B1724]/15 rounded-2xl px-3.5 py-2.5 text-sm text-[#1C1617] placeholder:text-[#8C7B7E] transition-all duration-300";
const labelCls = "block font-cinzel text-[10px] tracking-[0.22em] uppercase text-[#6B1724] mb-1.5";

const Frame = ({ children }) => (
  <div className="relative rounded-3xl bg-[#FAF7F2] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
    <div className="pointer-events-none absolute inset-2.5 rounded-[1.35rem] border border-[#D4AF37]/55" />
    <div className="relative px-5 py-6 sm:px-8 sm:py-7">{children}</div>
  </div>
);

export default function Rsvp() {
  const { deadlineLabel } = useSettings();
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target ? e.target.value : e });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createRsvp({ ...form, accompagnants: Number(form.accompagnants) });
      setSent(data);
      toast.success(data.present ? "Votre carte d'invitation est prête." : "Votre réponse a bien été envoyée aux mariés.");
    } catch {
      toast.error("Une erreur est survenue — merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative bg-[linear-gradient(135deg,#3B0910_0%,#58111A_50%,#2A050B_100%)] px-5 py-16 sm:px-8 md:py-24 lg:px-16"
      data-testid="rsvp-section"
    >
      <div className="relative z-10 mx-auto max-w-2xl">
        <Chapter index="VI" eyebrow="Répondez s'il vous plaît" title="Confirmation de Présence" script={deadlineLabel} dark />
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              data-testid="rsvp-confirmation"
            >
              <Frame>
                <div className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#4A0E17]">
                    <Check size={22} className="text-[#D4AF37]" />
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-[#4A0E17]">Merci, {sent.nom.split(" ")[0]} !</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5C4F51]">
                    {sent.present
                      ? `Votre carte est au nom de ${sent.nom}, pour ${partySize(sent)} personne${partySize(sent) > 1 ? "s" : ""}.`
                      : "Nous sommes tristes de ne pas vous avoir à nos côtés, mais nous vous remercions de votre réponse."}
                  </p>

                  {sent.present ? (
                    <div className="mx-auto mt-5 w-full max-w-[460px]">
                      <FairePart guest={sent} testId="personal-invite-card" />
                      <CardActions
                        cardTestId="personal-invite-card"
                        fileName="ma-carte-invitation.png"
                        whatsappText={waMessage(sent)}
                      />
                    </div>
                  ) : (
                    <a
                      data-testid="rsvp-whatsapp-button"
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage(sent))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-7 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#FAF7F2] transition-colors duration-300 hover:bg-[#6B1724]"
                    >
                      <MessageCircle size={15} className="text-[#D4AF37]" /> Envoyer ma réponse sur WhatsApp
                    </a>
                  )}
                  <button
                    data-testid="rsvp-again-button"
                    onClick={() => { setSent(null); setForm(initial); }}
                    className="gold-underline mt-5 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#6B1724]"
                  >
                    Envoyer une autre réponse
                  </button>
                </div>
              </Frame>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Frame>
                <form onSubmit={submit} className="space-y-4" data-testid="rsvp-form">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="rsvp-nom">Nom & Prénom *</label>
                      <input id="rsvp-nom" required data-testid="rsvp-input-nom" placeholder="Votre nom complet" value={form.nom} onChange={set("nom")} className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="rsvp-telephone">Numéro WhatsApp *</label>
                      <input
                        id="rsvp-telephone"
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        pattern="[0-9+().\s-]{8,20}"
                        data-testid="rsvp-input-telephone"
                        placeholder="+33 6 12 34 56 78"
                        value={form.telephone}
                        onChange={set("telephone")}
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Serez-vous des nôtres ?</label>
                    <div className="flex flex-wrap gap-2.5" data-testid="rsvp-attendance">
                      {[{ v: true, label: "Je serai présent·e" }, { v: false, label: "Je ne pourrai pas venir" }].map((o) => (
                        <button
                          type="button"
                          key={o.label}
                          data-testid={o.v ? "rsvp-present-oui" : "rsvp-present-non"}
                          onClick={() => setForm({ ...form, present: o.v })}
                          className={`rounded-full border px-5 py-2 font-cinzel text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${
                            form.present === o.v
                              ? "border-[#4A0E17] bg-[#4A0E17] text-[#FAF7F2]"
                              : "border-[#C48B92]/50 text-[#5C4F51] hover:border-[#4A0E17]"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Accompagnants</label>
                      <select data-testid="rsvp-select-accompagnants" value={form.accompagnants} onChange={set("accompagnants")} className={fieldCls}>
                        {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? "Je viens seul·e" : `+ ${n} personne(s)`}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Régime alimentaire</label>
                      <select data-testid="rsvp-select-regime" value={form.regime} onChange={set("regime")} className={fieldCls}>
                        {REGIMES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="rsvp-chanson">Votre chanson</label>
                    <input id="rsvp-chanson" data-testid="rsvp-input-chanson" placeholder="Votre chanson incontournable…" value={form.chanson} onChange={set("chanson")} className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="rsvp-message">Un mot pour les mariés</label>
                    <textarea id="rsvp-message" data-testid="rsvp-input-message" rows={2} placeholder="Allergies, tendresses…" value={form.message} onChange={set("message")} className={`${fieldCls} resize-none`} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="rsvp-submit-button"
                    className="animate-blink inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-7 py-3.5 font-cinzel text-xs uppercase tracking-[0.22em] text-[#FAF7F2] transition-colors duration-300 hover:bg-[#6B1724] disabled:opacity-60"
                  >
                    <Send size={15} className="text-[#D4AF37]" /> {loading ? "Envoi en cours…" : "Confirmer ma présence"}
                  </button>
                </form>
              </Frame>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
