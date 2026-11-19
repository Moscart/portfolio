import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config';
import { getThemeInitScript } from '@/lib/theme-logic';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('meta');
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description,
    keywords: [...SITE_CONFIG.keywords],
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.linkedinUrl }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    category: 'technology',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: '/',
      siteName: SITE_CONFIG.name,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function buildJsonLd(locale: string) {
  const inLanguage = locale === 'id' ? 'id-ID' : 'en-US';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        inLanguage,
        publisher: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        inLanguage,
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/opengraph-image`,
        },
        mainEntity: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: SITE_CONFIG.name,
        jobTitle: SITE_CONFIG.role,
        email: `mailto:${SITE_CONFIG.email}`,
        image: `${siteUrl}${SITE_CONFIG.profileImagePath}`,
        url: siteUrl,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Surakarta',
          addressRegion: 'Central Java',
          addressCountry: 'ID',
        },
        worksFor: {
          '@type': 'Organization',
          name: 'PT Daya Rekadigital Indonesia (Rekadigi)',
        },
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Universitas Duta Bangsa Surakarta',
          },
          {
            '@type': 'HighSchool',
            name: 'SMK Negeri 2 Surakarta',
          },
        ],
        knowsAbout: [
          'React',
          'Next.js',
          'TypeScript',
          'Tailwind CSS',
          'Shadcn UI',
          'TanStack Query',
        ],
        sameAs: [SITE_CONFIG.linkedinUrl, SITE_CONFIG.githubUrl, SITE_CONFIG.mediumUrl],
      },
    ],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const jsonLd = buildJsonLd(locale);

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(),
          }}
        />
      </head>
      <body
        className="bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <MotionProvider>{children}</MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
