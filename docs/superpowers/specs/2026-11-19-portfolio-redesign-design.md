# Portfolio Redesign — Design Specification

**Date:** 2026-11-19
**Branch:** `redesign`
**Design Source:** `figcraft/design.figcraft` (5 redesign pages: `Design System`, `Home (/) — Clean Minimal`, `Home (/) — Dark Mode`, `Home (/) — Bahasa Indonesia (Light & Dark)`, `Redesign — Interactive States (Light & Dark)`)

---

## 1. Intent & Why

Redesign Daniel Theo Santoso's personal portfolio from the previous AI Studio–scaffolded prototype into a crisp, minimal, production-grade Next.js application faithfully implementing `figcraft/design.figcraft`. The redesign establishes a unified Design System powered by **shadcn/ui (Base UI / `base-nova`)** + **Tailwind CSS v4**, strict 4px spatial rhythm, unified Brand Orange (`#F54900`) across Light and Dark modes, bilingual **EN / ID** support via **`next-intl`** (cookie-only, no URL locale prefixes), **Motion (`motion/react`)** animations, and removes all `.aistudio` scaffolding artifacts while preserving the owner's profile photo.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals

- Execute all work on a dedicated `redesign` git branch (leaving `main` untouched).
- Remove every `.aistudio` artifact, directory, and reference while moving & renaming the owner's portrait (`public/assets/aistudio/IMG_20260221_094158_522_9c399076.webp` → `public/images/daniel-profile.webp`).
- Install **shadcn/ui v4** with **`@base-ui/react`** (`base-nova` style) and **`@tabler/icons-react`** icons following latest official documentation.
- Implement every Design System token from the `Design System` page in `src/app/globals.css` (`:root`, `.dark`, `@theme inline`, radii, typography variables, focus-visible ring, scrollbar styling).
- Implement all **4 responsive breakpoints** (`375px` Mobile, `768px` Tablet, `1024px` Laptop, `1440px` Desktop) and **Light / Dark mode** with zero FOUC and full system-preference compatibility.
- Match all **EN & ID copywriting** in `figcraft/design.figcraft` verbatim, powered by **`next-intl`** using a **cookie (`NEXT_LOCALE`) only** (zero URL path changes).
- Implement all **Interactive States** from FigCraft (hover, active/pressed, disabled, 2px WCAG 2.2 focus-visible rings, active nav indicator, copy-email inline feedback + toast, Desktop Case Study Dialog, Mobile Bottom Sheet, Mobile Navigation Drawer, Writing row focus bar + `Enter ↵` Kbd).
- Animate entrances, section reveals, interactive indicators, and overlays smoothly using **`motion/react`** with `MotionConfig reducedMotion="user"`.

### Non-Goals

- Multi-page routing (`/projects/[slug]`, `/blog`, `/en`, `/id`) — the portfolio remains a single-page `/` experience with in-page anchors and modal/sheet overlays.
- Backend API / CMS / database / contact form submission backend (contact uses direct `mailto:` and copy-to-clipboard).
- Replacing copywriting with custom unverified external content or custom live links not present in the repo/design (user explicitly instructed to build according to FigCraft first; copy/link refinements come later).

### Anti-Goals

- Leaving any `.aistudio` files, `ai-studio-applet` package name, `GEMINI_API_KEY`, `metadata.json`, or `ais-pre-*.run.app` URLs in the codebase.
- Using Radix UI (`@radix-ui/*`) or `asChild` instead of Base UI (`@base-ui/react` + `render` prop).
- Putting locale segments (`/en`, `/id`) in the URL or configuring `next-intl` locale-prefix middleware routing.
- Causing dark-mode flash of unstyled/wrong-theme content (FOUC) on initial page load or breaking native browser UI theming (`color-scheme`).
- Breaking keyboard accessibility, hiding interactive cues only on hover without `:focus-within` / touch fallbacks, or violating `prefers-reduced-motion`.

---

## 3. Decisions: User-Specified vs Builder Calls

### User-Specified (Fixed)

- Dedicated new git branch (`redesign`).
- Design source of truth: `figcraft/design.figcraft` inspected via FigCraft MCP.
- Copywriting: build verbatim from FigCraft EN & ID pages first; future copy/link updates happen later.
- UI primitives: **shadcn/ui (Base UI / `@base-ui/react`)** installed per latest docs.
- Styling: implement FigCraft `Design System` page tokens into `src/app/globals.css`.
- Responsive & Theme: 4 breakpoints (`375`, `768`, `1024`, `1440`) + Light & Dark mode.
- Internationalization: **`next-intl`** using **cookie only** (no URL routing).
- Animations: **`motion` (`motion/react` from motion.dev)**.
- Cleanup: remove everything `.aistudio`-related, keep user's photo and rename the file.

### Builder Default Calls (Confirmable by User)

1. **Branch name:** `redesign` (created from `main`).
2. **Default locale (when no `NEXT_LOCALE` cookie exists):** `en` (matches the primary `Home (/) — Clean Minimal` page where `EN` is active in the `[EN | ID]` toggle; switching sets `NEXT_LOCALE=id` or `NEXT_LOCALE=en` with 1-year `maxAge`).
3. **Default color theme (when no `localStorage` override exists):** follows OS `prefers-color-scheme` (`light dark` via `<meta name="color-scheme">`), with a two-state header/drawer toggle that overrides to the opposite theme and reverts to system when toggled back to match OS (per `modern-web-guidance` `dark-mode-toggle`).
4. **Icon library:** `@tabler/icons-react` (24×24 grid, 2px stroke), matching the FigCraft `Design System` page (`icons: @tabler/icons-react`) and shadcn `base-nova` configuration. `lucide-react` will be removed once replaced.
5. **Renamed profile photo path:** `public/images/daniel-profile.webp` (moved from `public/assets/aistudio/IMG_20260221_094158_522_9c399076.webp`; `public/assets/aistudio/` and `.aistudio/` deleted).
6. **External links (placeholder defaults until user updates later):**
   - Email: `danieltheo.73@gmail.com` (from existing config & FigCraft)
   - GitHub: `https://github.com/Moscart` (from existing config)
   - LinkedIn: `https://www.linkedin.com/in/daniel-theo-santoso/` (from existing config)
   - Medium profile / article: `https://medium.com/@daniel.theo` (matches `@daniel.theo` handle in FigCraft)
   - Featured project (`Betty Architecture & Enterprise Dashboard`): `View case study ↗` (and clicking the featured card action) opens `CaseStudyModal` (Desktop Dialog / Mobile Bottom Sheet) with the full FigCraft case study copy and `Visit betty.id ↗` (`https://betty.id`).
   - Secondary project cards (`Rekadigi & DRI Web`, `Cinematch`, `Client Web Suite`): rendered as interactive external link cards (`<a>` with hover border + elevation + orange `↗` cue, matching FigCraft's `Card / Hover` state), pointing to placeholder URLs (`https://rekadigi.id`, `https://github.com/Moscart`, `https://github.com/Moscart`) without inventing unverified modal copy; Case Study modals for these can be added later if desired.
7. **Indonesian translations for Interactive States:** FigCraft's `Interactive States` page shows English copy for the Case Study modal, Mobile Nav Drawer, Mobile Sheet, and Toast; corresponding natural Indonesian translations will be included in `messages/id.json` so switching to `ID` translates 100% of the UI.
8. **Legacy file cleanup:** Unused prototype components (`ProjectBentoCard.tsx`, `CommandPalette.tsx`, `CaseStudyModal.tsx`, `InteractiveLab.tsx`, `ContactEstimator.tsx`, `ProfilePhotoCard.tsx`) and unused legacy simulation code in `portfolio-logic.ts` / `portfolio-logic.test.ts` will be removed and replaced by clean modular components + unit tests targeting the redesigned portfolio logic (locale resolution, theme toggle state machine, project data integrity). `lenis` will be removed unless needed, favoring native smooth scrolling + `prefers-reduced-motion` safety (no scroll-hijacking conflicts with Base UI dialogs/sheets).
9. **Fallback `DEFAULT_SITE_URL`:** Replace the AI Studio Cloud Run URL in `src/lib/site-config.ts` with `https://danieltheo.dev` (overridable via `NEXT_PUBLIC_SITE_URL` / `VERCEL_PROJECT_PRODUCTION_URL`). `package.json` `"name"` updated from `"ai-studio-applet"` to `"daniel-theo-portfolio"`.

---

## 4. `.aistudio` Cleanup & Asset Migration

| Action        | Path / Target                                                                                        | Details                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Move & rename | `public/assets/aistudio/IMG_20260221_094158_522_9c399076.webp` → `public/images/daniel-profile.webp` | Owner's portrait used in Hero identity row (`Avatar`) and metadata `Person.image`.                                                                                                  |
| Delete        | `public/assets/`                                                                                     | Remove empty `aistudio` asset folder.                                                                                                                                               |
| Delete        | `.aistudio/`                                                                                         | Remove entire AI Studio artifacts directory.                                                                                                                                        |
| Delete        | `metadata.json`                                                                                      | AI Studio applet manifest (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).                                                                                                              |
| Clean         | `package.json`                                                                                       | Change `"name": "ai-studio-applet"` → `"daniel-theo-portfolio"`.                                                                                                                    |
| Clean         | `.env.example`                                                                                       | Remove `GEMINI_API_KEY` & AI Studio comments; document `NEXT_PUBLIC_SITE_URL` cleanly.                                                                                              |
| Clean         | `.prettierignore`                                                                                    | Remove `.aistudio/` line.                                                                                                                                                           |
| Clean         | `src/lib/site-config.ts`                                                                             | Remove `https://ais-pre-dif3f56on34skfo7csf7zo-622233591882.asia-northeast1.run.app`; update `profileImagePath` to `'/images/daniel-profile.webp'`, add `mediumUrl` and `bettyUrl`. |

---

## 5. Shadcn/UI (Base UI) & Design System (`src/app/globals.css`)

### 5.1 Shadcn Installation & Configuration

- Initialize via latest shadcn CLI v4 targeting Base UI (`--base base`, style `base-nova`, Tailwind CSS v4, CSS variables enabled, `@tabler/icons-react`):
  - `components.json`: `"style": "base-nova"`, `"rsc": true`, `"tsx": true`, `"tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "zinc", "cssVariables": true }`, `"iconLibrary": "tabler"`.
- Install required shadcn/ui Base UI components via `pnpm dlx shadcn@latest add`:
  - `button`, `badge`, `avatar`, `separator`, `dialog`, `sheet`, `drawer` (or `sheet` side="bottom" / `dialog` responsive), `kbd`, `sonner` (or custom Base UI Toast matching FigCraft toast spec — note: check shadcn Base UI `sonner` vs native styled toast for exact FigCraft 2s green-bordered top toast fidelity).
  - Always use Base UI's `render={<a ... />}` prop instead of Radix's `asChild`.

### 5.2 Design Tokens in `src/app/globals.css`

All color, surface, border, radius, typography, and breakpoint tokens exported verbatim from `figcraft/design.figcraft` (`Shadcn UI (base-ui)` + `Theme` collections):

| Token                      | Light Mode (`:root`) | Dark Mode (`.dark`) | Usage                                                                                             |
| -------------------------- | -------------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| `--background`             | `#FFFFFF`            | `#09090B`           | Main page canvas, Navbar, Hero, Experience, Contact section                                       |
| `--foreground`             | `#09090B`            | `#FAFAFA`           | Primary display/headings text                                                                     |
| `--card`                   | `#FFFFFF`            | `#18181B`           | Elevated project cards, writing card, modals                                                      |
| `--card-foreground`        | `#09090B`            | `#FAFAFA`           | Card titles & primary content                                                                     |
| `--popover`                | `#FFFFFF`            | `#18181B`           | Dialogs, sheets, drawers, toasts                                                                  |
| `--popover-foreground`     | `#09090B`            | `#FAFAFA`           | Popover primary text                                                                              |
| `--primary`                | `#F54900`            | `#F54900`           | Unified Brand Orange CTA & accents                                                                |
| `--primary-foreground`     | `#FFFFFF`            | `#FFFFFF`           | Text/icons on primary buttons                                                                     |
| `--secondary`              | `#F7F7F8`            | `#111113`           | Alternating subtle section bands (Selected Work, Writing), secondary fills                        |
| `--secondary-foreground`   | `#18181B`            | `#F4F4F5`           | Text on secondary surfaces                                                                        |
| `--muted`                  | `#F7F7F8`            | `#18181B`           | Muted panels (Key Outcomes box, toggle track)                                                     |
| `--muted-foreground`       | `#71717A`            | `#8B8B95`           | Meta labels, dates, eyebrows, captions                                                            |
| `--accent`                 | `#EFEFF1`            | `#27272A`           | Subtle hover tint surfaces                                                                        |
| `--accent-foreground`      | `#C2410C`            | `#FF7A3D`           | Accessible orange text links (WCAG AA contrast on light/dark)                                     |
| `--destructive`            | `#E7000B`            | `#FF6467`           | Error/destructive states                                                                          |
| `--destructive-foreground` | `#FFFFFF`            | `#09090B`           | Text on destructive surfaces                                                                      |
| `--border`                 | `#E4E4E7`            | `#27272A`           | Card borders, button borders, inputs                                                              |
| `--border-subtle`          | `#ECECEF`            | `#1F1F23`           | Section full-bleed 1px horizontal dividers                                                        |
| `--input`                  | `#E4E4E7`            | `#27272A`           | Form control borders                                                                              |
| `--ring`                   | `#F54900`            | `#FF6B2B`           | 2px WCAG 2.2 `:focus-visible` ring                                                                |
| `--text-secondary`         | `#27272A`            | `#E4E4E7`           | High-emphasis body / company names                                                                |
| `--text-body`              | `#52525B`            | `#A1A1AA`           | Descriptions, bio, excerpts                                                                       |
| `--status-available`       | `#16A34A`            | `#22C55E`           | Availability dot & copied success feedback                                                        |
| `--radius`                 | `0.5rem` (`8px`)     | `0.5rem` (`8px`)    | Base radius (strict 4px scale: `xs=2px`, `sm=4px`, `md=8px`, `lg=12px`, `xl=16px`, `full=9999px`) |

### 5.3 Typography & `@theme inline`

- `--font-display`: `var(--font-display)` (`Bricolage Grotesque`, weights `600`, `700`)
- `--font-sans`: `var(--font-sans)` (`Plus Jakarta Sans`, weights `400`, `500`, `600`, `700`)
- `--font-mono`: `var(--font-mono)` (`JetBrains Mono`, weights `400`, `500`, `600`)
- Breakpoint in `@theme`: `--breakpoint-2xl: 90rem;` (`1440px`) so the 4 FigCraft breakpoints map directly to `base` (`375px`), `md:` (`768px`), `lg:` (`1024px`), `2xl:` (`1440px`).
- Modern CSS rules (per `modern-web-guidance`):
  - `:root { color-scheme: light dark; }` with `:root:has(> head > meta[name="color-scheme"][content="dark"])` / `.dark { color-scheme: dark; }` and `:root:has(> head > meta[name="color-scheme"][content="light"])` / `.light { color-scheme: light; }`.
  - `scrollbar-color` without any CSS transition (avoids WebKit flicker bug); legacy `::-webkit-scrollbar` fallback strictly inside `@supports not (scrollbar-color: auto)` with `scrollbar-width: auto` reset.
  - Global `:focus-visible` rule with `2px solid var(--ring)` and `outline-offset: 2px`.

---

## 6. Dark Mode Architecture (Zero-FOUC + System Sync)

- `<meta name="color-scheme" content="light dark" />` declared via Next.js `viewport` + `<head>`.
- Tiny blocking inline script in `<head>` (wrapped in `try { ... } catch {}`) reads `localStorage.getItem('theme')` (`'light' | 'dark' | null`):
  - Sets `<meta name="color-scheme">` to `'light'`, `'dark'`, or `'light dark'`.
  - Computes effective dark state (`stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches)`) and toggles `document.documentElement.classList.toggle('dark', isDark)` immediately before first paint.
- `ThemeProvider` / `useTheme` hook:
  - Listens to `matchMedia('(prefers-color-scheme: dark)')` `change` events (updates `.dark` class live when no override is stored, never deletes stored value retroactively).
  - Listens to `window` `storage` events for cross-tab sync.
  - Two-state toggle logic: clicking switches to the opposite of currently rendered scheme. If target differs from system preference → store literal `'light'` or `'dark'`; if target matches system preference → remove from `localStorage` and reset `<meta>` to `'light dark'`.
  - Icon display uses Sun (when dark, action: switch to light) / Moon (when light, action: switch to dark) with localized `aria-label`.

---

## 7. Internationalization (`next-intl` — Cookie Only, No URL Routing)

- Install `next-intl`.
- Wrap `next.config.ts` with `createNextIntlPlugin('./src/i18n/request.ts')` (preserving `output: 'standalone'` and Turbopack config).
- `src/i18n/config.ts`:
  - `LOCALES = ['en', 'id'] as const`, `type Locale = (typeof LOCALES)[number]`, `DEFAULT_LOCALE: Locale = 'en'`, `LOCALE_COOKIE_NAME = 'NEXT_LOCALE'`.
  - Pure helper `resolveLocale(cookieValue?: string): Locale`.
- `src/i18n/request.ts`:
  - Reads `cookies()` from `next/headers`, resolves `NEXT_LOCALE`, dynamically imports `../../messages/${locale}.json`.
- `src/i18n/actions.ts` (`'use server'`):
  - `setLocaleAction(locale: Locale)` validates locale and sets `NEXT_LOCALE` cookie (`path: '/'`, `maxAge: 60 * 60 * 24 * 365`, `sameSite: 'lax'`).
- Client `LanguageToggle` component:
  - Segmented `[EN | ID]` switch matching FigCraft (`r=8px` track, `r=4px` active pill with `motion` `layoutId` transition).
  - Calls `setLocaleAction(nextLocale)` inside `useTransition`, then `router.refresh()` so Server Components + `NextIntlClientProvider` re-render in place without modifying the URL.
- `src/app/layout.tsx`:
  - Calls `getLocale()` and `getMessages()` from `next-intl/server`, sets `<html lang={locale}>`, wraps app in `<NextIntlClientProvider>`.
- Message files: `messages/en.json` and `messages/id.json` containing 100% of FigCraft's EN and ID copywriting + localized labels for Case Study modal, Mobile Drawer, Toast, ARIA labels, and SEO metadata.

---

## 8. Responsive Layout Across 4 Breakpoints & Sections

### Container & Breakpoint Matrix

| Property                  | Mobile (`< 768px`, ref `375px`)                                    | Tablet (`768px`, `md:`)                             | Laptop (`1024px`, `lg:`)                                                 | Desktop (`1440px`, `2xl:`)                                      |
| ------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Horizontal outer padding  | `20px` (`px-5`)                                                    | `32px` (`md:px-8`)                                  | `64px` (`lg:px-16`)                                                      | centered `max-w-[1008px]` (`px-0` at `1440px` = `216px` margin) |
| Navbar (`h-16` / `64px`)  | Brand + `[EN\|ID]` + Theme + Hamburger (`40×40`)                   | Brand + Center Links + `[EN\|ID]` + Theme (`36×36`) | Same (`896px` inner)                                                     | Same (`1008px` inner)                                           |
| Hero vertical padding     | `py-10` (`40px`)                                                   | `md:py-12` (`48px`)                                 | `lg:py-14` (`56px`)                                                      | `2xl:pt-16 2xl:pb-14` (`64px/56px`)                             |
| Hero Identity Row         | Vertical stack (Avatar+Name top, Availability pill below)          | Horizontal space-between                            | Horizontal space-between                                                 | Horizontal space-between                                        |
| Hero H1 (`Bricolage`)     | `32px / 40px`                                                      | `40px / 48px`                                       | `44px / 52px`                                                            | `48px / 56px` (`tracking-[-1.2px]`)                             |
| Hero Bio (`Plus Jakarta`) | `16px / 24px`                                                      | `16px / 24px`                                       | `20px / 32px`                                                            | `20px / 32px`                                                   |
| Hero Actions              | Full-width primary CTA + 3-col grid (`GitHub / LinkedIn / Medium`) | Inline horizontal row                               | Inline horizontal row                                                    | Inline horizontal row                                           |
| Core Stack Strip          | Vertical stack (label, stack, credibility)                         | 2-row stack (stack row + credibility below)         | Single horizontal space-between row                                      | Single horizontal space-between row                             |
| Section vertical padding  | `py-12` (`48px`)                                                   | `md:py-14` (`56px`)                                 | `lg:py-16` (`64px`)                                                      | `2xl:py-[72px]` (`72px`)                                        |
| Section H2 (`Bricolage`)  | `24px / 32px`                                                      | `28px / 36px`                                       | `32px / 40px`                                                            | `32px / 40px` (`tracking-[-0.6px]`)                             |
| Featured Project Card     | Vertical (Copy top, Key Outcomes panel below)                      | Vertical (Copy top, Key Outcomes panel below)       | Horizontal 2-col (Copy left, Key Outcomes right `w-[280px]`/`w-[300px]`) | Horizontal 2-col (Copy left, Key Outcomes right)                |
| Secondary 3 Project Cards | 1-column stack (`grid-cols-1`)                                     | 1-column stack (`grid-cols-1`)                      | 3-column grid (`lg:grid-cols-3`)                                         | 3-column grid (`lg:grid-cols-3`)                                |
| Experience rows           | Period + `Current` badge wraps below Company                       | Title+Company left, Badge+Period right              | Same                                                                     | Same                                                            |
| Writing Header & Card     | Header stacks; `Read article` below excerpt; footer stacks         | Header horizontal; row horizontal                   | Same                                                                     | Same                                                            |
| Contact Dark Anchor Card  | `p-6` (`24px`), heading `28px`, full-width stacked buttons         | `md:p-8` (`32px`), heading `32px`, inline buttons   | `lg:p-10` (`40px`), heading `36px`, inline buttons                       | `2xl:p-12` (`48px`), heading `36px`, inline buttons             |
| Footer                    | Vertical stack (Copyright top, Links below)                        | Horizontal space-between                            | Horizontal space-between                                                 | Horizontal space-between                                        |

### Page Sections (Alternating Surface Rhythm)

1. **Sticky Navbar** (`bg-background/90 backdrop-blur-md border-b border-border-subtle`): Brand wordmark `Daniel Theo.` (orange period), 4 nav links (`Work`, `Experience`, `Writing`, `Contact` / `Karya`, `Pengalaman`, `Tulisan`, `Kontak`) with scroll-spy active orange underline bar (`16px × 2px`), `[EN | ID]` segmented control, Theme toggle button, Mobile hamburger button (`< md`).
2. **Hero (`#hero` / top)** (`bg-background`):
   - `48×48` rounded-2xl (`16px`) Avatar (`public/images/daniel-profile.webp`), Name `Daniel Theo Santoso`, Role `Lead Frontend Engineer · Surakarta, ID (UTC+7)` (compact `UTC+7` on mobile), Green-dot Availability pill (`Available for remote roles` / `Tersedia untuk proyek remote`).
   - H1, Bio, Action buttons (`Get in touch ↗` scrolling to `#contact`, `GitHub`, `LinkedIn`, `Medium`).
   - 1px divider + `CORE STACK` strip (`React · Next.js · TypeScript · Tailwind CSS · Shadcn UI · TanStack Query` + `3+ yrs experience · B.Sc. Informatics (3.95 GPA)`).
3. **Selected Work (`#work`)** (`bg-secondary border-y border-border-subtle`):
   - Eyebrow (`— SELECTED WORK` / `— KARYA PILIHAN`), H2 (`Recent projects` / `Proyek terbaru`).
   - **Featured Card:** `Betty Architecture & Enterprise Dashboard` (`Featured` pill with orange dot, `betty.id · 2025 – Present`, summary, tech stack, Key Outcomes inset panel with 3 orange-dot bullets + `View case study ↗`).
   - **Secondary Grid (3 cards):** `Rekadigi & DRI Web` (`Landing Pages`, `2025`), `Cinematch` (`Product`, `2024`), `Client Web Suite` (`Client Work`, `2024–2025`). Each card transitions border + subtle elevation + swaps year to orange `↗` cue on hover/focus-within (visible cleanly on touch via `@media (hover: none)` or explicit cue).
4. **Experience (`#experience`)** (`bg-background`):
   - Eyebrow (`— EXPERIENCE` / `— PENGALAMAN`), H2 (`Work history` / `Riwayat kerja`).
   - 4 divided rows:
     1. `Lead Frontend Programmer` — `PT Daya Rekadigital Indonesia (Rekadigi)` · `Current` orange-dot badge + `Jul 2025 – Present`
     2. `Staff IT` — `Sekolah Tinggi Teknologi Warga` · `Jan – Jul 2025`
     3. `Frontend Web Developer` — `Freelance · Remote` · `Aug 2024 – Jan 2025`
     4. `Frontend Programmer (React)` — `PT Javan Cipta Solusi` · `Aug – Dec 2023`
5. **Writing (`#writing`)** (`bg-secondary border-y border-border-subtle`):
   - Eyebrow (`— WRITING` / `— TULISAN`), H2 (`Notes on Medium` / `Catatan di Medium`), right-aligned orange link `All articles on Medium ↗`.
   - Grouped rounded-xl (`12px`) card (`bg-card border border-border overflow-hidden`):
     - Article row: `Workflow & Code Quality · ID`, `Why Every Project Needs Husky & lint-staged`, excerpt, `Read article ↗`. Interactive states: hover underlines title + orange metadata; `:focus-visible` displays `4px` left orange bar + subtle orange tint + `Enter ↵` Kbd pill.
     - Divider + Progressive Publishing row: `New notes on React, Next.js architecture, and frontend tooling published gradually.` + `Follow @daniel.theo ↗`.
6. **Contact & Footer (`#contact`)** (`bg-background`):
   - **Dark Anchor Card** (always dark `#18181B` surface, `#27272A` light-mode / `#3F3F46` dark-mode border, `#FAFAFA` heading, `#A1A1AA` subcopy, `rounded-2xl`):
     - Eyebrow `— CONTACT` + right status `● Available · Surakarta, ID (UTC+7)`.
     - Heading `Let’s build something clear and fast.` + subcopy.
     - Primary CTA `Email Daniel ↗` (`mailto:danieltheo.73@gmail.com`) + Copy Email button (`danieltheo.73@gmail.com` with clipboard icon, transitioning to green `✓ Copied to clipboard!` for 2s + triggering top toast notification).
   - **Footer**: 1px top divider + `© 2026 Daniel Theo Santoso · Surakarta, Indonesia` + `LinkedIn`, `GitHub`, `Medium` links.

---

## 9. Interactive Overlays & Motion Spec

### Overlays (Built on shadcn/ui `@base-ui/react`)

- **Case Study Overlay (`CaseStudyModal`):**
  - On Desktop/Tablet (`>= 768px`, via `useMediaQuery`): centered shadcn Base UI `Dialog` (`max-w-[560px]`, `rounded-2xl`, `p-8`, backdrop scrim) showing `● Case Study` pill, `betty.id · 2025 – Present`, close `×` button, title, full summary, `ARCHITECTURAL HIGHLIGHTS` inset box with 3 bullets, stack line, and footer (`ESC to close` left, `Close` + `Visit ... ↗` right).
  - On Mobile (`< 768px`): bottom sheet (`rounded-t-2xl`, top grab handle pill, `● Case Study` pill + `×` button, title, concise summary, highlights box, stacked full-width primary CTA + secondary `Close` button).
- **Mobile Navigation Drawer (`MobileNavDrawer`, `< 768px`):**
  - Full-height slide-in shadcn Base UI `Sheet` (right side, full-width `w-full max-w-[375px]`): header (`Daniel Theo.` + `×` close button), `NAVIGATION` eyebrow, 4 large numbered links (`01`–`04`) with active section left orange indicator bar (`3px`) & card fill, divider, `Appearance & Language` row (`[EN | ID]` + Theme button), pinned footer (`Get in touch ↗` full-width + 3-col `GitHub / LinkedIn / Medium`).
- **Clipboard Toast:**
  - Appears at top-center (`top-4`) for `2000ms` with green check icon, localized `"Email copied to clipboard"` / `"Email disalin ke clipboard"`, and `2s` mono meta label, matching FigCraft's `Mobile Sheet & Toast` frame (and styled cleanly on desktop too).

### Motion (`motion/react`)

- Wrap client shell in `<MotionConfig reducedMotion="user">`.
- Keep all animations GPU-composited (`transform`, `opacity`) with smooth Expo ease `[0.22, 1, 0.36, 1]` and subtle amplitudes (`y: 12 → 0`, `duration: 0.45s`, `viewport={{ once: true, amount: 0.15 }}`).
- Active section nav bar indicator & `[EN | ID]` toggle pill animate via `layoutId` spring (`stiffness: 420, damping: 34`).
- Button press tactile feedback (`active:scale-[0.98]`), 150ms ease-out hover transitions, respecting `prefers-reduced-motion: reduce`.

---

## 10. Verification & Testing Strategy

- Unit tests (`node --test` / TypeScript runner or Vitest) for:
  - `resolveLocale()` cookie parsing & fallback to `en`
  - Two-state theme toggle state transitions (`system` ↔ override ↔ revert-to-system)
  - Portfolio & i18n message key parity between `messages/en.json` and `messages/id.json`
- Full static verification: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm build`.
- Visual & interactive verification in live Chrome browser (via browser subagent) across all 4 viewports (`375px`, `768px`, `1024px`, `1440px`), both Light & Dark modes, both `EN` & `ID` cookie toggles (verifying URL remains `/`), Mobile Navigation Drawer, Case Study Dialog & Mobile Sheet, and Email Copy + Toast feedback.
- Final repo scan confirming zero `.aistudio` / `ai-studio` / `GEMINI_API_KEY` / `ais-pre` traces remain.

---

## 11. What's Left to the Builder

- Exact component file organization inside `src/components/` and `src/components/ui/`.
- Exact micro-spacing refinements (staying within the strict 4px scale) and Motion stagger timings.
- Updating `src/app/opengraph-image.tsx`, `src/lib/og-card.tsx`, and `src/app/manifest.ts` to reflect the new brand palette (`#F54900` / `#09090B`) and renamed profile photo (`/images/daniel-profile.webp`, plus a JPEG/PNG derivative `public/images/daniel-profile-og.jpg` for `next/og` `ImageResponse`, since `resvg` does not rasterize WebP inputs).
