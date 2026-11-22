'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import idMessages from '../../messages/id.json';
import { buildLocaleCookieHeader, resolveLocale, type Locale } from '@/i18n/config';

const MESSAGES_BY_LOCALE = {
  en: enMessages,
  id: idMessages,
} as const;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  initialLocale: Locale;
  children: React.ReactNode;
}

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale(initialLocale));

  const setLocale = useCallback((nextLocale: Locale) => {
    const resolved = resolveLocale(nextLocale);

    setLocaleState((current) => (current === resolved ? current : resolved));

    if (typeof document !== 'undefined') {
      try {
        const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
        document.cookie = buildLocaleCookieHeader(resolved, isSecure);
      } catch {
        // Gracefully keep in-memory locale if cookie persistence is blocked
      }

      document.documentElement.lang = resolved;
      const nextMeta = MESSAGES_BY_LOCALE[resolved].meta;
      document.title = nextMeta.title;

      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', nextMeta.description);
      }
    }
  }, []);

  const contextValue = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES_BY_LOCALE[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleSwitch(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocaleSwitch must be used within a LocaleProvider');
  }
  return ctx;
}
