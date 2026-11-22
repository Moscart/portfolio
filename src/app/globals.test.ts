import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

test('components.json configures shadcn base-nova with tabler icons and Tailwind v4', () => {
  const configPath = join(process.cwd(), 'components.json');
  assert.ok(existsSync(configPath), 'components.json must exist');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  assert.equal(config.style, 'base-nova');
  assert.equal(config.iconLibrary, 'tabler');
  assert.equal(config.tailwind.css, 'src/app/globals.css');
  assert.equal(config.tailwind.config, '');
  assert.equal(config.tailwind.cssVariables, true);
});

test('shadcn ui components use @base-ui/react and zero @radix-ui imports', () => {
  const uiDir = join(process.cwd(), 'src', 'components', 'ui');
  assert.ok(existsSync(uiDir), 'src/components/ui directory must exist');
  const files = readdirSync(uiDir).filter((f) => f.endsWith('.tsx'));
  for (const required of [
    'button.tsx',
    'badge.tsx',
    'avatar.tsx',
    'separator.tsx',
    'dialog.tsx',
    'sheet.tsx',
    'kbd.tsx',
  ]) {
    assert.ok(files.includes(required), `Missing shadcn component: ${required}`);
  }
  for (const file of files) {
    const content = readFileSync(join(uiDir, file), 'utf8');
    assert.equal(content.includes('@radix-ui'), false, `${file} must not import @radix-ui`);
    assert.equal(content.includes('lucide-react'), false, `${file} must not import lucide-react`);
  }
});

test('globals.css implements FigCraft Design System light/dark tokens, 1440px breakpoint, and modern dark/scrollbar rules', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');
  for (const expected of [
    '--primary: #f54900',
    '--background: #ffffff',
    '--background: #09090b',
    '--secondary: #f7f7f8',
    '--secondary: #111113',
    '--card: #18181b',
    '--accent-foreground: #c2410c',
    '--accent-foreground: #ff7a3d',
    '--ring: #f54900',
    '--ring: #ff6b2b',
    '--radius: 0.5rem',
    '--breakpoint-2xl: 90rem',
    'color-scheme: light dark',
    '@supports not (scrollbar-color: auto)',
  ]) {
    assert.ok(
      css.toLowerCase().includes(expected.toLowerCase()),
      `globals.css missing: ${expected}`,
    );
  }
});
