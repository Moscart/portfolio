'use server';

import { cookies } from 'next/headers';
import { LOCALE_COOKIE_NAME, resolveLocale, type Locale } from './config';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Persists the user's selected locale in a first-party cookie without modifying URLs.
 */
export async function setLocaleAction(nextLocale: Locale): Promise<void> {
  const locale = resolveLocale(nextLocale);
  const cookieStore = await cookies();

  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
  });
}
