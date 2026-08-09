import type { Journey } from '../project';

export interface JourneyPlanningDraft {
  startDate: string;
  endDate: string;
  departurePlace: string;
  returnPlace: string;
  transport: string;
  routeSummary: string;
  travelFocus: string;
}

export function journeyPlanningDraft(journey: Journey): JourneyPlanningDraft {
  return {
    startDate: journey.startDate ?? '',
    endDate: journey.endDate ?? '',
    departurePlace: journey.departurePlace ?? '',
    returnPlace: journey.returnPlace ?? '',
    transport: journey.transport ?? '',
    routeSummary: journey.routeSummary ?? '',
    travelFocus: (journey.travelFocus ?? []).join(' · ')
  };
}

export function travelFocusValues(value: string): string[] {
  return value
    .split(/[·,;\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function journeyDurationDays(startDate?: string, endDate?: string): number | null {
  if (!startDate || !endDate) return null;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.floor((end - start) / 86_400_000) + 1;
}

export function journeyDurationLabel(startDate?: string, endDate?: string): string {
  const days = journeyDurationDays(startDate, endDate);
  if (days === null) return 'Noch offen';
  return days === 1 ? '1 Tag' : `${days} Tage`;
}

export function planningPreviewLines(journey: Journey): string[] {
  const lines: string[] = [];
  if (journey.startDate || journey.endDate) {
    lines.push([journey.startDate, journey.endDate].filter(Boolean).join(' – '));
  }
  const places = [journey.departurePlace, journey.returnPlace].filter(Boolean).join(' → ');
  if (places) lines.push(places);
  if (journey.transport) lines.push(journey.transport);
  if (journey.routeSummary) lines.push(journey.routeSummary);
  if (journey.travelFocus?.length) lines.push(journey.travelFocus.join(' · '));
  return lines;
}
