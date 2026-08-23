import { describe, expect, it } from 'vitest';
import type { StudioPage } from './project';
import { pagesWithCuratedChecklist, publicationOrderedPages } from './workspace';

const basePages: StudioPage[] = [
  { id: 'page-workflow', order: 20, type: 'workflow', role: 'workflow', title: 'Fotografie-Workshop', content: '', layout: 'workflow' },
  { id: 'page-notes', order: 30, type: 'notes', role: 'notes', title: 'Erinnerungen', content: '', layout: 'notes' },
  { id: 'page-closing', order: 40, type: 'closing', role: 'closing_memory', title: 'Die Reise bleibt', content: '', layout: 'closing' }
];

describe('Build 041 checklist publication order', () => {
  it('places both checklist pages immediately before memories', () => {
    const ordered = publicationOrderedPages(basePages);
    const memoryIds = ordered.filter((page) => ['page-curated-checklist-1', 'page-curated-checklist-2', 'page-notes', 'page-closing'].includes(page.id)).map((page) => page.id);

    expect(memoryIds).toEqual([
      'page-curated-checklist-1',
      'page-curated-checklist-2',
      'page-notes',
      'page-closing'
    ]);
  });

  it('does not duplicate checklist pages when they are already present', () => {
    const once = pagesWithCuratedChecklist(basePages);
    const twice = pagesWithCuratedChecklist(once);
    expect(twice.filter((page) => page.id === 'page-curated-checklist-1')).toHaveLength(1);
    expect(twice.filter((page) => page.id === 'page-curated-checklist-2')).toHaveLength(1);
  });
});
