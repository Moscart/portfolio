export type SectionId = 'work' | 'experience' | 'writing' | 'contact';

export interface NavSectionItem {
  id: SectionId;
  index: '01' | '02' | '03' | '04';
  href: `#${SectionId}`;
}

export interface SectionRect {
  id: SectionId;
  top: number;
  height: number;
}

export const NAV_SECTIONS: readonly NavSectionItem[] = [
  { id: 'work', index: '01', href: '#work' },
  { id: 'experience', index: '02', href: '#experience' },
  { id: 'writing', index: '03', href: '#writing' },
  { id: 'contact', index: '04', href: '#contact' },
] as const;

/**
 * Resolves the active navigation section from section bounding rects relative to the viewport.
 * Returns null while still at the top of the Hero section before any nav section reaches the threshold,
 * and activates the final section when scrolled to the bottom of the document.
 */
export function resolveActiveSection(
  entries: readonly SectionRect[],
  viewportHeight: number,
  scrollY: number,
  documentHeight?: number,
): SectionId | null {
  if (entries.length === 0) return null;

  const threshold = Math.min(200, Math.max(96, viewportHeight * 0.25));

  if (scrollY <= 16 && entries[0].top > threshold) {
    return null;
  }

  if (
    typeof documentHeight === 'number' &&
    documentHeight > viewportHeight &&
    scrollY > 0 &&
    scrollY + viewportHeight >= documentHeight - 2
  ) {
    return entries[entries.length - 1].id;
  }

  let active: SectionId | null = null;
  for (const entry of entries) {
    if (entry.top <= threshold) {
      active = entry.id;
    }
  }

  return active;
}
