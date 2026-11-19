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
  assert.equal(resolveActiveSection(sections, 900, 400), 'experience');
  assert.equal(
    resolveActiveSection(
      [
        { id: 'work', top: 600, height: 600 },
        { id: 'experience', top: 1300, height: 500 },
      ],
      900,
      0,
    ),
    null,
  );
});
