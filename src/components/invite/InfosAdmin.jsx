import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Save, Users, Camera, MapPin, Video } from "lucide-react";
import { applyThemeToDocument } from "@/lib/theme";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/api";
import {
  codeDefaultSettings,
  formFromSettings,
  notifySettingsSaved,
  settingsFromForm,
} from "@/lib/invite-defaults";
import CoupleBackofficeLayout from "@/components/invite/CoupleBackofficeLayout";
import { WeddingButtonMark, WeddingLoader } from "@/components/invite/WeddingLoader";

const toInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const fieldCls = "backoffice-field w-full";
const labelCls = "backoffice-label";
const inputCls = `${fieldCls} h-11`;

function LocationFields({ prefix, title, hint, form, setNested }) {
  const loc = form[prefix];
  const set = (key) => (e) => setNested(prefix, key, e.target.value);
  return (
    <section className="backoffice-section">
      <h2 className="backoffice-section__title flex items-center gap-2">
        <MapPin size={18} strokeWidth={1.5} /> {title}
      </h2>
      <p className="backoffice-hint mt-1">{hint}</p>
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
  const [busyAction, setBusyAction] = useState("");
  const saving = Boolean(busyAction);

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

  useEffect(() => {
    if (!form?.theme) return;
    applyThemeToDocument({ theme: form.theme });
  }, [form?.theme]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setNested = (group, key, value) =>
    setForm({ ...form, [group]: { ...form[group], [key]: value } });

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    setBusyAction("save");
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
      setBusyAction("");
    }
  };

  const resetAllToDefaults = async () => {
    if (saving) return;
    const ok = window.confirm(
      "Remettre à jour toutes les informations (couple, date, lieux, Zoom) avec les valeurs par défaut du faire-part ? Vos modifications seront remplacées.",
    );
    if (!ok) return;
    setBusyAction("reset");
    try {
      const raw = codeDefaultSettings();
      await saveSettings(raw);
      setForm({ ...formFromSettings(raw), date_iso: toInput(raw.date_iso) });
      notifySettingsSaved();
      toast.success("Tout a été remis à jour — l’invitation affiche les valeurs par défaut.");
    } catch {
      toast.error("Échec — réessayez.");
    } finally {
      setBusyAction("");
    }
  };

  if (!form) {
    return (
      <CoupleBackofficeLayout
        panel={{
          testId: "infos-admin",
          eyebrow: "Backoffice",
          title: "Vos informations",
          subtitle: "un instant",
        }}
      >
        <WeddingLoader compact label="Chargement des informations…" />
      </CoupleBackofficeLayout>
    );
  }

  const navLinks = (
    <>
      <Link to="/reponses" data-testid="infos-link-reponses" className="backoffice-link-chip">
        <Users size={13} /> Les réponses
      </Link>
      <Link to="/photos" data-testid="infos-link-photos" className="backoffice-link-chip">
        <Camera size={13} /> Vos photos
      </Link>
    </>
  );

  return (
    <CoupleBackofficeLayout
      panel={{
        testId: "infos-admin",
        eyebrow: "Backoffice",
        title: "Vos informations",
        subtitle: "avec amour, pour vos invités",
        intro:
          "Peaufinez ce que vos proches verront sur l’invitation — prénoms, lieux, Zoom… Un clic sur Enregistrer, et c’est à jour.",
        headerExtra: navLinks,
      }}
    >
      <form onSubmit={save} className="mx-auto max-w-3xl space-y-4" data-testid="infos-form">
        <section className="backoffice-section">
          <h2 className="backoffice-section__title">Le couple</h2>
          <p className="backoffice-hint mt-1">Hero, bandeau, faire-part, pied de page</p>
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

        <section className="backoffice-section">
          <h2 className="backoffice-section__title">Date & heure</h2>
          <p className="backoffice-hint mt-1">Compte à rebours, faire-part, calendrier</p>
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

        <section className="backoffice-section">
          <h2 className="backoffice-section__title">Lieu principal (faire-part)</h2>
          <p className="backoffice-hint mt-1">Nom sous le faire-part et lien calendrier</p>
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

        <section className="backoffice-section">
          <h2 className="backoffice-section__title flex items-center gap-2">
            <Video size={18} strokeWidth={1.5} /> Zoom
          </h2>
          <p className="backoffice-hint mt-1">Bloc « Suivre sur Zoom » et lien pour les invités en ligne</p>
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
              <p className="backoffice-hint mt-1.5">
                Si le lien est vide, un ID différent de « 0000 » génère un lien zoom.us/j/… automatique.
              </p>
            </div>
            <div>
              <label className={labelCls}>Code secret / Mot de passe (Passcode)</label>
              <input
                data-testid="infos-input-zoom-passcode"
                value={form.zoom_passcode || ""}
                onChange={set("zoom_passcode")}
                className={fieldCls}
                placeholder="Ex. 112233"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            aria-busy={busyAction === "save" || undefined}
            data-testid="infos-save-button"
            className={`backoffice-btn-primary flex flex-1 items-center justify-center gap-2${busyAction === "save" ? " is-busy" : ""}`}
          >
            {busyAction === "save" ? <WeddingButtonMark /> : <Save size={15} />}
            <span>{busyAction === "save" ? "Enregistrement…" : "Enregistrer"}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            aria-busy={busyAction === "reset" || undefined}
            data-testid="infos-reset-defaults-button"
            onClick={resetAllToDefaults}
            className={`btn-couple-classic inline-flex items-center justify-center gap-2 sm:shrink-0${busyAction === "reset" ? " is-busy" : ""}`}
          >
            {busyAction === "reset" ? <WeddingButtonMark /> : null}
            <span>{busyAction === "reset" ? "Mise à jour…" : "Remettre à jour tout"}</span>
          </button>
        </div>
      </form>
    </CoupleBackofficeLayout>
  );
}
