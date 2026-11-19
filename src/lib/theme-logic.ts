export type ThemeOverride = 'light' | 'dark' | null;

export type MetaColorScheme = 'light' | 'dark' | 'light dark';

export const THEME_STORAGE_KEY = 'theme';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function normalizeThemeOverride(raw: string | null | undefined): ThemeOverride {
  if (raw === 'light' || raw === 'dark') return raw;
  return null;
}

export function resolveEffectiveDark(override: ThemeOverride, systemPrefersDark: boolean): boolean {
  if (override === 'dark') return true;
  if (override === 'light') return false;
  return systemPrefersDark;
}

export function toMetaColorScheme(override: ThemeOverride): MetaColorScheme {
  if (override === 'dark') return 'dark';
  if (override === 'light') return 'light';
  return 'light dark';
}

/**
 * Implements two-state toggle semantics (modern-web-guidance: dark-mode-toggle):
 * - Target scheme is the opposite of the currently rendered scheme.
 * - If target differs from OS preference, store it literally.
 * - If target matches OS preference, clear storage so the site follows OS again.
 * - Divergence is checked only at toggle time, never retroactively on OS change.
 */
export function computeNextThemeOverride(
  currentOverride: ThemeOverride,
  systemPrefersDark: boolean,
): {
  nextOverride: ThemeOverride;
  metaColorScheme: MetaColorScheme;
  effectiveDark: boolean;
} {
  const currentlyDark = resolveEffectiveDark(currentOverride, systemPrefersDark);
  const targetDark = !currentlyDark;
  const targetScheme: Exclude<ThemeOverride, null> = targetDark ? 'dark' : 'light';
  const matchesSystem = targetDark === systemPrefersDark;
  const nextOverride: ThemeOverride = matchesSystem ? null : targetScheme;

  return {
    nextOverride,
    metaColorScheme: toMetaColorScheme(nextOverride),
    effectiveDark: targetDark,
  };
}

export function safeReadThemeOverride(storage?: StorageLike | null): ThemeOverride {
  if (!storage) return null;
  try {
    return normalizeThemeOverride(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function safeWriteThemeOverride(
  storage: StorageLike | null | undefined,
  override: ThemeOverride,
): void {
  if (!storage) return;
  try {
    if (override === null) {
      storage.removeItem(THEME_STORAGE_KEY);
    } else {
      storage.setItem(THEME_STORAGE_KEY, override);
    }
  } catch {
    // Still allow in-memory theme switching when storage is blocked (e.g. privacy mode / iframes)
  }
}

/**
 * Minimal blocking inline script injected in <head> right after <meta name="color-scheme">
 * to prevent a flash of wrong theme before hydration.
 */
export function getThemeInitScript(): string {
  return `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var o=(s==='light'||s==='dark')?s:null;var m=document.querySelector('meta[name="color-scheme"]');if(m){m.setAttribute('content',o||'light dark');}var d=o?o==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.classList.toggle('light',o==='light');}catch(e){}})();`;
}
