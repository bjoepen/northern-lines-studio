import type { Destination, DestinationHighlight, DestinationLayoutVariantId, DestinationPracticalInfo, StudioPage, StudioProject } from '../project';

export const DESTINATION_LAYOUT_VARIANTS: readonly DestinationLayoutVariantId[] = [
  'destination-hero-banner',
  'destination-hero-left',
  'destination-hero-right'
];

export type DestinationImageRole = 'wide' | 'left' | 'right';

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
    arrival: normalizeTravelTimeInput(destination?.journeyContext?.arrival),
    departure: normalizeTravelTimeInput(destination?.journeyContext?.departure),
    timezone: destination?.journeyContext?.timezone ?? '',
    reasons: [...(destination?.reasons ?? [])],
    highlights: (destination?.highlights ?? []).map((entry) => ({ ...entry })),
    practicalInfo: (destination?.practicalInfo ?? []).map((entry) => ({ ...entry })),
    layoutVariant: destination?.editorial?.layoutVariant ?? 'destination-hero-banner'
  };
}

export function destinationIsDirty(destination: Destination | null, draft: DestinationDraft, fallbackName = ''): boolean {
  const persisted = destinationDraft(destination, fallbackName);
  return JSON.stringify(persisted) !== JSON.stringify({
    ...draft,
    arrival: normalizeTravelTimeInput(draft.arrival),
    departure: normalizeTravelTimeInput(draft.departure)
  });
}

export function destinationLayoutLabel(layout: DestinationLayoutVariantId): string {
  switch (layout) {
    case 'destination-hero-banner': return 'Weite';
    case 'destination-hero-left': return 'Bild links';
    case 'destination-hero-right': return 'Bild rechts';
  }
}

export function destinationImageRole(layout: DestinationLayoutVariantId): DestinationImageRole {
  switch (layout) {
    case 'destination-hero-banner': return 'wide';
    case 'destination-hero-left': return 'left';
    case 'destination-hero-right': return 'right';
  }
}

export function destinationImageRoleLabel(role: DestinationImageRole): string {
  switch (role) {
    case 'wide': return 'Weite';
    case 'left': return 'Bild links';
    case 'right': return 'Bild rechts';
  }
}

export function destinationImagePath(destination: Destination | null, role: DestinationImageRole): string {
  return destination?.images?.[role] ?? '';
}

export function destinationImageGeometry(role: DestinationImageRole): { ratio: string; pixels: string; millimetres: string } {
  if (role === 'wide') {
    return { ratio: 'ca. 4:1', pixels: '2400 × 600 px', millimetres: 'ca. 118–122 × 26–32 mm' };
  }
  return { ratio: 'ca. 2:3', pixels: '1500 × 2250 px', millimetres: 'ca. 48–56 × 78–92 mm' };
}

export function normalizeTravelTimeInput(value?: string): string {
  return value?.trim().replace(/\s+Uhr$/i, '') ?? '';
}

export function formatTravelTime(value?: string): string {
  const normalized = normalizeTravelTimeInput(value);
  if (!normalized) return 'offen';
  return /^\d{1,2}:\d{2}$/.test(normalized) ? `${normalized} Uhr` : normalized;
}

export function destinationDurationLabel(arrival?: string, departure?: string): string {
  if (!arrival?.trim() || !departure?.trim()) return 'Aufenthalt noch offen';
  return `${arrival.trim()} → ${departure.trim()}`;
}
