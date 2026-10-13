"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BRAND_NAME, OWNER_NAME, PRICE_FROM_LABEL, contactEmail } from "@/config/site";
import { copy, type Copy, type Locale } from "@/lib/copy";

const STORAGE_KEY = "site-locale";

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Copy;
  text: (template: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore private-mode quota errors */
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es") setLocaleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const privacy = window.location.pathname.startsWith("/privacidad");
    if (privacy) {
      document.title = locale === "es" ? `Privacidad — ${BRAND_NAME}` : `Privacy — ${BRAND_NAME}`;
    } else {
      document.title =
        locale === "es"
          ? `${BRAND_NAME} — Layout conceptual GMP`
          : `${BRAND_NAME} — Conceptual GMP layout`;
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const vars = {
      brand: BRAND_NAME,
      owner: OWNER_NAME,
      email: contactEmail,
      price: PRICE_FROM_LABEL,
    };
    return {
      locale,
      setLocale,
      t: copy[locale],
      text: (template: string) => fill(template, vars),
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
