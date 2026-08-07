export type EditorialComponentId =
  | 'hero'
  | 'title'
  | 'subtitle'
  | 'introduction'
  | 'contents'
  | 'history'
  | 'photography'
  | 'knowledge'
  | 'souvenirs'
  | 'qr'
  | 'light_phases'
  | 'weather_guidance'
  | 'workflow_steps'
  | 'workflow_tip'
  | 'notes_area'
  | 'quote'
  | 'closing_text';

export type EditorialFrameComponentId = 'header' | 'footer' | 'page_number' | 'companion';

export type PageGrammarId =
  | 'cover'
  | 'welcome'
  | 'contents'
  | 'destination'
  | 'light'
  | 'weather'
  | 'workflow'
  | 'notes'
  | 'closing';

export interface EditorialComponentRule {
  id: EditorialComponentId;
  label: string;
  required: boolean;
}

export interface PageGrammarDefinition {
  id: PageGrammarId;
  name: string;
  purpose: string;
  story: readonly EditorialComponentRule[];
  editorialFrame: readonly EditorialFrameComponentId[];
}

export interface GrammarEvaluation {
  grammar: PageGrammarDefinition;
  requiredCount: number;
  presentRequiredCount: number;
  completeness: number;
  missingRequired: EditorialComponentRule[];
  optionalAvailable: EditorialComponentRule[];
  unexpected: EditorialComponentId[];
  isComplete: boolean;
}
