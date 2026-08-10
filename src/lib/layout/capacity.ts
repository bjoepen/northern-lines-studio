import type { DestinationHighlight, DestinationPracticalInfo } from '../project';

export type DestinationContentCapacity = 'comfortable' | 'tight' | 'overflow';
export type DestinationModuleComposition = 'single' | 'two' | 'three';

export interface DestinationCapacityInput {
  name: string;
  subtitle: string;
  introduction: string;
  reasons: string[];
  highlights: DestinationHighlight[];
  practicalInfo: DestinationPracticalInfo[];
}

function textWeight(value: string, divisor: number): number {
  return Math.ceil(value.trim().length / divisor);
}

/**
 * Fast editorial-preview heuristic only. It never changes typography, content,
 * persisted data or authoritative Publisher geometry.
 */
export function destinationContentCapacity(input: DestinationCapacityInput): DestinationContentCapacity {
  const highlightWeight = input.highlights.reduce((sum, item) =>
    sum + 2 + textWeight(item.name, 26) + textWeight(item.description ?? '', 44), 0);
  const practicalWeight = input.practicalInfo.reduce((sum, item) =>
    sum + 2 + textWeight(item.title, 24) + textWeight(item.text, 42), 0);
  const reasonWeight = input.reasons.reduce((sum, reason) => sum + 1 + textWeight(reason, 44), 0);
  const score =
    textWeight(input.name, 18) +
    textWeight(input.subtitle, 30) +
    textWeight(input.introduction, 58) +
    reasonWeight + highlightWeight + practicalWeight;

  if (score >= 34) return 'overflow';
  if (score >= 23) return 'tight';
  return 'comfortable';
}


/**
 * Chooses one of the small number of allowed editorial module compositions.
 * This is preview grammar, never free grid geometry and never persisted.
 */
export function destinationModuleComposition(input: DestinationCapacityInput): DestinationModuleComposition {
  const reasons = input.reasons.filter((reason) => reason.trim());
  const highlights = input.highlights.filter((item) => item.name.trim() || (item.description ?? '').trim());
  const practical = input.practicalInfo.filter((item) => item.title.trim() || item.text.trim());

  const activeCount = Number(reasons.length > 0) + Number(highlights.length > 0) + Number(practical.length > 0);
  if (activeCount <= 1) return 'single';
  if (activeCount === 2) return 'two';

  const compactWeight =
    reasons.reduce((sum, value) => sum + textWeight(value, 52), 0) +
    highlights.reduce((sum, item) => sum + textWeight(item.name, 30) + textWeight(item.description ?? '', 58), 0) +
    practical.reduce((sum, item) => sum + textWeight(item.title, 28) + textWeight(item.text, 54), 0);

  return compactWeight <= 14 ? 'three' : 'two';
}
