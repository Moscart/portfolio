import test from 'node:test';
import assert from 'node:assert/strict';
import { NAV_SECTIONS, resolveActiveSection } from './navigation.ts';

test('NAV_SECTIONS exposes all 4 FigCraft navigation targets in order', () => {
  assert.deepEqual(
    NAV_SECTIONS.map((s) => ({ id: s.id, index: s.index, href: s.href })),
    [
      { id: 'work', index: '01', href: '#work' },
      { id: 'experience', index: '02', href: '#experience' },
      { id: 'writing', index: '03', href: '#writing' },
      { id: 'contact', index: '04', href: '#contact' },
    ],
  );
});

test('resolveActiveSection picks active section based on viewport top threshold', () => {
  const sections = [
    { id: 'work' as const, top: -300, height: 600 },
    { id: 'experience' as const, top: 120, height: 500 },
    { id: 'writing' as const, top: 700, height: 400 },
    { id: 'contact' as const, top: 1200, height: 400 },
  ];
  assert.equal(resolveActiveSection(sections, 900, 400, 3000), 'experience');
  assert.equal(
    resolveActiveSection(
      [
        { id: 'work', top: 600, height: 600 },
        { id: 'experience', top: 1300, height: 500 },
      ],
      900,
      0,
      3000,
    ),
    null,
  );
});

test('resolveActiveSection activates final contact section when scrolled to bottom of desktop/tablet viewport', () => {
  // Desktop 1440x900 scrolled to the bottom of a 3000px document: #contact starts at y=404 (above 200px threshold)
  const sectionsAtBottom = [
    { id: 'work' as const, top: -1500, height: 730 },
    { id: 'experience' as const, top: -770, height: 700 },
    { id: 'writing' as const, top: -20, height: 424 },
    { id: 'contact' as const, top: 404, height: 496 },
  ];
  assert.equal(resolveActiveSection(sectionsAtBottom, 900, 2100, 3000), 'contact');
});
