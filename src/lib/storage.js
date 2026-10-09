/** Synchronisation légère entre composants (sans localStorage). */

export const WEDDING_STORE_EVENT = "wedding-store-change";

export function notifyStoreChange(scope) {
  window.dispatchEvent(new CustomEvent(WEDDING_STORE_EVENT, { detail: { scope } }));
}

export function subscribeStoreChange(onScope) {
  const onCustom = (e) => onScope(e.detail?.scope);
  window.addEventListener(WEDDING_STORE_EVENT, onCustom);
  return () => window.removeEventListener(WEDDING_STORE_EVENT, onCustom);
}

const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export { wait };
