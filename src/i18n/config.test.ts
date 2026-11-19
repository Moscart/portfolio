import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, resolveLocale } from './config.ts';
import {
  EXPERIENCE_ITEMS,
  FEATURED_PROJECT,
  SECONDARY_PROJECTS,
  WRITING_ARTICLES,
} from '../lib/portfolio-data.ts';

function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return collectKeys(value as Record<string, unknown>, path);
      }
      return [path];
    })
    .sort();
}

function assertNonEmptyLeafValues(obj: Record<string, unknown>, locale: string, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      assertNonEmptyLeafValues(value as Record<string, unknown>, locale, path);
    } else if (Array.isArray(value)) {
      assert.ok(value.length > 0, `${locale}.${path} array must not be empty`);
      for (const item of value) {
        assert.equal(typeof item, 'string', `${locale}.${path} items must be strings`);
        assert.ok((item as string).trim().length > 0, `${locale}.${path} item must not be empty`);
      }
    } else {
      assert.equal(typeof value, 'string', `${locale}.${path} must be a string`);
      assert.ok((value as string).trim().length > 0, `${locale}.${path} must not be empty`);
    }
  }
}

test('resolveLocale handles valid, messy, missing, and invalid cookie values safely', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(LOCALE_COOKIE_NAME, 'NEXT_LOCALE');
  assert.equal(resolveLocale(undefined), 'en');
  assert.equal(resolveLocale(null), 'en');
  assert.equal(resolveLocale(''), 'en');
  assert.equal(resolveLocale('fr'), 'en');
  assert.equal(resolveLocale('en'), 'en');
  assert.equal(resolveLocale('id'), 'id');
  assert.equal(resolveLocale(' ID '), 'id');
  assert.equal(resolveLocale('EN'), 'en');
});

test('messages/en.json and messages/id.json have identical keys, non-empty strings, and match portfolio-data IDs', () => {
  const en = JSON.parse(readFileSync(join(process.cwd(), 'messages', 'en.json'), 'utf8'));
  const id = JSON.parse(readFileSync(join(process.cwd(), 'messages', 'id.json'), 'utf8'));

  assert.deepEqual(collectKeys(en), collectKeys(id));
  assertNonEmptyLeafValues(en, 'en');
  assertNonEmptyLeafValues(id, 'id');

  assert.equal(en.hero.h1, 'Clean frontend architecture for fast, modern web apps.');
  assert.equal(id.hero.h1, 'Arsitektur frontend rapi untuk web modern yang cepat.');

  assert.ok(en.work.projects[FEATURED_PROJECT.id]);
  assert.ok(id.work.projects[FEATURED_PROJECT.id]);
  for (const project of SECONDARY_PROJECTS) {
    assert.ok(en.work.projects[project.id], `Missing EN copy for project ${project.id}`);
    assert.ok(id.work.projects[project.id], `Missing ID copy for project ${project.id}`);
  }
  for (const exp of EXPERIENCE_ITEMS) {
    assert.ok(en.experience.items[exp.id], `Missing EN copy for experience ${exp.id}`);
    assert.ok(id.experience.items[exp.id], `Missing ID copy for experience ${exp.id}`);
  }
  for (const article of WRITING_ARTICLES) {
    assert.ok(en.writing.articles[article.id], `Missing EN copy for article ${article.id}`);
    assert.ok(id.writing.articles[article.id], `Missing ID copy for article ${article.id}`);
  }
});
