import type { DestinationInterestEntry, DestinationInterestEntryKind, DestinationInterestKind } from '../project';

export interface InterestEntryFieldDefinition {
  id: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface InterestEntrySchema {
  entryKind: DestinationInterestEntryKind;
  addLabel: string;
  singularLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  fields: readonly InterestEntryFieldDefinition[];
}

const SCHEMAS: Readonly<Record<DestinationInterestKind, InterestEntrySchema>> = {
  photography: {
    entryKind: 'photo_spot',
    addLabel: 'Fotospot hinzufügen',
    singularLabel: 'Fotospot',
    titleLabel: 'Ort / Fotospot',
    titlePlaceholder: 'z. B. Bryggen / Vågen',
    fields: [
      { id: 'description', label: 'Motiv / kurzer Charakter', placeholder: 'Was macht diesen Spot fotografisch interessant?' },
      { id: 'focalLength', label: 'Brennweite', placeholder: 'z. B. 18–35 mm' },
      { id: 'light', label: 'Licht / beste Zeit', placeholder: 'z. B. weiches Morgenlicht' },
      { id: 'motifs', label: 'Motive', placeholder: 'z. B. Fassaden, Wasser, Boote' },
      { id: 'guidance', label: 'Fotografischer Hinweis', placeholder: 'Kurzer Praxis-Hinweis', multiline: true },
      { id: 'placeReference', label: 'Ort / Kartenbezug', placeholder: 'Optionaler Karten- oder Ortsbezug' }
    ]
  },
  hiking_nature: {
    entryKind: 'hiking_route',
    addLabel: 'Route hinzufügen',
    singularLabel: 'Route',
    titleLabel: 'Route / Tour',
    titlePlaceholder: 'z. B. Fosseråsa – Storsæterfossen',
    fields: [
      { id: 'description', label: 'Kurzcharakter', placeholder: 'Was zeichnet diese Tour aus?' },
      { id: 'startPoint', label: 'Startpunkt', placeholder: 'z. B. Geiranger Zentrum' },
      { id: 'duration', label: 'Dauer', placeholder: 'z. B. ca. 4 h' },
      { id: 'difficulty', label: 'Schwierigkeit', placeholder: 'z. B. Mittel' },
      { id: 'highlights', label: 'Aussicht & Naturziele', placeholder: 'Was lohnt sich unterwegs?', multiline: true },
      { id: 'guidance', label: 'Hinweise zur Strecke', placeholder: 'Was sollte man vor dem Losgehen wissen?', multiline: true },
      { id: 'placeReference', label: 'Ort / Kartenbezug', placeholder: 'Optionaler Karten- oder Ortsbezug' }
    ]
  },
  culture_history: {
    entryKind: 'culture_place',
    addLabel: 'Ort / Station hinzufügen',
    singularLabel: 'Ort / Station',
    titleLabel: 'Ort / Station',
    titlePlaceholder: 'z. B. Museum, Bauwerk oder historischer Ort',
    fields: [
      { id: 'category', label: 'Art', placeholder: 'z. B. Museum, Architektur, Geschichte' },
      { id: 'why', label: 'Warum lohnt es sich?', placeholder: 'Kurze redaktionelle Einordnung', multiline: true },
      { id: 'guidance', label: 'Besuchshinweis', placeholder: 'Was sollte man für den Besuch wissen?', multiline: true },
      { id: 'timeReference', label: 'Zeitbezug', placeholder: 'Optional, z. B. morgens, 1–2 h oder saisonal' },
      { id: 'placeReference', label: 'Ort / Kartenbezug', placeholder: 'Optionaler Karten- oder Ortsbezug' }
    ]
  },
  culinary_local: {
    entryKind: 'culinary_recommendation',
    addLabel: 'Empfehlung hinzufügen',
    singularLabel: 'Empfehlung',
    titleLabel: 'Ort / Empfehlung',
    titlePlaceholder: 'z. B. Markt, Café, Gericht oder lokale Adresse',
    fields: [
      { id: 'category', label: 'Art', placeholder: 'z. B. Gericht, Café, Markt, Spezialität oder lokaler Laden' },
      { id: 'why', label: 'Warum lohnt es sich?', placeholder: 'Was macht diese Empfehlung für den Ort besonders?', multiline: true },
      { id: 'try', label: 'Probieren & entdecken', placeholder: 'Was sollte man hier probieren, entdecken oder mitnehmen?', multiline: true },
      { id: 'guidance', label: 'Gut zu wissen', placeholder: 'Was sollte man vor Ort beachten?', multiline: true },
      { id: 'timePrice', label: 'Zeit / Preis', placeholder: 'Optional, z. B. vormittags, saisonal oder €€' },
      { id: 'placeReference', label: 'Ort / Kartenbezug', placeholder: 'Optionaler Karten- oder Ortsbezug' }
    ]
  }
};

export function interestEntrySchema(kind: DestinationInterestKind | undefined): InterestEntrySchema | null {
  return kind ? SCHEMAS[kind] ?? null : null;
}

export function emptyInterestEntry(kind: DestinationInterestKind, id: string): DestinationInterestEntry {
  const schema = SCHEMAS[kind];
  return { id, kind: schema.entryKind, title: '', fields: {} };
}

export function interestEntryContentLength(entry: DestinationInterestEntry): number {
  return entry.title.trim().length + Object.values(entry.fields).reduce((sum, value) => sum + value.trim().length, 0);
}

export type InterestEntryComposition =
  | 'single'
  | 'two-up'
  | 'one-third-two-thirds'
  | 'two-thirds-one-third'
  | 'stacked';
export type InterestPageDensity = 'comfortable' | 'tight';

export interface InterestPageLayoutState {
  composition: InterestEntryComposition;
  density: InterestPageDensity;
  overflow: boolean;
  evaluatedCompositions: readonly InterestEntryComposition[];
}

type TwoEntryComposition = Exclude<InterestEntryComposition, 'single'>;

const TWO_ENTRY_COMPOSITIONS: readonly TwoEntryComposition[] = [
  'two-up',
  'one-third-two-thirds',
  'two-thirds-one-third',
  'stacked'
];

const WIDTHS: Readonly<Record<TwoEntryComposition, readonly [number, number]>> = {
  'two-up': [0.5, 0.5],
  'one-third-two-thirds': [1 / 3, 2 / 3],
  'two-thirds-one-third': [2 / 3, 1 / 3],
  'stacked': [1, 1]
};

function fieldLineEstimate(value: string | undefined, width: number, density: InterestPageDensity): number {
  const text = value?.trim() ?? '';
  if (!text) return 0;
  const baseChars = density === 'tight' ? 78 : 72;
  const charsPerLine = Math.max(16, Math.floor(baseChars * width));
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}

function entryHeightEstimate(entry: DestinationInterestEntry, width: number, density: InterestPageDensity): number {
  const headingLines = fieldLineEstimate(entry.title, width, density);
  const categoryLines = fieldLineEstimate(entry.fields.category, width, density);
  const bodyFields = Object.entries(entry.fields).filter(([key, value]) => key !== 'category' && value.trim());
  const bodyLines = bodyFields.reduce((sum, [, value]) => sum + 0.72 + fieldLineEstimate(value, width, density), 0);
  const fieldSpacing = Math.max(0, bodyFields.length - 1) * 0.32;
  const compactFactor = density === 'tight' ? 0.9 : 1;
  return (2.4 + headingLines * 1.18 + categoryLines * 0.85 + bodyLines + fieldSpacing) * compactFactor;
}

function entryFitsWidth(entry: DestinationInterestEntry, width: number, density: InterestPageDensity): boolean {
  const length = interestEntryContentLength(entry);
  const relief = density === 'tight' ? 20 : 0;
  if (width <= 0.34) return length <= 150 + relief;
  if (width <= 0.51) return length <= 220 + relief;
  if (width <= 0.68) return length <= 360 + relief;
  return length <= 620 + relief;
}

function compositionHeightEstimate(
  composition: TwoEntryComposition,
  entries: readonly DestinationInterestEntry[],
  density: InterestPageDensity
): number {
  const widths = WIDTHS[composition];
  const heights = [
    entryHeightEstimate(entries[0], widths[0], density),
    entryHeightEstimate(entries[1], widths[1], density)
  ];
  return composition === 'stacked'
    ? heights[0] + heights[1] + (density === 'tight' ? 0.8 : 1.1)
    : Math.max(...heights);
}

function pageHeightBudget(kind: DestinationInterestKind | undefined, introductionLength: number, density: InterestPageDensity): number {
  // This is intentionally a finite editorial heuristic, not browser geometry.
  // Intro pressure reduces the usable content band while Companion/Footer stay fixed.
  // Capacity Protection is deliberately conservative: the budget ends before
  // Companion/Footer safe zones, not at the visual page edge. Culinary cards
  // carry more labelled sub-fields than the other archetypes, so their safe
  // content band is smaller. `tight` is one bounded relief step, never a licence
  // to consume the protected lower page.
  const base = kind === 'culinary_local' ? 20.0 : 22.6;
  const introPenalty = Math.min(4.6, introductionLength / 78);
  const tightRelief = density === 'tight' ? 1.5 : 0;
  return base - introPenalty + tightRelief;
}

function candidatePreference(composition: TwoEntryComposition): number {
  // Prefer balanced peers, then asymmetric editorial pairs, then stacking.
  switch (composition) {
    case 'two-up': return 0;
    case 'one-third-two-thirds': return 0.4;
    case 'two-thirds-one-third': return 0.4;
    case 'stacked': return 0.8;
  }
}

function bestFittingTwoEntryComposition(
  kind: DestinationInterestKind | undefined,
  entries: readonly DestinationInterestEntry[],
  introductionLength: number,
  density: InterestPageDensity
): InterestEntryComposition | null {
  const budget = pageHeightBudget(kind, introductionLength, density);
  const fitting = TWO_ENTRY_COMPOSITIONS
    .map((composition) => ({
      composition,
      widths: WIDTHS[composition],
      height: compositionHeightEstimate(composition, entries, density)
    }))
    .filter((candidate) => entryFitsWidth(entries[0], candidate.widths[0], density) && entryFitsWidth(entries[1], candidate.widths[1], density))
    .filter((candidate) => candidate.height <= budget)
    .sort((a, b) => (a.height + candidatePreference(a.composition)) - (b.height + candidatePreference(b.composition)));
  return fitting[0]?.composition ?? null;
}

/**
 * Finite composition search for structured Interest entries.
 * Content Fit decides the composition; Studio never chooses a pretty grid first
 * and then shrinks/clips content to make it survive. All approved two-entry
 * combinations are evaluated before tight or overflow is accepted.
 */
export function interestPageLayoutState(
  kind: DestinationInterestKind | undefined,
  entries: readonly DestinationInterestEntry[],
  introductionLength = 0
): InterestPageLayoutState {
  if (entries.length === 0) {
    return { composition: 'single', density: 'comfortable', overflow: false, evaluatedCompositions: ['single'] };
  }
  if (entries.length === 1) {
    const comfortableHeight = entryHeightEstimate(entries[0], 1, 'comfortable');
    if (comfortableHeight <= pageHeightBudget(kind, introductionLength, 'comfortable')) {
      return { composition: 'single', density: 'comfortable', overflow: false, evaluatedCompositions: ['single'] };
    }
    const tightHeight = entryHeightEstimate(entries[0], 1, 'tight');
    const overflow = tightHeight > pageHeightBudget(kind, introductionLength, 'tight');
    return { composition: 'single', density: 'tight', overflow, evaluatedCompositions: ['single'] };
  }

  if (entries.length === 2) {
    const comfortable = bestFittingTwoEntryComposition(kind, entries, introductionLength, 'comfortable');
    if (comfortable) {
      return { composition: comfortable, density: 'comfortable', overflow: false, evaluatedCompositions: TWO_ENTRY_COMPOSITIONS };
    }
    const tight = bestFittingTwoEntryComposition(kind, entries, introductionLength, 'tight');
    if (tight) {
      return { composition: tight, density: 'tight', overflow: false, evaluatedCompositions: TWO_ENTRY_COMPOSITIONS };
    }
    return { composition: 'stacked', density: 'tight', overflow: true, evaluatedCompositions: TWO_ENTRY_COMPOSITIONS };
  }

  // More than two entries are separate semantic units, never one catch-all box.
  // They stack as individual cards; compact density is the only permitted fallback.
  const comfortableTotal = entries.reduce((sum, entry) => sum + entryHeightEstimate(entry, 1, 'comfortable'), 0)
    + (entries.length - 1) * 1.1;
  if (comfortableTotal <= pageHeightBudget(kind, introductionLength, 'comfortable')) {
    return { composition: 'stacked', density: 'comfortable', overflow: false, evaluatedCompositions: ['stacked'] };
  }
  const tightTotal = entries.reduce((sum, entry) => sum + entryHeightEstimate(entry, 1, 'tight'), 0)
    + (entries.length - 1) * 0.8;
  return {
    composition: 'stacked',
    density: 'tight',
    overflow: tightTotal > pageHeightBudget(kind, introductionLength, 'tight'),
    evaluatedCompositions: ['stacked']
  };
}

/**
 * Kept as the lightweight public composition helper used by older tests/callers.
 * It delegates to the same finite candidate search so no code path can choose a
 * composition before Content Fit.
 */
export function interestEntryComposition(
  entries: readonly DestinationInterestEntry[],
  _hasMapReference = false,
  kind?: DestinationInterestKind
): InterestEntryComposition {
  return interestPageLayoutState(kind, entries, 0).composition;
}
