import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { fileUrl } from "@/lib/photos";
import { getPhotos, uploadPhoto } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { PHOTO_SLOTS, resolvePhotoSlot } from "@/lib/invite-defaults";
import CoupleBackofficeLayout from "@/components/invite/CoupleBackofficeLayout";

export default function PhotosAdmin() {
  const [photos, setPhotos] = useState({});
  const [busy, setBusy] = useState("");
  const inputs = useRef({});

  const load = useCallback(
    () => getPhotos().then(setPhotos).catch(() => toast.error("Chargement impossible.")),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  useStoreSync("photos", load);

  const upload = async (slot, file) => {
    if (!file) return;
    setBusy(slot);
    try {
      await uploadPhoto(slot, file);
      toast.success("Photo mise à jour sur l’invitation.");
      await load();
    } catch {
      toast.error("Échec de l’envoi — réessayez.");
    } finally {
      setBusy("");
    }
  };

  return (
    <CoupleBackofficeLayout
      panel={{
        testId: "photos-admin",
        eyebrow: "Backoffice",
        title: "Photos de l’invitation",
        subtitle: "les visuels visibles sur la page d’accueil",
        intro:
          "Chaque carte correspond à un emplacement réel sur le site. L’aperçu montre l’image actuelle (démo ou la vôtre).",
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PHOTO_SLOTS.map((s) => {
          const { src, customized } = resolvePhotoSlot(s.key, photos);
          const preview = customized ? fileUrl(src) : src;
          return (
            <div
              key={s.key}
              className="backoffice-photo-slot luxe-card luxe-card--light luxe-card--no-inset overflow-hidden"
              data-testid={`photo-slot-${s.key}`}
            >
              <div className="relative h-44 bg-wedding-ivory-deep/40">
                {preview ? (
                  <img
                    src={preview}
                    alt={s.label}
                    className="h-full w-full object-cover"
                    data-testid={`photo-preview-${s.key}`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-wedding-wine-deep/45">
                    <ImageIcon size={28} strokeWidth={1.2} />
                  </div>
                )}
                <span
                  className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-[8px] px-3 py-1 font-cinzel text-[9px] uppercase tracking-[0.15em] ${
                    customized
                      ? "bg-wedding-gold-accent text-wedding-ink"
                      : "bg-white/90 text-wedding-wine-deep ring-1 ring-wedding-rose/20"
                  }`}
                >
                  {customized ? (
                    <>
                      <Check size={11} /> Personnalisée
                    </>
                  ) : (
                    "Sur le site"
                  )}
                </span>
              </div>
              <div className="p-5">
                <p className="backoffice-label mb-0">{s.label}</p>
                <p className="backoffice-hint mt-1">{s.hint}</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  ref={(el) => {
                    inputs.current[s.key] = el;
                  }}
                  onChange={(e) => upload(s.key, e.target.files[0])}
                  data-testid={`photo-input-${s.key}`}
                />
                <button
                  type="button"
                  data-testid={`photo-upload-button-${s.key}`}
                  onClick={() => inputs.current[s.key]?.click()}
                  disabled={busy === s.key}
                  className="btn-couple-classic mt-4 inline-flex w-full items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={14} /> {busy === s.key ? "Envoi…" : customized ? "Remplacer" : "Choisir une photo"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </CoupleBackofficeLayout>
  );
}
