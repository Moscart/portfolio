import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeNextThemeOverride,
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

test('safe storage helpers never throw when localStorage throws SecurityError', () => {
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
});

test('getThemeInitScript contains try/catch, meta color-scheme update, and .dark toggle', () => {
  const script = getThemeInitScript();
  assert.ok(script.includes('try'));
  assert.ok(script.includes('meta[name="color-scheme"]'));
  assert.ok(script.includes('prefers-color-scheme: dark'));
  assert.ok(script.includes("classList.toggle('dark'"));
});
