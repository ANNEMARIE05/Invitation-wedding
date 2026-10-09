import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { VENUE_MEDIA } from "./invite-data";
import { LOCALE_STORAGE_KEY, messages } from "./translations";

const LocaleContext = createContext(null);

export function readLocaleFromStorage() {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    return v === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

export function applyDocumentLocale(locale) {
  document.documentElement.lang = locale === "en" ? "en" : "fr";
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => readLocaleFromStorage());

  const setLocale = useCallback((next) => {
    const value = next === "en" ? "en" : "fr";
    setLocaleState(value);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    applyDocumentLocale(value);
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext)?.locale ?? "fr";
}

export function useSetLocale() {
  return useContext(LocaleContext)?.setLocale ?? (() => {});
}

/** Dictionnaire complet de la langue active */
export function useI18n() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const m = messages[locale] ?? messages.fr;
  return { locale, setLocale, m };
}

export function getLocalizedVenues(m) {
  return VENUE_MEDIA.map((base) => {
    const text = m.venues.items.find((v) => v.id === base.id) || {};
    return { ...base, ...text };
  });
}
