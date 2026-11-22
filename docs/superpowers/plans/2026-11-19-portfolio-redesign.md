# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Daniel Theo Santoso's portfolio on branch `redesign` to faithfully implement all 5 redesign pages of `figcraft/design.figcraft` using shadcn/ui (Base UI `base-nova` + `@tabler/icons-react`), Tailwind CSS v4 design tokens, 4 responsive breakpoints, zero-FOUC dark mode, cookie-only `next-intl` (EN/ID), Motion animations, and complete `.aistudio` removal with renamed profile photo.

**Architecture:** Next.js 16 App Router Server Component layout reads the `NEXT_LOCALE` cookie via `next-intl` (`getRequestConfig`, no URL routing) and injects a blocking anti-FOUC `color-scheme`/`.dark` init script before hydration. A modular client shell (`PortfolioShell`) wrapped in `MotionConfig reducedMotion="user"` renders alternating surface sections (`Hero`, `SelectedWork`, `Experience`, `Writing`, `ContactFooter`) plus Base UI overlays (`MobileNavDrawer`, responsive `CaseStudyModal`, `ClipboardToast`), styled exclusively via semantic Tailwind v4 tokens defined in `src/app/globals.css`.

**Tech Stack:** Next.js 16.4.6, React 19.3.1, TypeScript 5.9, Tailwind CSS v4 (`@tailwindcss/turbopack`), shadcn/ui v4 (`@base-ui/react`, `base-nova`), `@tabler/icons-react`, `next-intl`, `motion` (`motion/react`), Node 24 native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-19-portfolio-redesign-design.md`

## Global Constraints

- Work exclusively on git branch `redesign` (never commit to `main`).
- Zero `.aistudio` directories, `ai-studio-applet` names, `GEMINI_API_KEY`, `metadata.json`, or `ais-pre-*.run.app` URLs remain anywhere in the repo.
- Owner portrait moved and renamed to `public/images/daniel-profile.webp` (plus `public/images/daniel-profile-og.jpg` derivative for `next/og` `ImageResponse`, which does not rasterize WebP).
- UI primitives use `@base-ui/react` (`style: "base-nova"`, `iconLibrary: "tabler"`) with Base UI `render` prop — zero `@radix-ui/*` packages or `asChild` usage.
- `next-intl` uses cookie `NEXT_LOCALE` only (default `'en'`) — zero `/en` or `/id` URL segments and zero locale-prefix middleware.
- Strict 4px scale (`--radius: 0.5rem`), unified Brand Orange `#F54900`, exact FigCraft Light (`:root`) and Dark (`.dark`) tokens, and 4 breakpoints: Mobile `<768px` (`375px`), Tablet `md: 768px`, Laptop `lg: 1024px`, Desktop `2xl: 1440px` (`--breakpoint-2xl: 90rem`), centered `max-w-[1008px]`.
- Copywriting matches `figcraft/design.figcraft` EN & ID verbatim; `CaseStudyModal` opens for Featured **Betty**, while secondary project cards (`Rekadigi & DRI Web`, `Cinematch`, `Client Web Suite`) are interactive external `<a>` cards with hover elevation + orange `↗` cue.
- Dark mode follows `modern-web-guidance`: `<meta name="color-scheme" content="light dark">`, `:root { color-scheme: light dark; }`, blocking anti-FOUC script, two-state toggle reverting to OS when matching OS, no CSS transitions on `scrollbar-color`, and WebKit scrollbar fallback inside `@supports not (scrollbar-color: auto)`.
- All animations use `motion/react` under `<MotionConfig reducedMotion="user">`, animating compositor-only properties (`transform`, `opacity`).

## Review Focus

1. **Corrupted or unexpected `NEXT_LOCALE` cookie values** (e.g., `"fr"`, `""`, `" ID "`): `resolveLocale` must normalize valid values and fall back to `'en'` so dynamic JSON message imports never throw. (Pinned by test in Task 3.)
2. **Blocked `localStorage` (`SecurityError` in strict privacy/iframe modes)**: theme initialization script and toggle handler must catch storage failures and still switch theme in memory without throwing. (Pinned by test in Task 4.)
3. **OS theme change while user has pinned an explicit override**: `prefers-color-scheme` changes must NOT delete a stored override when OS coincides with it; stored override is only removed when the user explicitly toggles back to match OS. (Pinned by test in Task 4.)
4. **SSR/hydration mismatch on theme icon or `<html>` class**: both Sun and Moon icons render in markup and toggle via CSS (`.dark`), avoiding React hydration mismatch before client mount. (Pinned in Task 5 & verified in Task 7 browser console.)
5. **Clipboard failure & rapid repeated clicks on Copy Email**: clipboard rejection must not cause unhandled promise rejections, and repeated clicks within 2s must cleanly reset the 2000ms confirmation/toast timer. (Pinned by test in Task 6.)

---

### Task 1: `.aistudio` Cleanup, Profile Photo Migration & Site Metadata Foundation

**Files:**

- Move/Create: `public/images/daniel-profile.webp`, `public/images/daniel-profile-og.jpg`
- Delete: `.aistudio/`, `public/assets/`, `metadata.json`, `.eslintrc.json`, `src/components/ProjectBentoCard.tsx`, `src/components/CommandPalette.tsx`, `src/components/CaseStudyModal.tsx`, `src/components/InteractiveLab.tsx`, `src/components/ContactEstimator.tsx`, `src/components/ProfilePhotoCard.tsx`, `src/lib/portfolio-logic.ts`, `src/lib/portfolio-logic.test.ts`
- Modify: `package.json`, `.env.example`, `.prettierignore`, `src/lib/site-config.ts`, `src/lib/og-card.tsx`, `src/app/manifest.ts`, `src/app/icon.svg`, `src/app/apple-icon.tsx`, `public/favicon.svg`, `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`
- Test: `src/lib/site-config.test.ts`

**Interfaces:**

- Produces:
  - `getSiteUrl(env?: Record<string, string | undefined>): string` in `src/lib/site-config.ts`
  - `SITE_CONFIG` (`name`, `shortName`, `role`, `title`, `description`, `location`, `email`, `linkedinUrl`, `githubUrl`, `mediumUrl`, `bettyUrl`, `profileImagePath: '/images/daniel-profile.webp'`, `ogProfileImagePath: '/images/daniel-profile-og.jpg'`, `keywords`) in `src/lib/site-config.ts`

- [ ] **Step 1: Write the failing test `src/lib/site-config.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getSiteUrl, SITE_CONFIG } from './site-config.ts';

test('SITE_CONFIG points to renamed profile images and has zero aistudio references', () => {
  assert.equal(SITE_CONFIG.profileImagePath, '/images/daniel-profile.webp');
  assert.equal(SITE_CONFIG.ogProfileImagePath, '/images/daniel-profile-og.jpg');
  assert.equal(SITE_CONFIG.mediumUrl, 'https://medium.com/@daniel.theo');
  assert.equal(SITE_CONFIG.bettyUrl, 'https://betty.id');
  assert.ok(existsSync(join(process.cwd(), 'public', 'images', 'daniel-profile.webp')));
  assert.ok(existsSync(join(process.cwd(), 'public', 'images', 'daniel-profile-og.jpg')));
  assert.equal(existsSync(join(process.cwd(), '.aistudio')), false);
  assert.equal(existsSync(join(process.cwd(), 'metadata.json')), false);
  assert.equal(existsSync(join(process.cwd(), 'public', 'assets', 'aistudio')), false);
});

test('getSiteUrl falls back to canonical domain without aistudio cloud run URL', () => {
  const fallback = getSiteUrl({});
  assert.equal(fallback, 'https://danieltheo.dev');
  assert.equal(fallback.includes('ais-pre-'), false);
  assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://example.com/' }), 'https://example.com');
  assert.equal(
    getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.vercel.app' }),
    'https://portfolio.vercel.app',
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/site-config.test.ts`
Expected: FAIL (missing `daniel-profile.webp`, `.aistudio` still exists, `getSiteUrl` returns `ais-pre-...run.app`).

- [ ] **Step 3: Migrate profile photo, generate OG JPEG derivative, and remove `.aistudio` & legacy prototype files**

- Copy `public/assets/aistudio/IMG_20260221_094158_522_9c399076.webp` → `public/images/daniel-profile.webp`.
- Generate `public/images/daniel-profile-og.jpg` (cropped square 512×512 JPEG from `daniel-profile.webp` using Python Pillow or `ffmpeg`/`convert` — check available CLI tool first).
- Remove `.aistudio/`, `public/assets/`, `metadata.json`, `.eslintrc.json`, and unused legacy files listed above (`ProjectBentoCard.tsx`, `CommandPalette.tsx`, `CaseStudyModal.tsx`, `InteractiveLab.tsx`, `ContactEstimator.tsx`, `ProfilePhotoCard.tsx`, `portfolio-logic.ts`, `portfolio-logic.test.ts`).
- Remove `lenis` and `lucide-react` from `package.json` via `pnpm remove lenis lucide-react`, update `"name": "daniel-theo-portfolio"`, and add `"test": "node --test \"src/**/*.test.ts\""` to `package.json` `scripts`.
- Clean `.prettierignore` (remove `.aistudio/`) and `.env.example` (replace Gemini AI Studio env vars with `NEXT_PUBLIC_SITE_URL="https://danieltheo.dev"`).

- [ ] **Step 4: Update `src/lib/site-config.ts`, `src/lib/og-card.tsx`, icons & manifest to unified `#F54900` / `#09090B` brand**

- Refactor `getSiteUrl(env = process.env)` in `src/lib/site-config.ts` with `DEFAULT_SITE_URL = 'https://danieltheo.dev'`, adding `mediumUrl: 'https://medium.com/@daniel.theo'`, `bettyUrl: 'https://betty.id'`, `profileImagePath: '/images/daniel-profile.webp'`, `ogProfileImagePath: '/images/daniel-profile-og.jpg'`, and role `'Lead Frontend Engineer'`.
- Update `src/lib/og-card.tsx` to load `public/images/daniel-profile-og.jpg`, use `#09090B` background, `#18181B` cards, `#F54900` brand orange, and updated Lead Frontend Engineer headline.
- Update `#0B0C0E` → `#09090B` and `#F97316` → `#F54900` in `src/app/manifest.ts`, `src/app/icon.svg`, `src/app/apple-icon.tsx`, `public/favicon.svg`, `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`.
- Temporarily update `src/app/page.tsx` to a minimal placeholder if needed so `tsc --noEmit` stays green after deleting legacy components (will be replaced in Task 6).

- [ ] **Step 5: Run tests and verify zero `.aistudio` traces**

Run: `node --test src/lib/site-config.test.ts && pnpm typecheck`
Expected: PASS (2 tests pass, 0 TypeScript errors).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove aistudio artifacts, rename profile photo, update site config"
```

---

### Task 2: Install shadcn/ui (Base UI `base-nova` + `@tabler/icons-react`) & Design System `globals.css`

**Files:**

- Create: `components.json`, `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/avatar.tsx`, `src/components/ui/separator.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/kbd.tsx`
- Modify: `package.json`, `pnpm-lock.yaml`, `src/app/globals.css`
- Test: `src/app/globals.test.ts`

**Interfaces:**

- Produces:
  - shadcn/ui Base UI components under `@/components/ui/*` (`Button`, `Badge`, `Avatar`, `AvatarImage`, `AvatarFallback`, `Separator`, `Dialog*`, `Sheet*`, `Kbd`) using `@base-ui/react` and `@tabler/icons-react`.
  - Complete Tailwind CSS v4 Design System variables and utilities in `src/app/globals.css` (`bg-background`, `bg-secondary`, `bg-card`, `bg-muted`, `bg-accent`, `text-foreground`, `text-muted-foreground`, `text-accent-foreground`, `text-body`, `text-secondary-ink`, `border-border`, `border-subtle`, `ring-ring`, `font-display`, `font-sans`, `font-mono`, `2xl:` at `90rem` / `1440px`).

- [ ] **Step 1: Write the failing test `src/app/globals.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

test('components.json configures shadcn base-nova with tabler icons and Tailwind v4', () => {
  const configPath = join(process.cwd(), 'components.json');
  assert.ok(existsSync(configPath), 'components.json must exist');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  assert.equal(config.style, 'base-nova');
  assert.equal(config.iconLibrary, 'tabler');
  assert.equal(config.tailwind.css, 'src/app/globals.css');
  assert.equal(config.tailwind.config, '');
  assert.equal(config.tailwind.cssVariables, true);
});

test('shadcn ui components use @base-ui/react and zero @radix-ui imports', () => {
  const uiDir = join(process.cwd(), 'src', 'components', 'ui');
  assert.ok(existsSync(uiDir), 'src/components/ui directory must exist');
  const files = readdirSync(uiDir).filter((f) => f.endsWith('.tsx'));
  for (const required of [
    'button.tsx',
    'badge.tsx',
    'avatar.tsx',
    'separator.tsx',
    'dialog.tsx',
    'sheet.tsx',
    'kbd.tsx',
  ]) {
    assert.ok(files.includes(required), `Missing shadcn component: ${required}`);
  }
  for (const file of files) {
    const content = readFileSync(join(uiDir, file), 'utf8');
    assert.equal(content.includes('@radix-ui'), false, `${file} must not import @radix-ui`);
  }
});

test('globals.css implements FigCraft Design System light/dark tokens, 1440px breakpoint, and modern dark/scrollbar rules', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');
  for (const expected of [
    '--primary: #f54900',
    '--background: #ffffff',
    '--background: #09090b',
    '--secondary: #f7f7f8',
    '--secondary: #111113',
    '--card: #18181b',
    '--accent-foreground: #c2410c',
    '--accent-foreground: #ff7a3d',
    '--ring: #f54900',
    '--ring: #ff6b2b',
    '--radius: 0.5rem',
    '--breakpoint-2xl: 90rem',
    'color-scheme: light dark',
    '@supports not (scrollbar-color: auto)',
  ]) {
    assert.ok(
      css.toLowerCase().includes(expected.toLowerCase()),
      `globals.css missing: ${expected}`,
    );
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/app/globals.test.ts`
Expected: FAIL (`components.json` missing, `src/components/ui` missing, `globals.css` lacks design system tokens).

- [ ] **Step 3: Initialize shadcn/ui (Base UI `base-nova`) and install components + `@tabler/icons-react`**

- Run `pnpm dlx shadcn@latest init --base base -y` (check generated `components.json`; ensure `"style": "base-nova"`, `"iconLibrary": "tabler"`, `"tailwind.css": "src/app/globals.css"`, `"tailwind.config": ""`, `"rsc": true`).
- Install `@tabler/icons-react` via `pnpm add @tabler/icons-react`.
- Add components via `pnpm dlx shadcn@latest add button badge avatar separator dialog sheet kbd -y`.
- Verify none of the generated files import `@radix-ui/*` or `lucide-react` (update icon imports in generated `dialog.tsx` / `sheet.tsx` to `@tabler/icons-react` if CLI defaulted to another icon set).

- [ ] **Step 4: Implement FigCraft Design System tokens in `src/app/globals.css`**

Write `src/app/globals.css` with:

- `@import "tailwindcss";` and `@import "tw-animate-css";` (if installed by shadcn init) + `@custom-variant dark (&:where(.dark, .dark *));`
- `@theme inline` mapping all shadcn & custom tokens (`--color-background`, `--color-foreground`, `--color-card`, `--color-card-foreground`, `--color-popover`, `--color-popover-foreground`, `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-secondary-foreground`, `--color-muted`, `--color-muted-foreground`, `--color-accent`, `--color-accent-foreground`, `--color-destructive`, `--color-destructive-foreground`, `--color-border`, `--color-border-subtle`, `--color-input`, `--color-ring`, `--color-text-secondary`, `--color-text-body`, `--color-status-available`, `--font-display`, `--font-sans`, `--font-mono`, strict 4px radii `--radius-xs: 2px` through `--radius-xl: 16px`, and `--breakpoint-2xl: 90rem`).
- `:root` light-mode hex variables verbatim from Spec Section 5.2, plus `color-scheme: light dark;` with `:root:has(> head > meta[name="color-scheme"][content="dark"])` / `.dark` setting `color-scheme: dark` and `content="light"` / `.light` setting `color-scheme: light`.
- `.dark` dark-mode hex variables verbatim from Spec Section 5.2.
- `@layer base` setting clean defaults (`html` scroll-behavior smooth under `prefers-reduced-motion: no-preference`, `scrollbar-width: thin` + `scrollbar-color` with zero transition, `@supports not (scrollbar-color: auto)` resetting `scrollbar-width: auto` and applying legacy `::-webkit-scrollbar` fallback, `accent-color: var(--primary)`, and `:focus-visible` 2px ring using `var(--ring)`).

- [ ] **Step 5: Run tests and typecheck**

Run: `node --test src/app/globals.test.ts && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components.json package.json pnpm-lock.yaml src/app/globals.css src/app/globals.test.ts src/components/ui
git commit -m "feat: install shadcn base-ui and implement design system tokens in globals.css"
```

---

### Task 3: Cookie-Only `next-intl` Internationalization & Bilingual Copy (`EN` / `ID`)

**Files:**

- Create: `src/i18n/config.ts`, `src/i18n/request.ts`, `src/i18n/actions.ts`, `messages/en.json`, `messages/id.json`
- Modify: `next.config.ts`, `src/lib/portfolio-data.ts`
- Test: `src/i18n/config.test.ts`

**Interfaces:**

- Produces:
  - `LOCALES: readonly ['en', 'id']`, `type Locale = 'en' | 'id'`, `DEFAULT_LOCALE: Locale = 'en'`, `LOCALE_COOKIE_NAME = 'NEXT_LOCALE'` in `src/i18n/config.ts`
  - `resolveLocale(value?: string | null): Locale` in `src/i18n/config.ts`
  - `setLocaleAction(locale: Locale): Promise<void>` (`'use server'`) in `src/i18n/actions.ts`
  - `FEATURED_PROJECT`, `SECONDARY_PROJECTS`, `EXPERIENCE_ITEMS`, `WRITING_ARTICLES` (structural data with IDs, URLs, stacks, flags) in `src/lib/portfolio-data.ts`
  - Complete translation dictionaries in `messages/en.json` and `messages/id.json`

- [ ] **Step 1: Write the failing test `src/i18n/config.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, resolveLocale } from './config.ts';
import {
  EXPERIENCE_ITEMS,
  FEATURED_PROJECT,
  SECONDARY_PROJECTS,
  WRITING_ARTICLES,
} from '../lib/portfolio-data.ts';

function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return collectKeys(value as Record<string, unknown>, path);
      }
      return [path];
    })
    .sort();
}

test('resolveLocale handles valid, messy, missing, and invalid cookie values safely', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(LOCALE_COOKIE_NAME, 'NEXT_LOCALE');
  assert.equal(resolveLocale(undefined), 'en');
  assert.equal(resolveLocale(null), 'en');
  assert.equal(resolveLocale(''), 'en');
  assert.equal(resolveLocale('fr'), 'en');
  assert.equal(resolveLocale('en'), 'en');
  assert.equal(resolveLocale('id'), 'id');
  assert.equal(resolveLocale(' ID '), 'id');
  assert.equal(resolveLocale('EN'), 'en');
});

test('messages/en.json and messages/id.json have identical keys, non-empty strings, and match portfolio-data IDs', () => {
  const en = JSON.parse(readFileSync(join(process.cwd(), 'messages', 'en.json'), 'utf8'));
  const id = JSON.parse(readFileSync(join(process.cwd(), 'messages', 'id.json'), 'utf8'));

  assert.deepEqual(collectKeys(en), collectKeys(id));

  assert.equal(en.hero.h1, 'Clean frontend architecture for fast, modern web apps.');
  assert.equal(id.hero.h1, 'Arsitektur frontend rapi untuk web modern yang cepat.');

  assert.ok(en.work.projects[FEATURED_PROJECT.id]);
  for (const project of SECONDARY_PROJECTS) {
    assert.ok(en.work.projects[project.id], `Missing EN copy for project ${project.id}`);
    assert.ok(id.work.projects[project.id], `Missing ID copy for project ${project.id}`);
  }
  for (const exp of EXPERIENCE_ITEMS) {
    assert.ok(en.experience.items[exp.id], `Missing EN copy for experience ${exp.id}`);
    assert.ok(id.experience.items[exp.id], `Missing ID copy for experience ${exp.id}`);
  }
  for (const article of WRITING_ARTICLES) {
    assert.ok(en.writing.articles[article.id], `Missing EN copy for article ${article.id}`);
    assert.ok(id.writing.articles[article.id], `Missing ID copy for article ${article.id}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/i18n/config.test.ts`
Expected: FAIL (`src/i18n/config.ts` does not exist yet).

- [ ] **Step 3: Install `next-intl` and wire `next.config.ts` + `src/i18n/*`**

- Run `pnpm add next-intl`.
- Update `next.config.ts` using `createNextIntlPlugin('./src/i18n/request.ts')` wrapping `nextConfig` (preserving `output: 'standalone'` and `turbopack.rules`).
- Implement `src/i18n/config.ts` (`resolveLocale` trims & lowercases input, returns `'id'` if `'id'`, else `'en'`).
- Implement `src/i18n/request.ts` reading `cookies()` via `next/headers`, resolving `LOCALE_COOKIE_NAME`, and loading `(await import(\`../../messages/\${locale}.json\`)).default`.
- Implement `src/i18n/actions.ts` (`'use server'`) exporting `setLocaleAction(locale: Locale)` which validates with `resolveLocale` and sets `NEXT_LOCALE` cookie (`path: '/'`, `maxAge: 60 * 60 * 24 * 365`, `sameSite: 'lax'`).

- [ ] **Step 4: Author `src/lib/portfolio-data.ts`, `messages/en.json`, and `messages/id.json`**

- Rewrite `src/lib/portfolio-data.ts` cleanly with typed structural records:
  - `FEATURED_PROJECT`: id `'betty'`, domain `'betty.id'`, url `'https://betty.id'`, stack `['Next.js', 'TypeScript', 'Redux', 'TanStack Query', 'Shadcn UI']`, modalStack `[..., 'next-intl']`.
  - `SECONDARY_PROJECTS`: `rekadigi` (`https://rekadigi.id`, `['Next.js', 'Tailwind', 'next-intl']`), `cinematch` (`https://github.com/Moscart`, `['React', 'TypeScript', 'Tailwind CSS']`), `client-suite` (`https://github.com/Moscart`, `['React', 'Next.js', 'Responsive UI']`).
  - `EXPERIENCE_ITEMS`: `rekadigi-lead` (`isCurrent: true`), `stt-warga`, `freelance-remote`, `javan-react`.
  - `WRITING_ARTICLES`: `husky-lint-staged` (`url: 'https://medium.com/@daniel.theo'`).
- Write `messages/en.json` and `messages/id.json` containing 100% verbatim copy from `figcraft/design.figcraft` (extracted in spec Section 8) across namespaces `meta`, `nav`, `hero`, `work`, `caseStudy`, `experience`, `writing`, `contact`, `footer`, `drawer`, `toast`, `theme`, `language`.

- [ ] **Step 5: Run tests and typecheck**

Run: `node --test src/i18n/config.test.ts && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add next.config.ts package.json pnpm-lock.yaml src/i18n src/lib/portfolio-data.ts messages
git commit -m "feat: configure cookie-only next-intl and bilingual EN/ID portfolio copy"
```

---

### Task 4: Zero-FOUC Dark Mode Engine & Root App Shell (`layout.tsx` + Providers)

**Files:**

- Create: `src/lib/theme-logic.ts`, `src/components/ThemeProvider.tsx`, `src/components/MotionProvider.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/lib/theme-logic.test.ts`

**Interfaces:**

- Consumes: `getLocale`, `getMessages` from `next-intl/server`; `SITE_CONFIG`, `getSiteUrl` from `@/lib/site-config`.
- Produces:
  - `type ThemeOverride = 'light' | 'dark' | null`
  - `THEME_STORAGE_KEY = 'theme'`
  - `resolveEffectiveDark(override: ThemeOverride, systemPrefersDark: boolean): boolean`
  - `computeNextThemeOverride(currentOverride: ThemeOverride, systemPrefersDark: boolean): { nextOverride: ThemeOverride; metaColorScheme: 'light' | 'dark' | 'light dark'; effectiveDark: boolean }`
  - `getThemeInitScript(): string`
  - `ThemeProvider` and `useTheme(): { isDark: boolean; override: ThemeOverride; toggleTheme: () => void }` in `src/components/ThemeProvider.tsx`
  - `MotionProvider` (`MotionConfig reducedMotion="user"`) in `src/components/MotionProvider.tsx`

- [ ] **Step 1: Write the failing test `src/lib/theme-logic.test.ts`**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/theme-logic.test.ts`
Expected: FAIL (`src/lib/theme-logic.ts` missing).

- [ ] **Step 3: Implement `src/lib/theme-logic.ts`, `src/components/ThemeProvider.tsx`, and `src/components/MotionProvider.tsx`**

- Implement pure functions in `src/lib/theme-logic.ts` with zero DOM assumptions in the pure helpers, plus `getThemeInitScript()` producing a minimal self-contained blocking IIFE.
- Implement `ThemeProvider.tsx`: syncs `<meta name="color-scheme">` and `document.documentElement.classList.toggle('dark', effectiveDark)`, subscribes to `matchMedia('(prefers-color-scheme: dark)')` `change` events (never deleting a stored override on OS change) and `window` `storage` events for cross-tab sync, and exposes `useTheme()`.
- Implement `MotionProvider.tsx` wrapping children in `<MotionConfig reducedMotion="user">`.

- [ ] **Step 4: Update `src/app/layout.tsx`**

- Convert `RootLayout` to `async function RootLayout`, load `locale = await getLocale()` and `messages = await getMessages()`, and replace static `metadata` with `async function generateMetadata()` using `getTranslations('meta')` so `<title>` and `<meta description>` localize with the cookie.
- Update `viewport.themeColor` to `#FFFFFF` (light) and `#09090B` (dark) with `colorScheme: 'light dark'`.
- Render `<head>` containing `<meta name="color-scheme" content="light dark" />` and `<script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />`.
- Update `Plus_Jakarta_Sans` (`400, 500, 600, 700`), `Bricolage_Grotesque` (`600, 700`), and `JetBrains_Mono` (`400, 500, 600`) CSS variables (`--font-display`, `--font-sans`, `--font-mono`).
- Update `body` classes to `bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground` and update JSON-LD (`Person.image` → `/images/daniel-profile.webp`, `sameAs` including `mediumUrl`).
- Wrap `{children}` in `<NextIntlClientProvider locale={locale} messages={messages}><ThemeProvider><MotionProvider>{children}</MotionProvider></ThemeProvider></NextIntlClientProvider>`.

- [ ] **Step 5: Run tests and typecheck**

Run: `node --test src/lib/theme-logic.test.ts && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme-logic.ts src/lib/theme-logic.test.ts src/components/ThemeProvider.tsx src/components/MotionProvider.tsx src/app/layout.tsx
git commit -m "feat: add zero-FOUC dark mode engine, MotionConfig, and next-intl RootLayout"
```

---

### Task 5: Header Navigation, Language/Theme Controls & Mobile Navigation Drawer

**Files:**

- Create: `src/lib/navigation.ts`, `src/components/LanguageToggle.tsx`, `src/components/ThemeToggle.tsx`, `src/components/MobileNavDrawer.tsx`, `src/components/Navbar.tsx`
- Test: `src/lib/navigation.test.ts`

**Interfaces:**

- Consumes: `useLocale`, `useTranslations` from `next-intl`; `setLocaleAction` from `@/i18n/actions`; `useTheme` from `@/components/ThemeProvider`; `Button`, `Sheet*` from `@/components/ui/*`; `SITE_CONFIG` from `@/lib/site-config`.
- Produces:
  - `type SectionId = 'work' | 'experience' | 'writing' | 'contact'`, `NAV_SECTIONS` (`work`, `experience`, `writing`, `contact` with `id`, `index: '01'..'04'`, `href`), and `resolveActiveSection(entries: Array<{ id: SectionId; top: number; height: number }>, viewportHeight: number, scrollY: number): SectionId | null` in `src/lib/navigation.ts`
  - `LanguageToggle({ layoutIdPrefix?: string })` in `src/components/LanguageToggle.tsx`
  - `ThemeToggle({ className?: string })` in `src/components/ThemeToggle.tsx`
  - `MobileNavDrawer({ open, onOpenChange, activeSection })` in `src/components/MobileNavDrawer.tsx`
  - `Navbar({ activeSection })` in `src/components/Navbar.tsx`

- [ ] **Step 1: Write the failing test `src/lib/navigation.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { NAV_SECTIONS, resolveActiveSection } from './navigation.ts';

test('NAV_SECTIONS exposes all 4 FigCraft navigation targets in order', () => {
  assert.deepEqual(
    NAV_SECTIONS.map((s) => ({ id: s.id, index: s.index, href: s.href })),
    [
      { id: 'work', index: '01', href: '#work' },
      { id: 'experience', index: '02', href: '#experience' },
      { id: 'writing', index: '03', href: '#writing' },
      { id: 'contact', index: '04', href: '#contact' },
    ],
  );
});

test('resolveActiveSection picks active section based on viewport top threshold', () => {
  const sections = [
    { id: 'work' as const, top: -300, height: 600 },
    { id: 'experience' as const, top: 120, height: 500 },
    { id: 'writing' as const, top: 700, height: 400 },
    { id: 'contact' as const, top: 1200, height: 400 },
  ];
  assert.equal(resolveActiveSection(sections, 900, 400), 'experience');
  assert.equal(
    resolveActiveSection(
      [
        { id: 'work', top: 600, height: 600 },
        { id: 'experience', top: 1300, height: 500 },
      ],
      900,
      0,
    ),
    null,
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/navigation.test.ts`
Expected: FAIL (`src/lib/navigation.ts` missing).

- [ ] **Step 3: Implement `src/lib/navigation.ts`, `LanguageToggle.tsx`, and `ThemeToggle.tsx`**

- Implement `NAV_SECTIONS` and `resolveActiveSection()` in `src/lib/navigation.ts`.
- Implement `LanguageToggle.tsx`: segmented `[EN | ID]` switch (`rounded-lg border border-border bg-secondary p-1`), active pill (`rounded-sm bg-card text-foreground shadow-2xs border border-border`) animated with `motion.span` `layoutId` spring (`stiffness: 420, damping: 34`), calling `setLocaleAction(nextLocale)` inside `useTransition` followed by `router.refresh()`.
- Implement `ThemeToggle.tsx`: shadcn `Button` (`variant="outline"`, `size="icon"`, `h-9 w-9` on desktop, `h-10 w-10` on mobile) rendering both `IconMoon` (visible in light via `dark:hidden`) and `IconSun` (visible in dark via `hidden dark:block`) from `@tabler/icons-react` to eliminate any SSR hydration mismatch, with orange hover border/icon and 2px focus-visible ring.

- [ ] **Step 4: Implement `MobileNavDrawer.tsx` and `Navbar.tsx`**

- Implement `MobileNavDrawer.tsx` using shadcn Base UI `Sheet` (`side="right"`, `w-full max-w-[375px] p-0 bg-background`) matching FigCraft `Mobile Navigation Drawer — 375px` (Light & Dark):
  - Top bar (`h-16 px-5 border-b border-border-subtle`): `Daniel Theo.` wordmark + `40×40` `×` close button (`IconX`).
  - Body (`px-5 py-6`): `NAVIGATION` mono eyebrow, 4 numbered links (`01`–`04`) where active item has `3px` vertical orange left bar, `bg-secondary border border-border rounded-xl`, bold `text-foreground`, and orange index; tapping closes drawer and scrolls to section.
  - Divider + `Appearance & Language` row (`LanguageToggle layoutIdPrefix="drawer"` + `ThemeToggle`).
  - Bottom pinned footer (`px-5 pb-6 pt-4`): full-width orange `Get in touch ↗` (`Button render={<a href="#contact" />}`) + 3-col grid of `GitHub`, `LinkedIn`, `Medium` outline buttons.
- Implement `Navbar.tsx`: sticky `h-16` header (`bg-background/90 backdrop-blur-md border-b border-border-subtle`), inner container (`mx-auto max-w-[1008px] px-5 md:px-8 lg:px-16 2xl:px-0`), `Daniel Theo.` brand link (orange `.`), centered `hidden md:flex items-center gap-8` nav links with animated `16px × 2px` orange active underline (`motion.span layoutId="nav-active-bar"`), right utilities (`LanguageToggle`, `ThemeToggle`, and `md:hidden` hamburger button `IconMenu2` controlling `MobileNavDrawer`).

- [ ] **Step 5: Run tests and typecheck**

Run: `node --test src/lib/navigation.test.ts && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/navigation.ts src/lib/navigation.test.ts src/components/LanguageToggle.tsx src/components/ThemeToggle.tsx src/components/MobileNavDrawer.tsx src/components/Navbar.tsx
git commit -m "feat: add sticky Navbar, LanguageToggle, ThemeToggle, and MobileNavDrawer"
```

---

### Task 6: Page Sections, Responsive Case Study Modal, Clipboard Toast & Home Assembly

**Files:**

- Create: `src/lib/clipboard.ts`, `src/components/ClipboardToast.tsx`, `src/components/CaseStudyModal.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/SelectedWorkSection.tsx`, `src/components/sections/ExperienceSection.tsx`, `src/components/sections/WritingSection.tsx`, `src/components/sections/ContactFooterSection.tsx`, `src/components/PortfolioShell.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/lib/clipboard.test.ts`

**Interfaces:**

- Consumes: `Navbar`, `NAV_SECTIONS`, `resolveActiveSection`; `useIsMobile` from `@/hooks/use-mobile`; `FEATURED_PROJECT`, `SECONDARY_PROJECTS`, `EXPERIENCE_ITEMS`, `WRITING_ARTICLES` from `@/lib/portfolio-data`; `SITE_CONFIG` from `@/lib/site-config`; `Button`, `Badge`, `Avatar*`, `Dialog*`, `Sheet*`, `Kbd`, `Separator` from `@/components/ui/*`; `@tabler/icons-react`; `motion`, `AnimatePresence` from `motion/react`; `useTranslations` from `next-intl`.
- Produces:
  - `copyTextSafely(text: string, clipboard?: { writeText(value: string): Promise<void> }): Promise<boolean>` and `createResettableTimer(durationMs: number, onExpire: () => void): { trigger(): void; cancel(): void }` in `src/lib/clipboard.ts`
  - Complete portfolio `/` page rendered via Server Component `src/app/page.tsx` → `PortfolioShell`.

- [ ] **Step 1: Write the failing test `src/lib/clipboard.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { copyTextSafely, createResettableTimer } from './clipboard.ts';

test('copyTextSafely resolves cleanly on success, missing clipboard, or rejection', async () => {
  let written = '';
  const ok = await copyTextSafely('danieltheo.73@gmail.com', {
    async writeText(val) {
      written = val;
    },
  });
  assert.equal(ok, true);
  assert.equal(written, 'danieltheo.73@gmail.com');

  assert.equal(await copyTextSafely('x', undefined), false);
  const failed = await copyTextSafely('x', {
    async writeText() {
      throw new Error('NotAllowedError');
    },
  });
  assert.equal(failed, false);
});

test('createResettableTimer resets expiration window on rapid repeated triggers', async () => {
  let expiredCount = 0;
  const timer = createResettableTimer(40, () => {
    expiredCount += 1;
  });
  timer.trigger();
  await new Promise((r) => setTimeout(r, 20));
  timer.trigger();
  await new Promise((r) => setTimeout(r, 25));
  assert.equal(expiredCount, 0, 'Should still be active after reset');
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(expiredCount, 1, 'Should expire exactly once after extended window');
  timer.cancel();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/clipboard.test.ts`
Expected: FAIL (`src/lib/clipboard.ts` missing).

- [ ] **Step 3: Implement `src/lib/clipboard.ts`, `ClipboardToast.tsx`, and `CaseStudyModal.tsx`**

- Implement `copyTextSafely()` and `createResettableTimer()` in `src/lib/clipboard.ts`.
- Implement `ClipboardToast.tsx`: fixed top-center toast (`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[335px]`) with `AnimatePresence` + `motion.div` (`y: -16 -> 0`, `opacity: 0 -> 1`), matching FigCraft `Mobile Sheet & Toast` (Light: white bg, green border `#86EFAC` / shadow; Dark: `#18181B` bg, `#166534` border; green `IconCheck`, localized text, right-aligned `2s` mono meta).
- Implement `CaseStudyModal.tsx`: uses `useIsMobile()` (`< 768px`):
  - Desktop/Tablet (`!isMobile`): shadcn Base UI `Dialog` (`max-w-[560px] rounded-2xl p-8 bg-card border-border`), top row with `● Case Study` Badge + `betty.id · 2025 – Present` mono meta + `36×36` close button, `Bricolage` H3 title, full summary, `ARCHITECTURAL HIGHLIGHTS` inset box (`bg-secondary border border-border rounded-xl p-4`) with 3 orange-dot bullets, mono stack line, `Separator`, footer with `ESC to close` left + `Close` (outline) & `Visit betty.id ↗` (primary `#F54900` using Base UI `render={<a ... />}`) right.
  - Mobile (`isMobile`): shadcn Base UI `Sheet` (`side="bottom"`, `rounded-t-2xl px-5 pt-3 pb-6 bg-card`), top `36×4` grab handle pill, `● Case Study` Badge + close button, title, concise mobile summary, highlights inset box, full-width stacked `Visit betty.id ↗` primary CTA + `Close` outline button.

- [ ] **Step 4: Implement all 5 sections matching the 4 FigCraft breakpoints, tokens, interactive states, and Motion animations**

Create:

- `src/components/sections/HeroSection.tsx`:
  - `bg-background`, padding `py-10 md:py-12 lg:py-14 2xl:pt-16 2xl:pb-14`, container `max-w-[1008px] px-5 md:px-8 lg:px-16 2xl:px-0`.
  - IdentityRow: `flex-col gap-4 md:flex-row md:items-center md:justify-between`, `Avatar` (`h-12 w-12 rounded-2xl` displaying `/images/daniel-profile.webp`), Name (`16px` SemiBold), Role/Location (`12px` muted; compact `UTC+7` on `< md`, `Surakarta, ID (UTC+7)` on `md+`), Availability pill (`rounded-full border border-border bg-secondary px-3 h-8` with green dot).
  - HeroMainCopy: H1 (`font-display font-bold text-[32px] leading-10 md:text-[40px] md:leading-[48px] lg:text-[44px] lg:leading-[52px] 2xl:text-[48px] 2xl:leading-[56px] tracking-[-0.025em] max-w-[800px]`), Bio (`text-base leading-6 lg:text-xl lg:leading-8 text-text-body max-w-[688px]`), Actions (`grid grid-cols-3 gap-2 md:flex md:items-center md:gap-3` with `Get in touch ↗` `col-span-3 md:w-auto h-11` primary `#F54900` button + `GitHub`, `LinkedIn`, `Medium` outline `h-11` buttons using Base UI `render={<a ... />}`).
  - CoreStackWrap: `Separator` + responsive strip (`flex-col gap-2 lg:flex-row lg:items-center lg:justify-between`) with `CORE STACK` mono label, stack items, and credibility meta.
- `src/components/sections/SelectedWorkSection.tsx`:
  - `id="work"`, `bg-secondary border-y border-border-subtle`, padding `py-12 md:py-14 lg:py-16 2xl:py-[72px]`.
  - Eyebrow (`w-4 h-[2px] bg-primary` + mono uppercase) + H2 (`text-2xl md:text-[28px] lg:text-[32px]`).
  - Featured **Betty** card (`bg-card border border-border rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8`): left side has `● Featured` Badge + `betty.id · 2025 – Present`, H3 (`20px md:24px`), summary, stack line; right side (`lg:w-[300px] shrink-0 bg-secondary border border-border rounded-xl p-5`) has `KEY OUTCOMES`, 3 orange-dot highlights, and `View case study ↗` orange button triggering `onOpenCaseStudy()`.
  - Secondary 3 project cards (`grid grid-cols-1 lg:grid-cols-3 gap-4`): interactive `<a>` cards (`group bg-card border border-border rounded-xl p-6 flex flex-col justify-between transition-[border-color,box-shadow,transform] duration-150 hover:border-foreground/30 hover:shadow-sm hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`), top row swaps year to orange `IconArrowUpRight` on hover/focus-within (and always keeps subtle affordance on `@media (hover: none)`).
- `src/components/sections/ExperienceSection.tsx`:
  - `id="experience"`, `bg-background`, padding `py-12 md:py-14 lg:py-16 2xl:py-[72px]`.
  - Eyebrow + H2 + 4 rows divided by `border-border-subtle`, each showing Role Title (`font-display text-lg font-semibold`), Company (`text-xs text-muted-foreground`), `● Current` / `● Saat ini` Badge + Period (wraps below company on `< md`, right-aligned on `md+`), and summary (`text-base text-text-body`).
- `src/components/sections/WritingSection.tsx`:
  - `id="writing"`, `bg-secondary border-y border-border-subtle`, padding `py-12 md:py-14 lg:py-16 2xl:py-[72px]`.
  - Header (`flex-col gap-3 md:flex-row md:items-end md:justify-between`) with right orange `All articles on Medium ↗` link.
  - Grouped `bg-card border border-border rounded-xl overflow-hidden`:
    - Article link row (`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 transition-colors duration-150 hover:bg-secondary/60 focus-visible:outline-none focus-visible:bg-primary/[0.06]`): renders `4px` orange left bar on `:focus-visible`, metadata shifts orange on hover/focus, title underlines on hover, right side shows `<Kbd className="hidden group-focus-visible:inline-flex">Enter ↵</Kbd>` beside `Read article ↗`.
    - Divider + Progressive Publishing row (`bg-secondary/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3`) with note + `Follow @daniel.theo ↗`.
- `src/components/sections/ContactFooterSection.tsx`:
  - `id="contact"`, `bg-background`, padding `pt-12 pb-8 md:pt-14 lg:pt-16 2xl:pt-[72px] 2xl:pb-10`.
  - Always-dark Anchor Card (`bg-[#18181B] border border-[#27272A] dark:border-[#3F3F46] rounded-2xl p-6 md:p-8 lg:p-10 2xl:p-12 text-[#FAFAFA]`): top row with `— CONTACT` eyebrow & green-dot `Available · Surakarta, ID (UTC+7)` (compact on mobile), Heading (`28px md:32px lg:36px`), Subcopy (`text-[#A1A1AA]`), Actions (`flex-col md:flex-row gap-3` with `Email Daniel ↗` primary orange button + Copy Email button transitioning to green `✓ Copied to clipboard!` state for 2s).
  - Footer (`mt-8 md:mt-10 lg:mt-12 pt-6 border-t border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-muted-foreground`): copyright + `LinkedIn`, `GitHub`, `Medium` links.

- [ ] **Step 5: Assemble `PortfolioShell.tsx` and update `src/app/page.tsx`**

- `PortfolioShell.tsx`: manages `activeSection` via scroll listener / `IntersectionObserver` calling `resolveActiveSection()`, `caseStudyOpen` state, `emailCopied` + `toastOpen` powered by `copyTextSafely()` and `createResettableTimer(2000)`, rendering `Navbar`, `<main>` with all 5 sections, `CaseStudyModal`, and `ClipboardToast`.
- `src/app/page.tsx`: clean Server Component rendering `<PortfolioShell />`.

- [ ] **Step 6: Run all tests, typecheck, lint, format check, and production build**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: PASS (all unit tests pass, 0 TypeScript errors, 0 ESLint errors, Next.js production build succeeds).

- [ ] **Step 7: Commit**

```bash
git add src/lib/clipboard.ts src/lib/clipboard.test.ts src/components src/app/page.tsx
git commit -m "feat: implement redesigned portfolio sections, case study overlay, and toast"
```

---

### Task 7: Live Browser Verification Across 4 Breakpoints, Dark Mode, Cookie i18n & Repo Audit

**Files:**

- Verify only (fix any visual/contrast/layout discrepancies found, then commit fixes cleanly).

- [ ] **Step 1: Verify zero `.aistudio` / `ai-studio` / `GEMINI_API_KEY` / `ais-pre` traces across repo**

Run: `grep -rn -iE "aistudio|ai-studio|ais-pre|gemini_api_key|IMG_20260221" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=figcraft --exclude-dir=docs .`
Expected: Exit code 1 (zero matches).

- [ ] **Step 2: Start local server and audit in live Chrome browser via browser subagent**

Verify at `http://localhost:3000`:

- Zero console errors or React hydration warnings.
- Breakpoints `1440×900`, `1024×768`, `768×1024`, `375×812` in both Light and Dark mode match `figcraft/design.figcraft` (no horizontal overflow, proper responsive grids/stacks, profile photo renders cleanly).
- Language toggle `EN` → `ID` updates `NEXT_LOCALE=id` cookie, translates all UI & overlays, keeps URL strictly `/`, persists on reload; toggling back to `EN` restores English.
- Dark mode toggle updates `<meta name="color-scheme">` and `.dark` class, persists on reload without white flash.
- Interactive checks: Desktop `CaseStudyModal` Dialog (`ESC` closes), Mobile `CaseStudyModal` Bottom Sheet (`375px`), Mobile Navigation Drawer (`375px`), Copy Email button (2s green feedback + top Toast), keyboard Tab focus rings (including Writing row 4px left bar + `Enter ↵` pill).

- [ ] **Step 3: Run final verification suite**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm format:check && pnpm build`
Expected: All commands exit 0 cleanly.
