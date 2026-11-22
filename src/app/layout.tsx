import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { MotionProvider } from '@/components/MotionProvider';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { WRITING_ARTICLES } from '@/lib/portfolio-data';
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
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description,
    applicationName: SITE_CONFIG.name,
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
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      other: {
        me: [SITE_CONFIG.githubUrl, SITE_CONFIG.linkedinUrl, SITE_CONFIG.mediumUrl],
      },
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
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
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

function buildJsonLd(locale: string, title: string, description: string) {
  const inLanguage = locale === 'id' ? 'id-ID' : 'en-US';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_CONFIG.name,
        alternateName: `${SITE_CONFIG.brandName}.`,
        description,
        inLanguage,
        publisher: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: title,
        description,
        inLanguage,
        dateModified: '2026-11-22T20:20:00+07:00',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        mainEntity: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: SITE_CONFIG.name,
        alternateName: SITE_CONFIG.handle,
        jobTitle: SITE_CONFIG.role,
        description,
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
          url: SITE_CONFIG.rekadigiUrl,
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
        knowsLanguage: ['Indonesian', 'English'],
        knowsAbout: [
          'React',
          'Next.js',
          'TypeScript',
          'Tailwind CSS',
          'Shadcn UI',
          'TanStack Query',
          'next-intl',
          'Feature-First Architecture',
          'Core Web Vitals',
          'Docker',
        ],
        sameAs: [SITE_CONFIG.linkedinUrl, SITE_CONFIG.githubUrl, SITE_CONFIG.mediumUrl],
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'next-boilerplate',
        description:
          'Minimal Next.js 16 boilerplate with TypeScript, Tailwind CSS v4, ESLint, Prettier, Husky, and Docker standalone setup.',
        codeRepository: 'https://github.com/Moscart/next-boilerplate',
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Next.js 16',
        author: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'ItemList',
        name: 'Published Articles on Medium',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Article',
              headline:
                'Jangan Cuma Bagus di Luar, Rapi Juga di Dalam: Kenalan dengan Feature-First Architecture di Next.js',
              url: WRITING_ARTICLES[0].url,
              inLanguage: 'id-ID',
              author: { '@id': `${siteUrl}/#person` },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Article',
              headline:
                'Dulu Bingung Ini File Apa, Sekarang Wajib Ada di Tiap Project: Mengenal Husky dan Lint-Staged',
              url: WRITING_ARTICLES[1].url,
              inLanguage: 'id-ID',
              author: { '@id': `${siteUrl}/#person` },
            },
          },
        ],
      },
    ],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tMeta = await getTranslations('meta');
  const jsonLd = buildJsonLd(locale, tMeta('title'), tMeta('description'));

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
            <MotionProvider>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
