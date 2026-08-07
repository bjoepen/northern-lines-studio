import type { StudioPage } from '../project';
import { grammarDefinitions } from './definitions';
import type { EditorialComponentId, GrammarEvaluation, PageGrammarDefinition, PageGrammarId } from './types';

const registry: ReadonlyMap<PageGrammarId, PageGrammarDefinition> = new Map(grammarDefinitions.map((grammar) => [grammar.id, grammar]));

export function loadGrammar(id: PageGrammarId | undefined): PageGrammarDefinition | null {
  if (!id) return null;
  return registry.get(id) ?? null;
}

export function requireGrammar(id: PageGrammarId): PageGrammarDefinition {
  const grammar = loadGrammar(id);
  if (!grammar) throw new Error(`Unbekannte Editorial Grammar: ${id}`);
  return grammar;
}

export function grammarIdForPage(page: StudioPage | null): PageGrammarId | null {
  if (!page) return null;
  if (page.type === 'knowledge') {
    if (page.knowledgeType === 'photography_light') return 'light';
    if (page.knowledgeType === 'travel_weather') return 'weather';
    return null;
  }
  switch (page.type) {
    case 'cover':
    case 'welcome':
    case 'contents':
    case 'destination':
    case 'workflow':
    case 'notes':
    case 'closing':
      return page.type;
    default:
      return null;
  }
}

export function grammarForPage(page: StudioPage | null): PageGrammarDefinition | null {
  const id = grammarIdForPage(page);
  return id ? loadGrammar(id) : null;
}

export function evaluateGrammar(page: StudioPage | null, grammar: PageGrammarDefinition | null): GrammarEvaluation | null {
  if (!page || !grammar) return null;
  const present = new Set<EditorialComponentId>(page.components ?? []);
  const requiredRules = grammar.story.filter((rule) => rule.required);
  const missingRequired = requiredRules.filter((rule) => !present.has(rule.id));
  const optionalAvailable = grammar.story.filter((rule) => !rule.required && !present.has(rule.id));
  const allowed = new Set(grammar.story.map((rule) => rule.id));
  const unexpected = [...present].filter((id) => !allowed.has(id));
  const presentRequiredCount = requiredRules.length - missingRequired.length;
  const completeness = requiredRules.length === 0 ? 100 : Math.round((presentRequiredCount / requiredRules.length) * 100);
  return { grammar, requiredCount: requiredRules.length, presentRequiredCount, completeness, missingRequired, optionalAvailable, unexpected, isComplete: missingRequired.length === 0 && unexpected.length === 0 };
}

export function availableGrammars(): PageGrammarDefinition[] {
  return [...grammarDefinitions];
}
