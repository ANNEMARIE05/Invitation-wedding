import { useCallback, useEffect, useState } from "react";
import { coupleLogout, isCoupleAuthenticated } from "./couple-auth";

export function useCoupleAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const sync = useCallback(async () => {
    setChecking(true);
    const ok = await isCoupleAuthenticated();
    setAuthenticated(ok);
    setChecking(false);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("couple-auth-change", sync);
    return () => window.removeEventListener("couple-auth-change", sync);
  }, [sync]);

  const logout = useCallback(async () => {
    await coupleLogout();
    setAuthenticated(false);
  }, []);

  return { authenticated, checking, logout, refresh: sync };
}
