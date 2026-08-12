import type { PageGrammarId } from '../grammar/types';

export interface EditorialWorldDefinition {
  id: string;
  name: string;
  referenceNumber?: number;
  status: 'reference' | 'editorial';
  character: readonly string[];
  designLanguage: readonly string[];
  companionId: string;
  layoutSystemId: string;
  companionName: string;
  layoutSystemName: string;
  pageGrammars: readonly PageGrammarId[];
}
