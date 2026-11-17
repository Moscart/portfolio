import { createOgCardResponse } from '@/lib/og-card';

export const alt = 'Daniel Theo Santoso — Portofolio Frontend Programmer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Generates the Open Graph social preview image at /opengraph-image.
 */
export default async function OpenGraphImage() {
  return createOgCardResponse();
}
