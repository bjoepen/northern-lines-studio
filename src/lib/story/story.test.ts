import { describe, expect, it } from 'vitest';
import type { StudioPage } from '../project';
import { requireGrammar } from '../grammar';
import { availableStoryComponents, buildStoryStructure, missingStoryComponents, presentStoryComponents } from './index';

const bergen: StudioPage = {
  id: 'page-bergen',
  order: 10,
  type: 'destination',
  role: 'destination',
  title: 'Bergen',
  content: 'content/pages/010-bergen.md',
  layout: 'destination-standard',
  components: ['hero', 'title', 'introduction', 'history', 'photography', 'knowledge', 'qr']
};

describe('story components foundation', () => {
  it('materializes semantic story components from page data and grammar', () => {
    const structure = buildStoryStructure(bergen, requireGrammar('destination'));
    expect(structure?.presentCount).toBe(7);
    expect(presentStoryComponents(structure).map((component) => component.type)).toEqual([
      'hero', 'title', 'introduction', 'history', 'photography', 'knowledge', 'qr'
    ]);
  });

  it('keeps optional expression possibilities visible without treating them as missing', () => {
    const structure = buildStoryStructure(bergen, requireGrammar('destination'));
    expect(availableStoryComponents(structure).map((component) => component.type)).toEqual(['souvenirs']);
    expect(structure?.missingRequiredCount).toBe(0);
  });

  it('expresses the editorial frame as a separate responsibility layer', () => {
    const structure = buildStoryStructure(bergen, requireGrammar('destination'));
    expect(structure?.editorialFrame.map((component) => component.id)).toEqual(['header', 'footer', 'page_number', 'companion']);
    expect(structure?.editorialFrame.find((component) => component.id === 'companion')?.purpose).toContain('verbindet Orte und Seiten');
    expect(structure?.annotations).toEqual([]);
  });

  it('marks missing required story components in editorial language', () => {
    const page = { ...bergen, components: bergen.components?.filter((component) => component !== 'knowledge') };
    const structure = buildStoryStructure(page, requireGrammar('destination'));
    expect(missingStoryComponents(structure).map((component) => component.label)).toEqual(['Northern Lines Wissen']);
  });
});
