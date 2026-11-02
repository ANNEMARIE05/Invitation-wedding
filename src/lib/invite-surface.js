import { applySurfaceModeToDocument } from "./theme";

/** Mode « doux » lorsque le téléphone / OS est en thème sombre ; clair sinon. */
export function getSystemInviteSurfaceMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Écoute les changements de thème système (réglages iPhone / Android). */
export function subscribeSystemInviteSurface(onMode) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const emit = () => {
    const mode = mq.matches ? "dark" : "light";
    onMode(mode);
    applySurfaceModeToDocument({ surface_mode: mode });
  };
  emit();
  mq.addEventListener("change", emit);
  return () => {
    mq.removeEventListener("change", emit);
    applySurfaceModeToDocument({ surface_mode: "light" });
  };
}
