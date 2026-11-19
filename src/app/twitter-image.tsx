import { createOgCardResponse } from '@/lib/og-card';
import { SITE_CONFIG } from '@/lib/site-config';

export const alt = SITE_CONFIG.ogImageAlt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Generates the Twitter/X summary_large_image preview at /twitter-image.
 */
export default async function TwitterImage() {
  return createOgCardResponse();
}
