export interface FeaturedProjectMeta {
  id: 'betty';
  domain: string;
  url: string;
  stack: readonly string[];
  modalStack: readonly string[];
}

export interface SecondaryProjectMeta {
  id: 'rekadigi' | 'cinematch' | 'client-suite';
  url: string;
  stack: readonly string[];
}

export interface ExperienceMeta {
  id: 'rekadigi-lead' | 'stt-warga' | 'freelance-remote' | 'javan-react';
  isCurrent?: boolean;
}

export interface WritingArticleMeta {
  id: 'husky-lint-staged';
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
  stack: ['Next.js', 'TypeScript', 'Redux', 'TanStack Query', 'Shadcn UI'],
  modalStack: ['Next.js', 'TypeScript', 'Redux', 'TanStack Query', 'Shadcn UI', 'next-intl'],
};

export const SECONDARY_PROJECTS: readonly SecondaryProjectMeta[] = [
  {
    id: 'rekadigi',
    url: 'https://rekadigi.id',
    stack: ['Next.js', 'Tailwind', 'next-intl'],
  },
  {
    id: 'cinematch',
    url: 'https://github.com/Moscart',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'client-suite',
    url: 'https://github.com/Moscart',
    stack: ['React', 'Next.js', 'Responsive UI'],
  },
];

export const EXPERIENCE_ITEMS: readonly ExperienceMeta[] = [
  { id: 'rekadigi-lead', isCurrent: true },
  { id: 'stt-warga' },
  { id: 'freelance-remote' },
  { id: 'javan-react' },
];

export const WRITING_ARTICLES: readonly WritingArticleMeta[] = [
  {
    id: 'husky-lint-staged',
    url: 'https://medium.com/@daniel.theo',
  },
];
