import type { PageGrammarId } from '../grammar/types';

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
