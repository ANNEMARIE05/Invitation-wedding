import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Users, Camera, MapPin, Video } from "lucide-react";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/api";
import {
  codeDefaultSettings,
  formFromSettings,
  notifySettingsSaved,
  settingsFromForm,
} from "@/lib/invite-defaults";

const toInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const fieldCls =
  "w-full rounded-xl border hairline-gold bg-white/[0.06] px-3.5 py-2.5 text-sm text-[#FAF7F2] placeholder:text-[#C48B92]/70 transition-all duration-300";
const labelCls =
  "mb-1.5 block min-h-[2.25rem] font-cinzel text-[10px] uppercase leading-snug tracking-[0.18em] text-[#C48B92] sm:tracking-[0.2em]";
const inputCls = `${fieldCls} h-11`;

function LocationFields({ prefix, title, hint, form, setNested }) {
  const loc = form[prefix];
  const set = (key) => (e) => setNested(prefix, key, e.target.value);
  return (
    <section className="rounded-2xl border hairline-gold bg-white/[0.04] p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-display text-2xl text-[#D4AF37]">
        <MapPin size={18} strokeWidth={1.5} /> {title}
      </h2>
      <p className="mt-1 text-xs text-[#C48B92]/90">{hint}</p>
      <div className="mt-4 space-y-3.5">
        <div className="grid gap-3.5 sm:grid-cols-[minmax(0,1fr)_6.75rem] sm:items-end sm:gap-4">
          <div className="min-w-0">
            <label className={labelCls}>Nom du lieu</label>
            <input
              data-testid={`infos-${prefix}-name`}
              value={loc.name}
              onChange={set("name")}
              className={inputCls}
            />
          </div>
          <div className="sm:w-[6.75rem]">
            <label className={`${labelCls} whitespace-nowrap`}>Heure</label>
            <input
              data-testid={`infos-${prefix}-time`}
              value={loc.time}
              onChange={set("time")}
              className={`${inputCls} text-center tabular-nums sm:px-2`}
              placeholder="13h30"
              aria-label="Heure affichée sur la carte"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Adresse</label>
          <input
            data-testid={`infos-${prefix}-address`}
            value={loc.address}
            onChange={set("address")}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Lien Google Maps (optionnel)</label>
          <input
            data-testid={`infos-${prefix}-maps`}
            value={loc.maps_url}
            onChange={set("maps_url")}
            className={inputCls}
            placeholder="Laisser vide pour générer depuis l’adresse"
          />
        </div>
        <div>
          <label className={labelCls}>Lien carte intégrée (optionnel)</label>
          <input
            data-testid={`infos-${prefix}-embed`}
            value={loc.embed_url}
            onChange={set("embed_url")}
            className={inputCls}
            placeholder="URL iframe Google Maps — vide = auto"
          />
        </div>
      </div>
    </section>
  );
}

export default function InfosAdmin() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((data) => {
        const base = formFromSettings(data);
        setForm({ ...base, date_iso: toInput(base.date_iso) });
      })
      .catch(() => {
        const base = formFromSettings({});
        setForm({ ...base, date_iso: toInput(base.date_iso) });
      });
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setNested = (group, key, value) =>
    setForm({ ...form, [group]: { ...form[group], [key]: value } });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const raw = settingsFromForm({
        ...form,
        date_iso: form.date_iso ? new Date(form.date_iso).toISOString() : formFromSettings({}).date_iso,
      });
      await saveSettings(raw);
      notifySettingsSaved();
      toast.success("Informations enregistrées — l’invitation est à jour.");
    } catch {
      toast.error("Échec de l'enregistrement — réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const resetAllToDefaults = async () => {
    const ok = window.confirm(
      "Remettre à jour toutes les informations (couple, date, lieux, Zoom) avec les valeurs par défaut du faire-part ? Vos modifications seront remplacées.",
    );
    if (!ok) return;
    setSaving(true);
    try {
      const raw = codeDefaultSettings();
      await saveSettings(raw);
      setForm({ ...formFromSettings(raw), date_iso: toInput(raw.date_iso) });
      notifySettingsSaved();
      toast.success("Tout a été remis à jour — l’invitation affiche les valeurs par défaut.");
    } catch {
      toast.error("Échec — réessayez.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)] text-[#FAF7F2] px-5 py-16 text-center">
        <p className="font-display italic text-[#C48B92]">Chargement des informations…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)] text-[#FAF7F2] px-5 sm:px-10 py-10"
      data-testid="infos-admin"
    >
      <div className="max-w-3xl mx-auto">
        <Link
          to="/espace-maries"
          data-testid="infos-back-link"
          className="inline-flex items-center gap-2 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft size={14} /> Espace mariés
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Vos informations</h1>
        <p className="mt-1 font-script text-2xl text-[#D4AF37]">avec amour, pour vos invités</p>
        <p className="mt-3 text-sm text-[#C48B92] max-w-xl">
          Ici, vous peaufinez ce que vos proches verront sur l’invitation — prénoms, lieux, Zoom… Un clic sur Enregistrer, et c’est à jour.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/reponses"
            data-testid="infos-link-reponses"
            className="inline-flex items-center gap-2 rounded-full border hairline-gold px-5 py-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors"
          >
            <Users size={13} /> Les réponses
          </Link>
          <Link
            to="/photos"
            data-testid="infos-link-photos"
            className="inline-flex items-center gap-2 rounded-full border hairline-gold px-5 py-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors"
          >
            <Camera size={13} /> Vos photos
          </Link>
        </div>

        <form onSubmit={save} className="mt-6 space-y-4" data-testid="infos-form">
          <section className="rounded-2xl border hairline-gold bg-white/[0.04] p-5 sm:p-6">
            <h2 className="font-display text-2xl text-[#D4AF37]">Le couple</h2>
            <p className="mt-1 text-xs text-[#C48B92]/90">Hero, bandeau, faire-part, pied de page</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Prénom 1</label>
                <input data-testid="infos-input-bride" value={form.bride} onChange={set("bride")} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Prénom 2</label>
                <input data-testid="infos-input-groom" value={form.groom} onChange={set("groom")} className={fieldCls} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border hairline-gold bg-white/[0.04] p-5 sm:p-6">
            <h2 className="font-display text-2xl text-[#D4AF37]">Date & heure</h2>
            <p className="mt-1 text-xs text-[#C48B92]/90">Compte à rebours, faire-part, calendrier</p>
            <div className="mt-4">
              <label className={labelCls}>Événement principal</label>
              <input
                type="datetime-local"
                data-testid="infos-input-date"
                value={form.date_iso}
                onChange={set("date_iso")}
                className={fieldCls}
              />
            </div>
          </section>

          <section className="rounded-2xl border hairline-gold bg-white/[0.04] p-5 sm:p-6">
            <h2 className="font-display text-2xl text-[#D4AF37]">Lieu principal (faire-part)</h2>
            <p className="mt-1 text-xs text-[#C48B92]/90">Nom sous le faire-part et lien calendrier</p>
            <div className="mt-4 space-y-3.5">
              <div>
                <label className={labelCls}>Nom</label>
                <input
                  data-testid="infos-input-venue-name"
                  value={form.venue_name}
                  onChange={set("venue_name")}
                  className={fieldCls}
                />
              </div>
              <div>
                <label className={labelCls}>Adresse</label>
                <input
                  data-testid="infos-input-venue-address"
                  value={form.venue_address}
                  onChange={set("venue_address")}
                  className={fieldCls}
                />
              </div>
            </div>
          </section>

          <LocationFields
            prefix="civil"
            title="Mariage civil"
            hint="Carte « Où nous retrouver » — mairie"
            form={form}
            setNested={setNested}
          />

          <LocationFields
            prefix="ceremony"
            title="Discours de mariage"
            hint="Carte lieux — Salle du Royaume / réception"
            form={form}
            setNested={setNested}
          />

          <section className="rounded-2xl border hairline-gold bg-white/[0.04] p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-[#D4AF37]">
              <Video size={18} strokeWidth={1.5} /> Zoom
            </h2>
            <p className="mt-1 text-xs text-[#C48B92]/90">Bloc « Suivre sur Zoom » et lien pour les invités en ligne</p>
            <div className="mt-4 space-y-3.5">
              <div>
                <label className={labelCls}>Lien de réunion (URL complète)</label>
                <input
                  data-testid="infos-input-zoom-url"
                  value={form.zoom_url}
                  onChange={set("zoom_url")}
                  className={fieldCls}
                  placeholder="https://zoom.us/j/…"
                />
              </div>
              <div>
                <label className={labelCls}>Code / ID affiché</label>
                <input
                  data-testid="infos-input-zoom-code"
                  value={form.zoom_code}
                  onChange={set("zoom_code")}
                  className={fieldCls}
                  placeholder="Ex. 123 456 7890"
                />
                <p className="mt-1.5 text-[11px] text-[#C48B92]/80">
                  Si le lien est vide, un ID différent de « 0000 » génère un lien zoom.us/j/… automatique.
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              data-testid="infos-save-button"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-[#2A050B] font-cinzel text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#B89428] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-all duration-300 disabled:opacity-60"
            >
              <Save size={15} /> {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              disabled={saving}
              data-testid="infos-reset-defaults-button"
              onClick={resetAllToDefaults}
              className="inline-flex items-center justify-center gap-2 rounded-full border hairline-gold px-6 py-4 font-cinzel text-[10px] tracking-[0.18em] uppercase text-[#C48B92] transition-colors hover:text-[#D4AF37] disabled:opacity-60 sm:shrink-0"
            >
              Remettre à jour tout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
