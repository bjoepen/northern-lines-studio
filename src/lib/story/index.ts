import type { StudioPage } from '../project';
import type { EditorialComponentId, PageGrammarDefinition } from '../grammar/types';
import { editorialFrameDefinitionFor, storyDefinitionFor } from './definitions';
import type { StoryComponentStatus, StoryComponentView, StoryStructure } from './types';

function storyComponentId(page: StudioPage, type: EditorialComponentId): string {
  return `${page.id}:${type}`;
}

export function buildStoryStructure(page: StudioPage | null, grammar: PageGrammarDefinition | null): StoryStructure | null {
  if (!page || !grammar) return null;

  const present = new Set<EditorialComponentId>(page.components ?? []);
  const allowed = new Set<EditorialComponentId>(grammar.story.map((rule) => rule.id));

  const story: StoryComponentView[] = grammar.story.map((rule) => {
    const definition = storyDefinitionFor(rule.id);
    const status: StoryComponentStatus = present.has(rule.id)
      ? 'present'
      : rule.required
        ? 'missing_required'
        : 'available';

    return {
      id: storyComponentId(page, rule.id),
      type: rule.id,
      label: rule.label,
      role: definition.role,
      description: definition.description,
      required: rule.required,
      status
    };
  });

  for (const id of present) {
    if (allowed.has(id)) continue;
    const definition = storyDefinitionFor(id);
    story.push({
      id: storyComponentId(page, id),
      type: id,
      label: id,
      role: definition.role,
      description: definition.description,
      required: false,
      status: 'unexpected'
    });
  }

  return {
    grammar,
    story,
    editorialFrame: grammar.editorialFrame.map(editorialFrameDefinitionFor),
    annotations: [],
    presentCount: story.filter((component) => component.status === 'present').length,
    missingRequiredCount: story.filter((component) => component.status === 'missing_required').length,
    availableOptionalCount: story.filter((component) => component.status === 'available').length
  };
}

export function presentStoryComponents(structure: StoryStructure | null): StoryComponentView[] {
  return structure?.story.filter((component) => component.status === 'present') ?? [];
}

export function availableStoryComponents(structure: StoryStructure | null): StoryComponentView[] {
  return structure?.story.filter((component) => component.status === 'available') ?? [];
}

export function missingStoryComponents(structure: StoryStructure | null): StoryComponentView[] {
  return structure?.story.filter((component) => component.status === 'missing_required') ?? [];
}
