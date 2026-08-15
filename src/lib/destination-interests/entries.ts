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

export type InterestEntryComposition = 'single' | 'two-up' | 'grouped';
export type InterestPageDensity = 'comfortable' | 'tight';

export interface InterestPageLayoutState {
  composition: InterestEntryComposition;
  density: InterestPageDensity;
  overflow: boolean;
}

export function interestEntryComposition(
  entries: readonly DestinationInterestEntry[],
  hasMapReference = false,
  kind?: DestinationInterestKind
): InterestEntryComposition {
  if (entries.length <= 1) return 'single';
  const lengths = entries.map(interestEntryContentLength);
  const total = lengths.reduce((sum, value) => sum + value, 0);
  const longest = Math.max(...lengths, 0);

  // A place reference is semantic metadata, not a rendered map. Culinary entries may
  // therefore still use two balanced boxes when both recommendations remain concise.
  // A future real map gets its own capacity reservation and may change composition.
  const allowsTwoUpWithPlaceReference = kind === 'culinary_local';
  const placeReferenceAllowsTwoUp = !hasMapReference || allowsTwoUpWithPlaceReference;
  const totalBudget = kind === 'culinary_local' ? 760 : 700;
  const longestBudget = kind === 'culinary_local' ? 420 : 390;

  if (entries.length === 2 && placeReferenceAllowsTwoUp && total <= totalBudget && longest <= longestBudget) return 'two-up';
  return 'grouped';
}

export function interestPageLayoutState(
  kind: DestinationInterestKind | undefined,
  entries: readonly DestinationInterestEntry[],
  introductionLength = 0
): InterestPageLayoutState {
  const hasPlaceReference = entries.some((entry) => Boolean(entry.fields.placeReference?.trim()));
  const composition = interestEntryComposition(entries, hasPlaceReference, kind);
  const lengths = entries.map(interestEntryContentLength);
  const total = lengths.reduce((sum, value) => sum + value, 0);
  const longest = Math.max(...lengths, 0);

  if (kind === 'culinary_local') {
    // Culinary pages often carry several explanatory fields. Use exactly one bounded
    // compact step; never keep shrinking type to force content into the page.
    const weighted = total + Math.round(introductionLength * 0.55);
    const overflow = entries.length > 3
      || longest > 540
      || (composition === 'grouped' && weighted > 840)
      || (composition === 'two-up' && weighted > 980);
    const density: InterestPageDensity = weighted > 610 || longest > 350 || entries.length > 2
      ? 'tight'
      : 'comfortable';
    return { composition, density, overflow };
  }

  const weighted = total + introductionLength;
  const density: InterestPageDensity = weighted > 850 || (hasPlaceReference && weighted > 650) || entries.length > 2
    ? 'tight'
    : 'comfortable';
  const overflow = weighted > 1250 || entries.length > 3;
  return { composition, density, overflow };
}
