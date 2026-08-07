import type { EditorialComponentId, EditorialFrameComponentId, PageGrammarDefinition } from '../grammar/types';

export type StoryLayerId = 'story' | 'editorial_frame' | 'annotations';

export type StoryComponentRole =
  | 'atmosphere'
  | 'narrative'
  | 'orientation'
  | 'place_knowledge'
  | 'photography'
  | 'knowledge'
  | 'practical'
  | 'workflow'
  | 'memory';

export type StoryComponentStatus = 'present' | 'available' | 'missing_required' | 'unexpected';

export interface StoryComponentDefinition {
  type: EditorialComponentId;
  role: StoryComponentRole;
  description: string;
}

export interface StoryComponentView {
  id: string;
  type: EditorialComponentId;
  label: string;
  role: StoryComponentRole;
  description: string;
  required: boolean;
  status: StoryComponentStatus;
}

export interface EditorialFrameComponentView {
  id: EditorialFrameComponentId;
  label: string;
  purpose: string;
}

export interface StoryStructure {
  grammar: PageGrammarDefinition;
  story: StoryComponentView[];
  editorialFrame: EditorialFrameComponentView[];
  annotations: [];
  presentCount: number;
  missingRequiredCount: number;
  availableOptionalCount: number;
}
