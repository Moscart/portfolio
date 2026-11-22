import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getSiteUrl, SITE_CONFIG } from './site-config.ts';

test('SITE_CONFIG points to renamed profile images and has zero aistudio references', () => {
  assert.equal(SITE_CONFIG.profileImagePath, '/images/daniel-profile.webp');
  assert.equal(SITE_CONFIG.ogProfileImagePath, '/images/daniel-profile-og.jpg');
  assert.equal(SITE_CONFIG.mediumUrl, 'https://medium.com/@daniel.theo');
  assert.equal(SITE_CONFIG.bettyUrl, 'https://betty.id');
  assert.ok(existsSync(join(process.cwd(), 'public', 'images', 'daniel-profile.webp')));
  assert.ok(existsSync(join(process.cwd(), 'public', 'images', 'daniel-profile-og.jpg')));
  assert.equal(existsSync(join(process.cwd(), '.aistudio')), false);
  assert.equal(existsSync(join(process.cwd(), 'metadata.json')), false);
  assert.equal(existsSync(join(process.cwd(), 'public', 'assets', 'aistudio')), false);
});

test('getSiteUrl falls back to canonical domain without aistudio cloud run URL', () => {
  const fallback = getSiteUrl({});
  assert.equal(fallback, 'https://danieltheo.dev');
  assert.equal(fallback.includes('ais-pre-'), false);
  assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://example.com/' }), 'https://example.com');
  assert.equal(
    getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.vercel.app' }),
    'https://portfolio.vercel.app',
  );
});
