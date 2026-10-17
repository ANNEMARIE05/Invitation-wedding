import { useEffect } from "react";
import { getSettings } from "@/lib/api";
import { SETTINGS_CHANGE_EVENT } from "@/lib/invite-defaults";
import { applyThemeToDocument } from "@/lib/theme";

/** Charge les couleurs enregistrées et les applique sur :root. */
export default function ThemeApplier() {
  useEffect(() => {
    const load = () =>
      getSettings()
        .then((data) => applyThemeToDocument(data))
        .catch(() => applyThemeToDocument({}));

    load();
    window.addEventListener(SETTINGS_CHANGE_EVENT, load);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, load);
  }, []);

  return null;
}
