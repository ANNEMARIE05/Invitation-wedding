const SESSION_KEY = "wedding.couple.session";
const SESSION_MS = 1000 * 60 * 60 * 12;

export function getExpectedPassword() {
  return (process.env.REACT_APP_COUPLE_PASSWORD || "").trim();
}

export function isPasswordConfigured() {
  return getExpectedPassword().length > 0;
}

export function isCoupleAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { exp } = JSON.parse(raw);
    if (!exp || Date.now() > exp) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** @returns {{ ok: true } | { ok: false, reason: 'invalid' | 'no_password' }} */
export function coupleLogin(password) {
  const expected = getExpectedPassword();
  if (!expected) return { ok: false, reason: "no_password" };
  if (password !== expected) return { ok: false, reason: "invalid" };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + SESSION_MS }));
  window.dispatchEvent(new Event("couple-auth-change"));
  return { ok: true };
}

export function coupleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("couple-auth-change"));
}
