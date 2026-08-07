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

export interface EditorialCompanionDefinition {
  id: string;
  name: string;
  role: 'editorial_companion';
}

export interface EditorialWorldDefinition {
  id: string;
  name: string;
  referenceNumber?: number;
  status: 'reference' | 'editorial';
  character: readonly string[];
  designLanguage: readonly string[];
  companion: EditorialCompanionDefinition;
  pageGrammars: readonly PageGrammarId[];
}
