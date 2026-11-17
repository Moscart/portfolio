import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0C0E' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
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
    locale: SITE_CONFIG.locale,
    url: '/',
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      inLanguage: SITE_CONFIG.language,
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
      inLanguage: SITE_CONFIG.language,
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
        addressRegion: 'Jawa Tengah',
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
        'React.js',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'Frontend Web Development',
      ],
      sameAs: [SITE_CONFIG.linkedinUrl, SITE_CONFIG.githubUrl],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#FAF9F6] font-[family-name:var(--font-sans)] text-zinc-900 antialiased selection:bg-orange-500 selection:text-white dark:bg-[#0B0C0E] dark:text-zinc-100 dark:selection:bg-yellow-400 dark:selection:text-zinc-950"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
