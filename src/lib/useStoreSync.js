import { useEffect } from "react";
import { subscribeStoreChange } from "./storage";

/**
 * Recharge les données quand un autre formulaire ou onglet modifie le stockage local.
 * @param {string | string[] | null} scopes — ex. "rsvps", ["photos","settings"], ou null = tout
 * @param {() => void} reload
 */
export function useStoreSync(scopes, reload) {
  useEffect(() => {
    const wanted = scopes == null ? null : Array.isArray(scopes) ? scopes : [scopes];
    return subscribeStoreChange((scope) => {
      if (wanted == null || wanted.includes(scope)) reload();
    });
  }, [reload, scopes]);
}
