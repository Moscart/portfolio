import type { MetadataRoute } from 'next';
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: [`${siteUrl}/opengraph-image`, `${siteUrl}${SITE_CONFIG.profileImagePath}`],
    },
  ];
}
