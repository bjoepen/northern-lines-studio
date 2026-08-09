import type { Destination, DestinationHighlight, DestinationLayoutVariantId, DestinationPracticalInfo, StudioPage, StudioProject } from '../project';

export const DESTINATION_LAYOUT_VARIANTS: readonly DestinationLayoutVariantId[] = [
  'destination-hero-banner',
  'destination-hero-left',
  'destination-hero-right'
];

export interface DestinationDraft {
  name: string;
  subtitle: string;
  introduction: string;
  arrival: string;
  departure: string;
  timezone: string;
  reasons: string[];
  highlights: DestinationHighlight[];
  practicalInfo: DestinationPracticalInfo[];
  layoutVariant: DestinationLayoutVariantId;
}

export function destinationForPage(project: StudioProject | null, page: StudioPage | null): Destination | null {
  if (!project || page?.type !== 'destination' || !page.journeyStage) return null;
  const stage = project.journey.stages.find((entry) => entry.id === page.journeyStage);
  if (!stage) return null;
  const destinationId = stage.destinationId ?? `destination-${stage.id}`;
  return project.destinations.find((entry) => entry.id === destinationId) ?? null;
}

export function destinationDraft(destination: Destination | null, fallbackName = ''): DestinationDraft {
  return {
    name: destination?.name ?? fallbackName,
    subtitle: destination?.subtitle ?? '',
    introduction: destination?.introduction ?? '',
    arrival: destination?.journeyContext?.arrival ?? '',
    departure: destination?.journeyContext?.departure ?? '',
    timezone: destination?.journeyContext?.timezone ?? '',
    reasons: [...(destination?.reasons ?? [])],
    highlights: (destination?.highlights ?? []).map((entry) => ({ ...entry })),
    practicalInfo: (destination?.practicalInfo ?? []).map((entry) => ({ ...entry })),
    layoutVariant: destination?.editorial?.layoutVariant ?? 'destination-hero-banner'
  };
}

export function destinationLayoutLabel(layout: DestinationLayoutVariantId): string {
  switch (layout) {
    case 'destination-hero-banner': return 'Weite';
    case 'destination-hero-left': return 'Bild links';
    case 'destination-hero-right': return 'Bild rechts';
  }
}

export function destinationDurationLabel(arrival?: string, departure?: string): string {
  if (!arrival?.trim() || !departure?.trim()) return 'Aufenthalt noch offen';
  return `${arrival.trim()} → ${departure.trim()}`;
}
