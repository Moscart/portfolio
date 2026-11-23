import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NotFoundView } from '@/components/NotFoundView';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notFound');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function NotFoundPage() {
  return <NotFoundView />;
}
