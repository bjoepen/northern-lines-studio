import type { PageGrammarId } from '../grammar/types';

export interface EditorialWorldDefinition {
  id: string;
  name: string;
  referenceNumber?: number;
  status: 'reference' | 'editorial';
  character: readonly string[];
  designLanguage: readonly string[];
  companionId: string;
  pageGrammars: readonly PageGrammarId[];
}
