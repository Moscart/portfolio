export interface FeaturedProjectMeta {
  id: 'betty';
  domain: string;
  url: string;
  stack: readonly string[];
  modalStack: readonly string[];
}

export interface SecondaryProjectMeta {
  id: 'next-boilerplate' | 'rekadigi' | 'space-tourism';
  url: string;
  stack: readonly string[];
}

export interface ExperienceMeta {
  id: 'rekadigi-lead' | 'stt-warga' | 'freelance-remote' | 'javan-react' | 'duxeos-intern';
  isCurrent?: boolean;
}

export interface WritingArticleMeta {
  id: 'feature-first-nextjs' | 'husky-lint-staged';
  url: string;
}

export const CORE_STACK_ITEMS = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Shadcn UI',
  'TanStack Query',
] as const;

export const FEATURED_PROJECT: FeaturedProjectMeta = {
  id: 'betty',
  domain: 'betty.id',
  url: 'https://betty.id',
  stack: ['Next.js', 'TypeScript', 'TanStack Query', 'Shadcn UI', 'next-intl'],
  modalStack: ['Next.js', 'TypeScript', 'TanStack Query', 'Shadcn UI', 'next-intl', 'Joi'],
};

export const SECONDARY_PROJECTS: readonly SecondaryProjectMeta[] = [
  {
    id: 'next-boilerplate',
    url: 'https://github.com/Moscart/next-boilerplate',
    stack: ['Next.js 16', 'Tailwind v4', 'Docker'],
  },
  {
    id: 'rekadigi',
    url: 'https://rekadigi.id',
    stack: ['Next.js', 'Tailwind', 'next-intl'],
  },
  {
    id: 'space-tourism',
    url: 'https://space-tourism-two-sigma.vercel.app',
    stack: ['Next.js', 'Tailwind', 'Shadcn UI'],
  },
];

export const EXPERIENCE_ITEMS: readonly ExperienceMeta[] = [
  { id: 'rekadigi-lead', isCurrent: true },
  { id: 'stt-warga' },
  { id: 'freelance-remote' },
  { id: 'javan-react' },
  { id: 'duxeos-intern' },
];

export const WRITING_ARTICLES: readonly WritingArticleMeta[] = [
  {
    id: 'feature-first-nextjs',
    url: 'https://medium.com/@daniel.theo/jangan-cuma-bagus-di-luar-rapi-juga-di-dalam-kenalan-dengan-feature-first-architecture-di-next-js-ac25d0d68dda',
  },
  {
    id: 'husky-lint-staged',
    url: 'https://medium.com/@daniel.theo/dulu-bingung-ini-file-apa-sekarang-wajib-ada-di-tiap-project-mengenal-husky-dan-lint-staged-953ba648212d',
  },
];
