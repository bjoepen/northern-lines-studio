import { describe, expect, it } from 'vitest';
import type { StudioPage } from '../project';
import { availableGrammars, evaluateGrammar, grammarForPage, requireGrammar } from './index';

const destination: StudioPage = { id: 'bergen', order: 10, type: 'destination', role: 'destination', title: 'Bergen', content: 'content/pages/010-bergen.md', layout: 'destination-standard', components: ['hero', 'title', 'introduction', 'history', 'photography', 'knowledge', 'souvenirs', 'qr'] };

describe('editorial grammar library', () => {
  it('ships the nine Fjord reference grammars', () => {
    expect(availableGrammars().map((grammar) => grammar.id)).toEqual(['cover', 'welcome', 'contents', 'destination', 'light', 'weather', 'workflow', 'notes', 'closing']);
  });

  it('resolves a destination page to the Destination grammar', () => {
    expect(grammarForPage(destination)?.id).toBe('destination');
  });

  it('resolves knowledge pages by their semantic knowledge type', () => {
    expect(grammarForPage({ ...destination, type: 'knowledge', role: 'journey_knowledge', knowledgeType: 'photography_light' })?.id).toBe('light');
    expect(grammarForPage({ ...destination, type: 'knowledge', role: 'journey_knowledge', knowledgeType: 'travel_weather' })?.id).toBe('weather');
  });

  it('evaluates editorial completeness from required story components only', () => {
    const evaluation = evaluateGrammar(destination, requireGrammar('destination'));
    expect(evaluation?.completeness).toBe(100);
    expect(evaluation?.missingRequired).toEqual([]);
    expect(evaluation?.optionalAvailable).toEqual([]);
  });

  it('reports missing required components in editorial language', () => {
    const page = { ...destination, components: destination.components?.filter((id) => id !== 'knowledge') };
    const evaluation = evaluateGrammar(page, requireGrammar('destination'));
    expect(evaluation?.completeness).toBe(86);
    expect(evaluation?.missingRequired.map((rule) => rule.label)).toEqual(['Northern Lines Wissen']);
    expect(evaluation?.isComplete).toBe(false);
  });
});
