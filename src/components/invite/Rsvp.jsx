import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check } from "lucide-react";
import { toast } from "sonner";
import { createRsvp } from "@/lib/api";
import { EASE } from "@/lib/invite-data";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";

const REGIMES = ["Aucun", "Végétarien", "Sans gluten", "Allergies (préciser en message)"];

const initial = { nom: "", email: "", present: true, accompagnants: 0, regime: "Aucun", chanson: "", message: "" };

const fieldCls = "w-full bg-[#FAF7F2] border hairline rounded-sm px-4 py-3.5 text-sm text-[#1C1617] placeholder:text-[#8C7B7E] transition-all duration-300";

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
      className="py-24 md:py-36 px-5 sm:px-8 lg:px-16 bg-[linear-gradient(135deg,#3B0910_0%,#58111A_50%,#2A050B_100%)]"
      data-testid="rsvp-section"
    >
      <div className="max-w-3xl mx-auto">
        <Chapter index="VII" eyebrow="Répondez s'il vous plaît" title="Confirmation de Présence" script={deadlineLabel} dark />
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="border hairline-gold bg-white/[0.05] backdrop-blur-sm rounded-sm p-10 text-center"
              data-testid="rsvp-confirmation"
            >
              <span className="mx-auto w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Check size={28} className="text-[#2A050B]" />
              </span>
              <h3 className="mt-6 font-display text-3xl text-[#FAF7F2]">Merci, {sent.nom.split(" ")[0]} !</h3>
              <p className="mt-3 text-[#C48B92] text-sm leading-relaxed">
                {sent.present
                  ? `Nous avons hâte de vous compter parmi nous${sent.accompagnants > 0 ? `, accompagné·e de ${sent.accompagnants} personne(s)` : ""}.`
                  : "Nous sommes tristes de ne pas vous avoir à nos côtés, mais nous vous remercions de votre réponse."}
              </p>
              <button
                data-testid="rsvp-again-button"
                onClick={() => { setSent(null); setForm(initial); }}
                className="mt-8 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] gold-underline"
              >
                Envoyer une autre réponse
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
              onSubmit={submit}
              className="border hairline-gold bg-white/[0.05] backdrop-blur-sm rounded-sm p-7 sm:p-10 space-y-6"
              data-testid="rsvp-form"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <input required data-testid="rsvp-input-nom" placeholder="Nom & Prénom *" value={form.nom} onChange={set("nom")} className={fieldCls} />
                <input required type="email" data-testid="rsvp-input-email" placeholder="Adresse e-mail *" value={form.email} onChange={set("email")} className={fieldCls} />
              </div>

              <div className="flex flex-wrap gap-3" data-testid="rsvp-attendance">
                {[{ v: true, label: "Je serai présent·e" }, { v: false, label: "Je ne pourrai pas venir" }].map((o) => (
                  <button
                    type="button"
                    key={o.label}
                    data-testid={o.v ? "rsvp-present-oui" : "rsvp-present-non"}
                    onClick={() => setForm({ ...form, present: o.v })}
                    className={`rounded-full px-6 py-2.5 font-cinzel text-[11px] tracking-[0.15em] uppercase transition-all duration-300 border ${
                      form.present === o.v
                        ? "bg-[#D4AF37] text-[#2A050B] border-[#D4AF37]"
                        : "border-[#C48B92]/40 text-[#FAF7F2]/80 hover:border-[#D4AF37]"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C48B92] mb-2">Accompagnants</label>
                  <select data-testid="rsvp-select-accompagnants" value={form.accompagnants} onChange={set("accompagnants")} className={fieldCls}>
                    {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? "Je viens seul·e" : `+ ${n} personne(s)`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C48B92] mb-2">Régime alimentaire</label>
                  <select data-testid="rsvp-select-regime" value={form.regime} onChange={set("regime")} className={fieldCls}>
                    {REGIMES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <input data-testid="rsvp-input-chanson" placeholder="Votre chanson incontournable sur la piste de danse…" value={form.chanson} onChange={set("chanson")} className={fieldCls} />
              <textarea data-testid="rsvp-input-message" rows={3} placeholder="Un mot pour les mariés (allergies, précisions, tendresses…)" value={form.message} onChange={set("message")} className={fieldCls} />

              <button
                type="submit"
                disabled={loading}
                data-testid="rsvp-submit-button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-[#2A050B] font-cinzel text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#B89428] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-all duration-300 disabled:opacity-60"
              >
                <Send size={15} /> {loading ? "Envoi en cours…" : "Envoyer ma réponse"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
