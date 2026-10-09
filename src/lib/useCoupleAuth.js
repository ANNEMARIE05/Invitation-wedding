import { useCallback, useEffect, useState } from "react";
import { coupleLogout, isCoupleAuthenticated } from "./couple-auth";

export function useCoupleAuth() {
  const [authenticated, setAuthenticated] = useState(isCoupleAuthenticated);

  const sync = useCallback(() => setAuthenticated(isCoupleAuthenticated()), []);

  useEffect(() => {
    sync();
    window.addEventListener("couple-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("couple-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const logout = useCallback(() => {
    coupleLogout();
    setAuthenticated(false);
  }, []);

  return { authenticated, logout, refresh: sync };
}
