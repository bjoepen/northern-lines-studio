import type { DestinationInterestKind, StudioPage } from '../project';

export interface DestinationInterestDefinition {
  kind: DestinationInterestKind;
  label: string;
  questionLabel: string;
  eyebrow: string;
  description: string;
}

export const DESTINATION_INTEREST_DEFINITIONS: readonly DestinationInterestDefinition[] = [
  {
    kind: 'photography',
    label: 'Fotografie',
    questionLabel: 'Fotografie',
    eyebrow: 'Fotografie',
    description: 'Motive, Licht und Fotospots – wenn du den Ort mit der Kamera entdecken möchtest.'
  },
  {
    kind: 'hiking_nature',
    label: 'Wandern & Natur',
    questionLabel: 'Wandern & Natur',
    eyebrow: 'Draußen unterwegs',
    description: 'Wege, Landschaft und Naturerlebnisse – für Zeit draußen und neue Perspektiven.'
  },
  {
    kind: 'culture_history',
    label: 'Kultur & Geschichte',
    questionLabel: 'Kultur & Geschichte',
    eyebrow: 'Kultur & Geschichte',
    description: 'Geschichte, Architektur, Museen und historische Orte – für mehr Kontext unterwegs.'
  },
  {
    kind: 'culinary_local',
    label: 'Kulinarik & Lokal',
    questionLabel: 'Kulinarik & Lokal',
    eyebrow: 'Lokal erleben',
    description: 'Regionale Küche, Märkte und lokale Besonderheiten – für den Geschmack des Ortes.'
  }
] as const;

export function destinationInterestDefinition(kind: DestinationInterestKind | undefined): DestinationInterestDefinition | null {
  return DESTINATION_INTEREST_DEFINITIONS.find((entry) => entry.kind === kind) ?? null;
}

export function destinationInterestLabel(kind: DestinationInterestKind | undefined): string {
  return destinationInterestDefinition(kind)?.label ?? 'Interesse';
}

export function destinationInterestPagesForStage(pages: readonly StudioPage[], stageId: string): StudioPage[] {
  return pages.filter((page) => page.type === 'destination_interest' && page.journeyStage === stageId);
}

export function destinationInterestKindsForStage(pages: readonly StudioPage[], stageId: string): DestinationInterestKind[] {
  return destinationInterestPagesForStage(pages, stageId)
    .map((page) => page.destinationInterestKind)
    .filter((kind): kind is DestinationInterestKind => Boolean(kind));
}
