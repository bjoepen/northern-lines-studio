import type { DestinationHighlight, DestinationPracticalInfo } from '../project';

export type DestinationContentCapacity = 'comfortable' | 'tight' | 'overflow';

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
