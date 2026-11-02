import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getInviteByToken } from "@/lib/api";
import {
  INVITE_SESSION_KEY,
  parseInviteTokenFromLocation,
  persistInviteToken,
  readPersistedInviteToken,
} from "@/lib/invite-link";

const InviteContext = createContext(null);

export function InviteProvider({ children }) {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [info, setInfo] = useState(null);
  const [loadState, setLoadState] = useState("idle");
  const [ownerRsvpId, setOwnerRsvpId] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wedding_guest_rsvp") || "null");
      if (saved?.id) setOwnerRsvpId(saved.id);
    } catch {
      /* ignore */
    }
  }, []);

  const resolveToken = useCallback(() => {
    const fromUrl = parseInviteTokenFromLocation(location.search);
    if (fromUrl) {
      persistInviteToken(fromUrl);
      return fromUrl;
    }
    return readPersistedInviteToken();
  }, [location.search]);

  const reload = useCallback(async (activeToken) => {
    const t = String(activeToken || token || "").trim();
    if (!t) {
      setInfo(null);
      setLoadState("idle");
      return;
    }
    setLoadState("loading");
    const applyInvite = (data) => {
      if (!data) {
        setInfo(null);
        setLoadState("not_found");
        try {
          sessionStorage.removeItem(INVITE_SESSION_KEY);
        } catch {
          /* ignore */
        }
        return;
      }
      setInfo(data);
      setLoadState("ok");
    };
    try {
      applyInvite(await getInviteByToken(t));
    } catch {
      try {
        await new Promise((r) => setTimeout(r, 1200));
        applyInvite(await getInviteByToken(t));
      } catch {
        setInfo(null);
        setLoadState("error");
      }
    }
  }, [token]);

  useEffect(() => {
    const t = resolveToken();
    setToken(t);
    setInfo(null);
    if (t) {
      reload(t);
    } else {
      setLoadState("idle");
    }
  }, [resolveToken, reload]);

  const inviteLoading = loadState === "loading";
  const inviteInvalid = loadState === "not_found";
  const inviteVerifyError = loadState === "error";
  const inviteReady = loadState === "ok";

  const canRegister = useMemo(() => {
    if (!token || !info) return false;
    if (!info.used) return true;
    if (ownerRsvpId && info.rsvp_id && ownerRsvpId === info.rsvp_id) return true;
    return false;
  }, [token, info, ownerRsvpId]);

  const inviteBlocked = Boolean(
    inviteInvalid || (inviteReady && info?.used && !canRegister),
  );

  const maxAccompagnants = info?.party_size ? Math.max(0, info.party_size - 1) : null;

  const value = useMemo(
    () => ({
      token,
      info,
      loading: inviteLoading,
      inviteLoading,
      inviteReady,
      inviteVerifyError,
      canRegister,
      inviteBlocked,
      inviteInvalid,
      maxAccompagnants,
      partySize: info?.party_size ?? null,
      reload,
      setOwnerRsvpId,
    }),
    [
      token,
      info,
      inviteLoading,
      inviteReady,
      inviteVerifyError,
      canRegister,
      inviteBlocked,
      inviteInvalid,
      maxAccompagnants,
      reload,
    ],
  );

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
}

export function useInvite() {
  return useContext(InviteContext);
}
