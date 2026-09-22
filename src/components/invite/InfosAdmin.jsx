import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Users, Camera, Mail } from "lucide-react";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/api";

const emptyStory = [
  { year: "", title: "", text: "" },
  { year: "", title: "", text: "" },
  { year: "", title: "", text: "" },
];

const empty = { bride: "", groom: "", date_iso: "", venue_name: "", venue_address: "", notify_email: "", story: emptyStory };

const toInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const fieldCls = "w-full bg-white/[0.06] border hairline-gold rounded-sm px-4 py-3.5 text-sm text-[#FAF7F2] placeholder:text-[#C48B92]/70 transition-all duration-300";
const labelCls = "block font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C48B92] mb-2";

export default function InfosAdmin() {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((data) =>
        setForm({
          ...empty,
          ...data,
          date_iso: toInput(data.date_iso),
          story: Array.isArray(data.story) && data.story.length === 3 ? data.story : emptyStory,
        })
      )
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setStory = (i, k) => (e) =>
    setForm({ ...form, story: form.story.map((s, j) => (j === i ? { ...s, [k]: e.target.value } : s)) });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, date_iso: form.date_iso ? new Date(form.date_iso).toISOString() : "" };
      await saveSettings(payload);
      toast.success("Informations enregistrées — votre invitation est à jour.");
    } catch {
      toast.error("Échec de l'enregistrement — réessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)] text-[#FAF7F2] px-5 sm:px-10 py-10" data-testid="infos-admin">
      <div className="max-w-3xl mx-auto">
        <Link to="/" data-testid="infos-back-link" className="inline-flex items-center gap-2 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors">
          <ArrowLeft size={14} /> Retour à l'invitation
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Vos Infos</h1>
        <p className="mt-1 font-script text-2xl text-[#D4AF37]">tout se met à jour sur l'invitation, instantanément</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/reponses" data-testid="infos-link-reponses" className="inline-flex items-center gap-2 rounded-full border hairline-gold px-5 py-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors">
            <Users size={13} /> Les réponses
          </Link>
          <Link to="/photos" data-testid="infos-link-photos" className="inline-flex items-center gap-2 rounded-full border hairline-gold px-5 py-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors">
            <Camera size={13} /> Vos photos
          </Link>
        </div>

        <form onSubmit={save} className="mt-8 space-y-8" data-testid="infos-form">
          <section className="border hairline-gold bg-white/[0.04] rounded-sm p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#D4AF37]">Le Couple</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Prénom 1</label>
                <input data-testid="infos-input-bride" placeholder="Ex. Éléonore" value={form.bride} onChange={set("bride")} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Prénom 2</label>
                <input data-testid="infos-input-groom" placeholder="Ex. Augustin" value={form.groom} onChange={set("groom")} className={fieldCls} />
              </div>
            </div>
          </section>

          <section className="border hairline-gold bg-white/[0.04] rounded-sm p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#D4AF37]">Le Grand Jour</h2>
            <div className="mt-5">
              <label className={labelCls}>Date & heure de la cérémonie</label>
              <input type="datetime-local" data-testid="infos-input-date" value={form.date_iso} onChange={set("date_iso")} className={fieldCls} />
            </div>
          </section>

          <section className="border hairline-gold bg-white/[0.04] rounded-sm p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#D4AF37]">Le Lieu</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className={labelCls}>Nom du lieu</label>
                <input data-testid="infos-input-venue-name" placeholder="Ex. Château de Deauville" value={form.venue_name} onChange={set("venue_name")} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Adresse (pour l'itinéraire et le QR GPS)</label>
                <input data-testid="infos-input-venue-address" placeholder="Ex. Route des Jardins, 14800 Deauville" value={form.venue_address} onChange={set("venue_address")} className={fieldCls} />
              </div>
            </div>
          </section>

          <section className="border hairline-gold bg-white/[0.04] rounded-sm p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#D4AF37] flex items-center gap-3">
              <Mail size={18} /> Notification E-mail
            </h2>
            <p className="mt-2 text-sm text-[#C48B92]">Recevez un e-mail à chaque confirmation de présence d'un invité. Laissez vide pour désactiver.</p>
            <div className="mt-5">
              <label className={labelCls}>Adresse e-mail de réception</label>
              <input type="email" data-testid="infos-input-notify-email" placeholder="Ex. vous@exemple.com" value={form.notify_email} onChange={set("notify_email")} className={fieldCls} />
            </div>
          </section>

          <section className="border hairline-gold bg-white/[0.04] rounded-sm p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#D4AF37]">Notre Histoire</h2>
            <p className="mt-2 text-sm text-[#C48B92]">Trois moments clés. Laissez vide pour garder le texte de démonstration.</p>
            <div className="mt-5 space-y-6">
              {form.story.map((s, i) => (
                <div key={i} className="space-y-3 border-b hairline-gold pb-5 last:border-0 last:pb-0">
                  <div className="grid grid-cols-[90px_1fr] gap-3">
                    <input data-testid={`infos-story-year-${i}`} placeholder="Année" value={s.year} onChange={setStory(i, "year")} className={fieldCls} />
                    <input data-testid={`infos-story-title-${i}`} placeholder="Titre du moment" value={s.title} onChange={setStory(i, "title")} className={fieldCls} />
                  </div>
                  <textarea rows={2} data-testid={`infos-story-text-${i}`} placeholder="Une ou deux phrases…" value={s.text} onChange={setStory(i, "text")} className={`${fieldCls} resize-none`} />
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            data-testid="infos-save-button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-[#2A050B] font-cinzel text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#B89428] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-all duration-300 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? "Enregistrement…" : "Enregistrer mes informations"}
          </button>
        </form>
      </div>
    </div>
  );
}
