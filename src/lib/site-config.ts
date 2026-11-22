const DEFAULT_SITE_URL = 'https://portfolio.tsx.web.id';

/**
 * Resolves and normalizes the canonical site URL from environment variables,
 * ignoring placeholder values and stripping any trailing slash.
 */
export function getSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const candidates = [
    env.NEXT_PUBLIC_SITE_URL,
    env.APP_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
    env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined,
    DEFAULT_SITE_URL,
  ];

  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (!trimmed || trimmed === 'MY_APP_URL') continue;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(withProtocol);
      return parsed.origin + parsed.pathname.replace(/\/+$/, '');
    } catch {
      continue;
    }
  }

  return DEFAULT_SITE_URL;
}

export const SITE_CONFIG = {
  name: 'Daniel Theo Santoso',
  handle: 'Moscart',
  shortName: 'Daniel Theo',
  brandName: 'Daniel Theo',
  domain: 'portfolio.tsx.web.id',
  role: 'Lead Frontend Engineer',
  title: 'Daniel Theo Santoso — Lead Frontend Engineer (Next.js)',
  description:
    'Lead Frontend Engineer in React, Next.js & TypeScript. Building feature-first enterprise dashboards, Shadcn UI libraries, and open-source Next.js starters.',
  locale: 'en_US',
  language: 'en-US',
  location: 'Surakarta, Indonesia',
  timezone: 'UTC+7',
  email: 'danieltheo.73@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/daniel-theo-santoso/',
  githubUrl: 'https://github.com/Moscart',
  mediumUrl: 'https://medium.com/@daniel.theo',
  bettyUrl: 'https://betty.id',
  rekadigiUrl: 'https://rekadigi.id',
  ogImageAlt: 'Daniel Theo Santoso — Lead Frontend Engineer (React, Next.js & TypeScript)',
  profileImagePath: '/images/daniel-profile.webp',
  ogProfileImagePath: '/images/daniel-profile-og.jpg',
  keywords: [
    'Daniel Theo Santoso',
    'Moscart',
    'Lead Frontend Engineer',
    'Lead Frontend Programmer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'Tailwind CSS',
    'Shadcn UI',
    'TanStack Query',
    'next-intl',
    'Feature-First Architecture',
    'next-boilerplate',
    'Core Web Vitals',
    'PT Daya Rekadigital Indonesia',
    'Rekadigi',
    'Surakarta',
    'Remote Frontend Engineer',
  ],
} as const;
