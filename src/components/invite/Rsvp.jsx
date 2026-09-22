import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { createRsvp } from "@/lib/api";
import { EASE, WHATSAPP_NUMBER } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";

const REGIMES = ["Aucun", "Végétarien", "Sans gluten", "Allergies (préciser en message)"];

const waMessage = (d) =>
  [
    "Confirmation de présence — Mariage",
    `Nom : ${d.nom}`,
    `Email : ${d.email}`,
    `Présence : ${d.present ? "Oui, je serai là" : "Non, je ne pourrai pas venir"}`,
    `Accompagnants : +${d.accompagnants}`,
    `Régime : ${d.regime}`,
    d.chanson ? `Chanson : ${d.chanson}` : "",
    d.message ? `Message : ${d.message}` : "",
  ].filter(Boolean).join("\n");

const initial = { nom: "", email: "", present: true, accompagnants: 0, regime: "Aucun", chanson: "", message: "" };

const fieldCls = "w-full bg-white border hairline rounded-sm px-4 py-3.5 text-sm text-[#1C1617] placeholder:text-[#8C7B7E] transition-all duration-300";
const labelCls = "block font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#6B1724] mb-2";

const Frame = ({ children }) => (
  <div className="relative bg-[#FAF7F2] rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
    <div className="absolute inset-3 border border-[#D4AF37]/60 pointer-events-none" />
    <div className="absolute inset-5 border border-[#D4AF37]/30 pointer-events-none" />
    <div className="relative p-9 sm:p-14">{children}</div>
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
      toast.success("Votre réponse a bien été envoyée aux mariés.");
    } catch {
      toast.error("Une erreur est survenue — merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 bg-[linear-gradient(135deg,#3B0910_0%,#58111A_50%,#2A050B_100%)]"
      data-testid="rsvp-section"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
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
                  <span className="mx-auto w-16 h-16 rounded-full bg-[#4A0E17] border border-[#D4AF37]/60 flex items-center justify-center">
                    <Check size={28} className="text-[#D4AF37]" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl text-[#4A0E17]">Merci, {sent.nom.split(" ")[0]} !</h3>
                  <p className="mt-3 text-[#5C4F51] text-sm leading-relaxed">
                    {sent.present
                      ? `Nous avons hâte de vous compter parmi nous${sent.accompagnants > 0 ? `, accompagné·e de ${sent.accompagnants} personne(s)` : ""}.`
                      : "Nous sommes tristes de ne pas vous avoir à nos côtés, mais nous vous remercions de votre réponse."}
                  </p>
                  <a
                    data-testid="rsvp-whatsapp-button"
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage(sent))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animate-blink mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#6B1724] transition-colors duration-300"
                  >
                    <MessageCircle size={15} className="text-[#D4AF37]" /> Envoyer ma confirmation sur WhatsApp
                  </a>
                  <p className="mt-3 text-xs text-[#8C7B7E]">Un message pré-rempli s'ouvre — il ne reste qu'à l'envoyer.</p>
                  <button
                    data-testid="rsvp-again-button"
                    onClick={() => { setSent(null); setForm(initial); }}
                    className="mt-6 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#6B1724] gold-underline"
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
                <form onSubmit={submit} className="space-y-6" data-testid="rsvp-form">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} htmlFor="rsvp-nom">Nom & Prénom *</label>
                      <input id="rsvp-nom" required data-testid="rsvp-input-nom" placeholder="Votre nom complet" value={form.nom} onChange={set("nom")} className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="rsvp-email">Adresse e-mail *</label>
                      <input id="rsvp-email" required type="email" data-testid="rsvp-input-email" placeholder="vous@exemple.com" value={form.email} onChange={set("email")} className={fieldCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Serez-vous des nôtres ?</label>
                    <div className="flex flex-wrap gap-3" data-testid="rsvp-attendance">
                      {[{ v: true, label: "Je serai présent·e" }, { v: false, label: "Je ne pourrai pas venir" }].map((o) => (
                        <button
                          type="button"
                          key={o.label}
                          data-testid={o.v ? "rsvp-present-oui" : "rsvp-present-non"}
                          onClick={() => setForm({ ...form, present: o.v })}
                          className={`rounded-full px-6 py-2.5 font-cinzel text-[11px] tracking-[0.15em] uppercase transition-all duration-300 border ${
                            form.present === o.v
                              ? "bg-[#4A0E17] text-[#FAF7F2] border-[#4A0E17]"
                              : "border-[#C48B92]/50 text-[#5C4F51] hover:border-[#4A0E17]"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
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
                    <input id="rsvp-chanson" data-testid="rsvp-input-chanson" placeholder="Votre chanson incontournable sur la piste de danse…" value={form.chanson} onChange={set("chanson")} className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="rsvp-message">Un mot pour les mariés</label>
                    <textarea id="rsvp-message" data-testid="rsvp-input-message" rows={3} placeholder="Choix du pagne, allergies, tendresses…" value={form.message} onChange={set("message")} className={fieldCls} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="rsvp-submit-button"
                    className="animate-blink w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#6B1724] transition-colors duration-300 disabled:opacity-60"
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
