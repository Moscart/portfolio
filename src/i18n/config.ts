export const LOCALES = ['en', 'id'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

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
