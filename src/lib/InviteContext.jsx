import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getInviteByToken } from "@/lib/api";
import {
  parseInviteTokenFromLocation,
  persistInviteToken,
  readPersistedInviteToken,
} from "@/lib/invite-link";

const InviteContext = createContext(null);

export function InviteProvider({ children }) {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ownerRsvpId, setOwnerRsvpId] = useState(null);

  const resolveToken = useCallback(() => {
    const fromUrl = parseInviteTokenFromLocation(location.search);
    if (fromUrl) {
      persistInviteToken(fromUrl);
      return fromUrl;
    }
    return readPersistedInviteToken();
  }, [location.search]);

  const reload = useCallback(async (activeToken) => {
    const t = activeToken || token;
    if (!t) {
      setInfo(null);
      return;
    }
    setLoading(true);
    try {
      const data = await getInviteByToken(t);
      setInfo(data);
    } catch {
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const t = resolveToken();
    setToken(t);
    if (t) reload(t);
    else {
      setInfo(null);
      setLoading(false);
    }
  }, [resolveToken, reload]);

  const inviteInvalid = Boolean(token && !loading && !info);

  const canRegister = useMemo(() => {
    if (!token || !info) return false;
    if (!info.used) return true;
    if (ownerRsvpId && info.rsvp_id && ownerRsvpId === info.rsvp_id) return true;
    return false;
  }, [token, info, ownerRsvpId]);

  const inviteBlocked = Boolean(
    (token && info && info.used && !canRegister) || inviteInvalid,
  );

  const maxAccompagnants = info?.party_size ? Math.max(0, info.party_size - 1) : null;

  const value = useMemo(
    () => ({
      token,
      info,
      loading,
      canRegister,
      inviteBlocked,
      inviteInvalid,
      maxAccompagnants,
      partySize: info?.party_size ?? null,
      reload,
      setOwnerRsvpId,
    }),
    [token, info, loading, canRegister, inviteBlocked, inviteInvalid, maxAccompagnants, reload],
  );

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
}

export function useInvite() {
  return useContext(InviteContext);
}
