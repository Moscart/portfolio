'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';
import {
  computeNextThemeOverride,
  resolveEffectiveDark,
  safeReadThemeOverride,
  safeWriteThemeOverride,
  THEME_STORAGE_KEY,
  toMetaColorScheme,
  type ThemeOverride,
} from '@/lib/theme-logic';

interface ThemeSnapshot {
  override: ThemeOverride;
  systemPrefersDark: boolean;
}

interface ThemeContextValue {
  isDark: boolean;
  override: ThemeOverride;
  toggleTheme: () => void;
}

const SERVER_SNAPSHOT: ThemeSnapshot = {
  override: null,
  systemPrefersDark: false,
};

let clientSnapshot: ThemeSnapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function applyThemeToDocument(override: ThemeOverride, systemPrefersDark: boolean) {
  if (typeof document === 'undefined') return;
  const effectiveDark = resolveEffectiveDark(override, systemPrefersDark);
  const root = document.documentElement;
  root.classList.toggle('dark', effectiveDark);
  root.classList.toggle('light', override === 'light');

  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute('content', toMetaColorScheme(override));
  }
}

function ensureClientInitialized() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  const override = safeReadThemeOverride(window.localStorage);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  clientSnapshot = { override, systemPrefersDark };
}

function getClientSnapshot(): ThemeSnapshot {
  ensureClientInitialized();
  return clientSnapshot;
}

function getServerSnapshot(): ThemeSnapshot {
  return SERVER_SNAPSHOT;
}

function subscribeThemeStore(callback: () => void): () => void {
  ensureClientInitialized();
  listeners.add(callback);

  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(callback);
    };
  }

  const mql = window.matchMedia('(prefers-color-scheme: dark)');

  const handleMediaChange = (event: MediaQueryListEvent) => {
    // Keep existing explicit override intact when OS preference changes.
    clientSnapshot = {
      override: clientSnapshot.override,
      systemPrefersDark: event.matches,
    };
    applyThemeToDocument(clientSnapshot.override, clientSnapshot.systemPrefersDark);
    emitChange();
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
    const nextOverride = safeReadThemeOverride(window.localStorage);
    clientSnapshot = {
      override: nextOverride,
      systemPrefersDark: mql.matches,
    };
    applyThemeToDocument(clientSnapshot.override, clientSnapshot.systemPrefersDark);
    emitChange();
  };

  mql.addEventListener('change', handleMediaChange);
  window.addEventListener('storage', handleStorageChange);

  return () => {
    listeners.delete(callback);
    mql.removeEventListener('change', handleMediaChange);
    window.removeEventListener('storage', handleStorageChange);
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeThemeStore, getClientSnapshot, getServerSnapshot);
  const isDark = resolveEffectiveDark(snapshot.override, snapshot.systemPrefersDark);

  useEffect(() => {
    applyThemeToDocument(snapshot.override, snapshot.systemPrefersDark);
  }, [snapshot.override, snapshot.systemPrefersDark]);

  const toggleTheme = useCallback(() => {
    const systemPrefersDark =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : snapshot.systemPrefersDark;

    const { nextOverride } = computeNextThemeOverride(clientSnapshot.override, systemPrefersDark);
    if (typeof window !== 'undefined') {
      safeWriteThemeOverride(window.localStorage, nextOverride);
    }
    clientSnapshot = {
      override: nextOverride,
      systemPrefersDark,
    };
    applyThemeToDocument(nextOverride, systemPrefersDark);
    emitChange();
  }, [snapshot.systemPrefersDark]);

  return (
    <ThemeContext.Provider value={{ isDark, override: snapshot.override, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
