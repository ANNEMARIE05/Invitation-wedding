import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { fileUrl } from "@/lib/photos";
import { getPhotos, uploadPhoto } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { PHOTO_SLOTS, resolvePhotoSlot } from "@/lib/invite-defaults";

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
    <div
      className="min-h-screen bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)] text-[#FAF7F2] px-5 sm:px-10 py-10"
      data-testid="photos-admin"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          to="/espace-maries"
          data-testid="photos-back-link"
          className="inline-flex items-center gap-2 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft size={14} /> Espace mariés
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Photos de l’invitation</h1>
        <p className="mt-1 font-script text-2xl text-[#D4AF37]">les visuels visibles sur la page d’accueil</p>
        <p className="mt-3 text-sm text-[#C48B92] max-w-2xl">
          Chaque carte correspond à un emplacement réel sur le site. L’aperçu montre l’image actuelle (démo ou la vôtre).
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTO_SLOTS.map((s) => {
            const { src, customized } = resolvePhotoSlot(s.key, photos);
            const preview = customized ? fileUrl(src) : src;
            return (
              <div
                key={s.key}
                className="overflow-hidden rounded-2xl border hairline-gold bg-white/[0.04]"
                data-testid={`photo-slot-${s.key}`}
              >
                <div className="relative h-44 bg-[#2A050B]">
                  {preview ? (
                    <img
                      src={preview}
                      alt={s.label}
                      className="w-full h-full object-cover"
                      data-testid={`photo-preview-${s.key}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C48B92]">
                      <ImageIcon size={28} strokeWidth={1.2} />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full font-cinzel text-[9px] tracking-[0.15em] uppercase px-3 py-1 ${
                      customized
                        ? "bg-[#D4AF37] text-[#2A050B]"
                        : "bg-[#FAF7F2]/15 text-[#FAF7F2] ring-1 ring-[#FAF7F2]/25"
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
                  <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-[#C48B92]">{s.label}</p>
                  <p className="mt-1 text-xs text-[#C48B92]/80 leading-snug">{s.hint}</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    ref={(el) => (inputs.current[s.key] = el)}
                    onChange={(e) => upload(s.key, e.target.files[0])}
                    data-testid={`photo-input-${s.key}`}
                  />
                  <button
                    type="button"
                    data-testid={`photo-upload-button-${s.key}`}
                    onClick={() => inputs.current[s.key]?.click()}
                    disabled={busy === s.key}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-[#2A050B] font-cinzel text-[10px] tracking-[0.2em] uppercase px-5 py-3 hover:bg-[#B89428] transition-all disabled:opacity-50"
                  >
                    <Upload size={14} /> {busy === s.key ? "Envoi…" : customized ? "Remplacer" : "Choisir une photo"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
