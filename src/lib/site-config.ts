const DEFAULT_SITE_URL =
  'https://ais-pre-dif3f56on34skfo7csf7zo-622233591882.asia-northeast1.run.app';

/**
 * Resolves and normalizes the canonical site URL from environment variables,
 * ignoring placeholder values and stripping any trailing slash.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
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
  shortName: 'D.',
  role: 'Frontend Programmer',
  title: 'Daniel Theo Santoso — Portofolio Frontend Programmer',
  description:
    'Portofolio resmi Daniel Theo Santoso, Frontend Programmer di Surakarta. Jelajahi proyek aplikasi web modern berbasis React, Next.js, dan TypeScript.',
  locale: 'id_ID',
  language: 'id-ID',
  location: 'Surakarta, Jawa Tengah, Indonesia',
  email: 'danieltheo.73@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/daniel-theo-santoso/',
  githubUrl: 'https://github.com/Moscart',
  ogImageAlt: 'Daniel Theo Santoso — Frontend Programmer (React, Next.js & TypeScript)',
  profileImagePath: '/images/daniel-avatar.png',
  keywords: [
    'Daniel Theo Santoso',
    'Frontend Programmer',
    'Frontend Developer Indonesia',
    'Web Developer Surakarta',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'Tailwind CSS',
    'PT Daya Rekadigital Indonesia',
    'Portofolio Frontend',
  ],
} as const;
