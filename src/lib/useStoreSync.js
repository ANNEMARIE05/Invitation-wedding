import { useEffect } from "react";
import { subscribeStoreChange } from "./storage";

/**
 * Recharge les données quand un autre composant signale une mise à jour (événement interne).
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
