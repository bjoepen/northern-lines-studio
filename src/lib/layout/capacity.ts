import type { DestinationEditorialExtension, DestinationHighlight, DestinationLayoutVariantId, DestinationPracticalInfo } from '../project';

export type DestinationContentCapacity = 'comfortable' | 'tight' | 'overflow';
export type DestinationModuleComposition = 'single' | 'two' | 'three';
export type DestinationTitleComposition = 'balanced' | 'title-wide' | 'title-dominant' | 'stacked';
export type DestinationExtensionComposition = 'single' | 'balanced' | 'wide-first' | 'wide-second' | 'stacked';

export interface DestinationCapacityInput {
  name: string;
  subtitle: string;
  introduction: string;
  reasons: string[];
  highlights: DestinationHighlight[];
  practicalInfo: DestinationPracticalInfo[];
  editorialExtensions?: DestinationEditorialExtension[];
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
  const extensionWeight = (input.editorialExtensions ?? []).reduce((sum, item) =>
    sum + 2 + textWeight(item.title, 28) + textWeight(item.text, 50), 0);
  const score =
    textWeight(input.name, 18) +
    textWeight(input.subtitle, 30) +
    textWeight(input.introduction, 58) +
    reasonWeight + highlightWeight + practicalWeight + extensionWeight;

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


/**
 * Chooses one of a small set of allowed title/intro compositions. Long place
 * names get more room before Studio moves the introduction below the title.
 * The decision is preview-only and never persists free geometry.
 */
export function destinationTitleComposition(input: Pick<DestinationCapacityInput, 'name' | 'introduction'>): DestinationTitleComposition {
  const name = input.name.trim();
  const introduction = input.introduction.trim();
  const longestWord = name.split(/\s+/).reduce((max, word) => Math.max(max, word.length), 0);

  if (longestWord >= 18 || name.length >= 30 || (longestWord >= 13 && introduction.length >= 150)) return 'stacked';
  if (longestWord >= 13 || name.length >= 23) return 'title-dominant';
  if (longestWord >= 9 || name.length >= 16) return 'title-wide';
  return 'balanced';
}

function extensionWeight(item: DestinationEditorialExtension): number {
  return 2 + textWeight(item.title, 24) + textWeight(item.text, 42);
}

/**
 * Editorial Extension Zones follow the content. Compact peers may share a row;
 * unequal content receives an asymmetric grammar state; dense content stacks.
 * This remains a finite grammar, never a user-editable grid.
 */
export function destinationExtensionComposition(extensions: DestinationEditorialExtension[] = []): DestinationExtensionComposition {
  const active = extensions.filter((item) => item.title.trim() || item.text.trim());
  if (active.length <= 1) return 'single';

  const weights = active.map(extensionWeight);
  const total = weights.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...weights);

  if (active.length > 2) return total <= 18 && max <= 7 ? 'balanced' : 'stacked';

  const [first, second] = weights;
  if (total >= 17 || (first >= 10 && second >= 10)) return 'stacked';
  if (first >= second * 1.55 && first >= 7) return 'wide-first';
  if (second >= first * 1.55 && second >= 7) return 'wide-second';
  return 'balanced';
}


export interface DestinationExtensionCapacityResult {
  state: DestinationContentCapacity;
  alternatives: DestinationLayoutVariantId[];
}

function extensionCapacityScore(input: DestinationCapacityInput, layoutVariant: DestinationLayoutVariantId): number {
  const active = (input.editorialExtensions ?? []).filter((item) => item.title.trim() || item.text.trim());
  if (!active.length) return 0;

  const extensionScore = active.reduce((sum, item) => sum + extensionWeight(item), 0);
  const corePressure =
    textWeight(input.introduction, 76) +
    input.reasons.filter(Boolean).reduce((sum, item) => sum + textWeight(item, 72), 0) +
    input.highlights.reduce((sum, item) => sum + textWeight(item.name, 52) + textWeight(item.description ?? '', 90), 0) +
    input.practicalInfo.reduce((sum, item) => sum + textWeight(item.title, 48) + textWeight(item.text, 86), 0);

  // Portrait effects can reclaim some vertical room because the hero and story
  // share the upper composition. Weite remains intentionally more conservative.
  const layoutRelief = layoutVariant === 'destination-hero-banner' ? 0 : 3;
  return extensionScore + Math.min(corePressure, 8) - layoutRelief;
}

/**
 * Hard capacity protection for optional Editorial Extension Zones. Adaptive
 * grammar may rearrange content, but it may never borrow the Companion/Footer
 * safe zone. When the finite grammar is exhausted, Studio reports overflow
 * instead of shrinking type, clipping copy or moving protected anchors.
 */
export function destinationExtensionCapacity(
  input: DestinationCapacityInput,
  layoutVariant: DestinationLayoutVariantId
): DestinationContentCapacity {
  const score = extensionCapacityScore(input, layoutVariant);
  if (score === 0) return 'comfortable';
  if (score >= 22) return 'overflow';
  if (score >= 16) return 'tight';
  return 'comfortable';
}

export function destinationExtensionCapacityResult(
  input: DestinationCapacityInput,
  layoutVariant: DestinationLayoutVariantId
): DestinationExtensionCapacityResult {
  const variants: DestinationLayoutVariantId[] = [
    'destination-hero-banner',
    'destination-hero-left',
    'destination-hero-right'
  ];
  const state = destinationExtensionCapacity(input, layoutVariant);
  const alternatives = state === 'overflow'
    ? variants.filter((variant) => variant !== layoutVariant && destinationExtensionCapacity(input, variant) !== 'overflow')
    : [];
  return { state, alternatives };
}
