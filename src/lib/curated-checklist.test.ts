import { describe, expect, it } from 'vitest';
import {
  CURATED_CHECKLIST_KNOWLEDGE_TYPES,
  curatedChecklistDefinitionFor,
  curatedChecklistPages,
  isCuratedChecklistPage
} from './curated-checklist';


describe('Build 041 curated checklist', () => {
  it('provides exactly two curated pages as one ordered unit before notes', () => {
    const pages = curatedChecklistPages();
    expect(pages).toHaveLength(2);
    expect(pages.map((page) => page.id)).toEqual(['page-curated-checklist-1', 'page-curated-checklist-2']);
    expect(pages.map((page) => page.order)).toEqual([28, 29]);
    expect(pages.every((page) => page.role === 'notes')).toBe(true);
    expect(pages.every((page) => page.components?.length === 0)).toBe(true);
  });

  it('keeps the content product-curated and free of project authoring', () => {
    for (const knowledgeType of CURATED_CHECKLIST_KNOWLEDGE_TYPES) {
      const definition = curatedChecklistDefinitionFor(knowledgeType);
      expect(definition).not.toBeNull();
      expect(definition?.sections.length).toBeGreaterThanOrEqual(3);
      expect(definition?.sections.every((section) => section.items.length > 0)).toBe(true);
    }
  });

  it('recognizes only the curated checklist knowledge pages', () => {
    const [page] = curatedChecklistPages();
    expect(isCuratedChecklistPage(page)).toBe(true);
    expect(isCuratedChecklistPage({ ...page, knowledgeType: 'photography_light' })).toBe(false);
  });
});
