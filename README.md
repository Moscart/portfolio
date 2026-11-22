# Daniel Theo Santoso — Portfolio

Personal portfolio website of **Daniel Theo Santoso** (`Moscart`), Lead Frontend Engineer specializing in React, Next.js, and TypeScript.

Live site: **[portfolio.tsx.web.id](https://portfolio.tsx.web.id)**

## Features

- **Editorial Single-Page Layout** — Structured sections for Hero, Selected Work (including an interactive Case Study modal for Betty.id), Experience timeline, Technical Writing, and a 3-column Contact & Footer with one-click email copy and toast feedback.
- **Bilingual Support (EN / ID)** — Powered by `next-intl` with instant client-side locale switching and SSR-synced `NEXT_LOCALE` cookie persistence without changing URLs.
- **Flash-Free Light & Dark Theme** — Follows OS color-scheme preferences by default, supports manual override persisted in `localStorage`, syncs across browser tabs, and prevents theme flicker with an inline head initialization script.
- **Smooth Motion & Scroll** — `motion` animations and `lenis` smooth scrolling synchronized on a single animation frame loop, fully respecting `prefers-reduced-motion`.
- **SEO & Dynamic Social Cards** — Localized metadata, JSON-LD structured data (`WebSite`, `ProfilePage`, `Person`, `SoftwareSourceCode`, `ItemList`), dynamic `sitemap.xml`, `robots.txt`, web app manifest, and Satori-rendered Open Graph / Twitter cards using bundled fonts.
- **Accessible UI Primitives** — Built with shadcn/ui (`base-nova` / Base UI) dialogs, sheets, full-width mobile navigation drawer, scroll-spy active navigation states, and automated accessibility regression tests.
- **Standalone Production Output** — Configured with Next.js `output: 'standalone'` for lightweight containerized or Node.js deployments.

## Tech Stack

| Category           | Technology                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)   |
| Styling & UI       | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (`@base-ui/react`), [Tabler Icons](https://tabler.io/icons) |
| Typography         | `Bricolage Grotesque`, `Plus Jakarta Sans`, `JetBrains Mono` via `next/font/google`                                                          |
| i18n               | [next-intl](https://next-intl.dev/) (`en`, `id`)                                                                                             |
| Animation & Scroll | [Motion](https://motion.dev/), [Lenis](https://lenis.darkroom.engineering/)                                                                  |
| Quality & Testing  | ESLint 9, Prettier (`prettier-plugin-tailwindcss`), Husky, lint-staged, Node.js test runner (`node --test`)                                  |

## Project Structure

```text
.
├── messages/               # Locale translation dictionaries (en.json, id.json)
├── public/                 # Static assets (images, bundled OG fonts, favicon)
└── src/
    ├── app/                # Next.js App Router entry, metadata, OG/Twitter images, sitemap & robots
    ├── components/
    │   ├── sections/       # Hero, SelectedWork, Experience, Writing, ContactFooter
    │   ├── ui/             # shadcn/ui (Base UI) primitives
    │   └── *.tsx           # Navbar, MobileNavDrawer, CaseStudyModal, toggles, providers
    ├── hooks/              # Custom React hooks
    ├── i18n/               # next-intl locale config and SSR request loader
    └── lib/                # Site config, portfolio metadata, navigation, theme, clipboard, OG card
```

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** (recommended package manager)

### Installation

```bash
git clone https://github.com/Moscart/portfolio.git
cd portfolio
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and adjust values as needed:

```bash
cp .env.example .env.local
```

| Variable                               | Required | Default                        | Description                                                                         |
| -------------------------------------- | -------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | No       | `https://portfolio.tsx.web.id` | Canonical public URL used for Open Graph metadata, `sitemap.xml`, and `robots.txt`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No       | —                              | Optional Google Search Console HTML meta verification token.                        |

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command             | Description                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Start the Next.js development server.                                                                         |
| `pnpm build`        | Build the production standalone bundle and copy `public/` and `.next/static/` into `.next/standalone/`.       |
| `pnpm start`        | Start the Next.js production server (`node .next/standalone/server.js` can also be used for standalone runs). |
| `pnpm lint`         | Run ESLint across the repository.                                                                             |
| `pnpm typecheck`    | Run TypeScript type checking (`tsc --noEmit`).                                                                |
| `pnpm test`         | Run unit and accessibility regression tests with `node --test "src/**/*.test.ts"`.                            |
| `pnpm format`       | Format files with Prettier.                                                                                   |
| `pnpm format:check` | Verify code formatting without modifying files.                                                               |
| `pnpm clean`        | Remove Next.js build output.                                                                                  |

## Git Hooks

Managed via Husky:

- **pre-commit**: Runs `lint-staged` (ESLint `--fix` + Prettier) and `tsc --noEmit`.
- **pre-push**: Runs `pnpm build` to verify the production build passes before pushing.

## Contact

- **Website**: [portfolio.tsx.web.id](https://portfolio.tsx.web.id)
- **GitHub**: [@Moscart](https://github.com/Moscart)
- **LinkedIn**: [Daniel Theo Santoso](https://www.linkedin.com/in/daniel-theo-santoso/)
- **Medium**: [@daniel.theo](https://medium.com/@daniel.theo)
- **Email**: [danieltheo.73@gmail.com](mailto:danieltheo.73@gmail.com)
