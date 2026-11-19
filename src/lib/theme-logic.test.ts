import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeNextThemeOverride,
  getSafeLocalStorage,
  getThemeInitScript,
  resolveEffectiveDark,
  safeReadThemeOverride,
  safeWriteThemeOverride,
} from './theme-logic.ts';

test('two-state dark mode toggle overrides against OS and reverts to system when matching OS', () => {
  // Start: OS is light, no stored override -> user toggles -> stores 'dark'
  const step1 = computeNextThemeOverride(null, false);
  assert.deepEqual(step1, {
    nextOverride: 'dark',
    metaColorScheme: 'dark',
    effectiveDark: true,
  });

  // OS changes to dark while 'dark' is stored -> effective stays dark, override NOT cleared automatically
  assert.equal(resolveEffectiveDark('dark', true), true);

  // User toggles while OS is light and 'dark' is stored -> target is light (matches OS) -> clears override!
  const step2 = computeNextThemeOverride('dark', false);
  assert.deepEqual(step2, {
    nextOverride: null,
    metaColorScheme: 'light dark',
    effectiveDark: false,
  });

  // Start: OS is dark, no stored override -> user toggles -> stores 'light'
  const step3 = computeNextThemeOverride(null, true);
  assert.deepEqual(step3, {
    nextOverride: 'light',
    metaColorScheme: 'light',
    effectiveDark: false,
  });

  // While OS is dark and 'light' is stored -> user toggles -> target is dark (matches OS) -> clears override!
  const step4 = computeNextThemeOverride('light', true);
  assert.deepEqual(step4, {
    nextOverride: null,
    metaColorScheme: 'light dark',
    effectiveDark: true,
  });
});

test('safe storage helpers never throw when localStorage methods or window.localStorage getter throw SecurityError', () => {
  const brokenStorage = {
    getItem() {
      throw new Error('SecurityError');
    },
    setItem() {
      throw new Error('SecurityError');
    },
    removeItem() {
      throw new Error('SecurityError');
    },
  };
  assert.equal(safeReadThemeOverride(brokenStorage), null);
  assert.doesNotThrow(() => safeWriteThemeOverride(brokenStorage, 'dark'));
  assert.doesNotThrow(() => safeWriteThemeOverride(brokenStorage, null));

  const throwingWindow = Object.defineProperty({}, 'localStorage', {
    get() {
      throw new Error('SecurityError');
    },
  }) as { localStorage?: Storage };
  assert.equal(getSafeLocalStorage(throwingWindow), null);
});

test('getThemeInitScript applies dark OS theme even when localStorage throws and avoids mutating React-managed <meta> before hydration', () => {
  const script = getThemeInitScript();
  assert.equal(
    script.includes('meta[name="color-scheme"]'),
    false,
    'Init script must not mutate React 19 hoistable <meta> before hydration',
  );

  const classes = new Set<string>();
  const style: Record<string, string> = {};
  const fakeDocument = {
    documentElement: {
      style,
      classList: {
        toggle(name: string, force?: boolean) {
          if (force) classes.add(name);
          else classes.delete(name);
        },
      },
    },
  };
  const fakeWindow = {
    matchMedia: (q: string) => ({ matches: q.includes('dark') }),
  };
  const throwingLocalStorage = {
    getItem() {
      throw new Error('SecurityError');
    },
  };

  const runner = new Function('window', 'document', 'localStorage', script);
  assert.doesNotThrow(() => runner(fakeWindow, fakeDocument, throwingLocalStorage));
  assert.equal(
    classes.has('dark'),
    true,
    'Dark OS class must still apply when localStorage throws',
  );
  assert.equal(style.colorScheme, 'light dark');
});
