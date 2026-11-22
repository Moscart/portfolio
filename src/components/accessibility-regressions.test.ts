import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function collectTsxFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTsxFiles(full));
    } else if (entry.name.endsWith('.tsx')) {
      results.push(full);
    }
  }
  return results;
}

test('anchor links never use Base UI Button nativeButton={false} (prevents role="button" on <a>)', () => {
  const files = collectTsxFiles(join(process.cwd(), 'src', 'components'));
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    assert.equal(
      content.includes('nativeButton={false}'),
      false,
      `${file} should style <a> with buttonVariants() instead of Button nativeButton={false}`,
    );
  }
});

test('CaseStudyModal enforces viewport max-height and internal scrolling on both Desktop Dialog and Mobile Sheet', () => {
  const modal = readFileSync(
    join(process.cwd(), 'src', 'components', 'CaseStudyModal.tsx'),
    'utf8',
  );
  assert.ok(modal.includes('max-h-[85dvh]') && modal.includes('overflow-y-auto'));
  assert.ok(modal.includes('max-h-[calc(100dvh-2rem)]'));
});

test('HeroSection clips scaled Avatar inside frame and offsets #top below sticky navbar', () => {
  const hero = readFileSync(
    join(process.cwd(), 'src', 'components', 'sections', 'HeroSection.tsx'),
    'utf8',
  );
  assert.ok(hero.includes('scroll-mt-16'), 'Hero #top section must offset sticky navbar');
  assert.ok(
    /Avatar[^>]*overflow-hidden/.test(hero),
    'Hero Avatar root must apply overflow-hidden to clip scaled portrait',
  );
});

test('LocaleProvider persists cookie with try/catch, syncs document lang/title, and LanguageToggle switches without server round-trips', () => {
  const provider = readFileSync(
    join(process.cwd(), 'src', 'components', 'LocaleProvider.tsx'),
    'utf8',
  );
  const toggle = readFileSync(
    join(process.cwd(), 'src', 'components', 'LanguageToggle.tsx'),
    'utf8',
  );
  assert.ok(provider.includes('try {') && provider.includes('catch'));
  assert.ok(provider.includes('document.documentElement.lang'));
  assert.ok(provider.includes('document.cookie'));
  assert.equal(
    toggle.includes('router.refresh'),
    false,
    'LanguageToggle should switch locale instantaneously on the client without router.refresh()',
  );
  assert.equal(
    toggle.includes('setLocaleAction'),
    false,
    'LanguageToggle should not block UI on a Server Action round-trip',
  );
});

test('LanguageToggle uses persistent transform slide (no layoutId) and sticky Navbar header uses layoutRoot', () => {
  const toggle = readFileSync(
    join(process.cwd(), 'src', 'components', 'LanguageToggle.tsx'),
    'utf8',
  );
  const navbar = readFileSync(join(process.cwd(), 'src', 'components', 'Navbar.tsx'), 'utf8');

  assert.equal(
    toggle.includes('layoutId='),
    false,
    'LanguageToggle must not use layoutId (breaks/jumps in sticky header when scrolled during router.refresh)',
  );
  assert.ok(
    toggle.includes('animate={{ x:'),
    'LanguageToggle should animate its persistent pill with GPU translateX',
  );
  assert.ok(
    navbar.includes('<motion.header') && navbar.includes('layoutRoot'),
    'Sticky Navbar header must be a motion.header with layoutRoot so layoutId children animate relative to it',
  );
});

test('MobileNavDrawer overrides SheetContent right-side width and max-width constraints to stay full screen width', () => {
  const drawer = readFileSync(
    join(process.cwd(), 'src', 'components', 'MobileNavDrawer.tsx'),
    'utf8',
  );
  assert.ok(
    drawer.includes('data-[side=right]:w-full') &&
      drawer.includes('data-[side=right]:sm:max-w-none'),
    'MobileNavDrawer must override SheetContent data-[side=right]:w-3/4 and sm:max-w-sm for full-width mobile coverage',
  );
  assert.equal(
    drawer.includes('max-w-[375px]'),
    false,
    'MobileNavDrawer must not cap width at 375px',
  );
});

test('SiteFooter renders as a top-level contentinfo landmark outside <main> with accessible nav, list semantics, and native #top anchor', () => {
  const shell = readFileSync(
    join(process.cwd(), 'src', 'components', 'PortfolioShell.tsx'),
    'utf8',
  );
  const footerFile = readFileSync(
    join(process.cwd(), 'src', 'components', 'sections', 'ContactFooterSection.tsx'),
    'utf8',
  );

  assert.ok(
    /<\/main>\s*<SiteFooter\s*\/>/.test(shell),
    'SiteFooter must render as a sibling after </main> so <footer> exposes its top-level contentinfo landmark role',
  );
  assert.ok(
    footerFile.includes("aria-label={tFooter('navAriaLabel')}"),
    'Footer <nav> must have a distinguishable accessible name',
  );
  assert.ok(
    footerFile.includes('role="list"'),
    'Footer connect <ul> outside <nav> must set role="list" to preserve list semantics in Safari',
  );
  assert.ok(
    footerFile.includes('href="#top"'),
    'Back-to-top control must use a native <a href="#top"> link',
  );
});
