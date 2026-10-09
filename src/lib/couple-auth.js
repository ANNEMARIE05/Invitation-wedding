import { coupleLoginApi, coupleLogoutApi, getAuthStatus } from "./api";

export function isPasswordConfigured() {
  return true;
}

export async function isCoupleAuthenticated() {
  try {
    const { authenticated } = await getAuthStatus();
    return Boolean(authenticated);
  } catch {
    return false;
  }
}

/** @returns {Promise<{ ok: true } | { ok: false, reason: 'invalid' | 'no_password' | 'network' }>} */
export async function coupleLogin(password) {
  try {
    await coupleLoginApi(password);
    window.dispatchEvent(new Event("couple-auth-change"));
    return { ok: true };
  } catch (e) {
    if (e.code === "no_password") return { ok: false, reason: "no_password" };
    if (e.status === 401) return { ok: false, reason: "invalid" };
    return { ok: false, reason: "network" };
  }
}

export async function coupleLogout() {
  try {
    await coupleLogoutApi();
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("couple-auth-change"));
}
