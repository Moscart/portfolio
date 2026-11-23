export const LOCALES = ['en', 'id'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const DEFAULT_TIME_ZONE = 'Asia/Jakarta';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Safely resolves an arbitrary cookie value into a supported portfolio locale,
 * normalizing whitespace/casing and falling back to DEFAULT_LOCALE ('en').
 */
export function resolveLocale(value?: unknown): Locale {
  if (typeof value !== 'string') return DEFAULT_LOCALE;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'id') return 'id';
  if (normalized === 'en') return 'en';
  return DEFAULT_LOCALE;
}

/**
 * Builds a first-party Set-Cookie / document.cookie assignment string for persisting
 * the active locale across SSR reloads without altering URLs.
 */
export function buildLocaleCookieHeader(locale: Locale, secure = false): string {
  const safeLocale = resolveLocale(locale);
  return `${LOCALE_COOKIE_NAME}=${safeLocale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure ? '; Secure' : ''}`;
}
