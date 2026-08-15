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
      { id: 'category', label: 'Art', placeholder: 'z. B. Markt, Gericht, Café, Spezialität' },
      { id: 'why', label: 'Was macht es besonders?', placeholder: 'Kurze redaktionelle Einordnung', multiline: true },
      { id: 'guidance', label: 'Hinweis', placeholder: 'Optionaler Praxis-Hinweis', multiline: true },
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

export function interestEntryComposition(entries: readonly DestinationInterestEntry[], hasMapReference = false): 'single' | 'two-up' | 'grouped' {
  if (entries.length <= 1) return 'single';
  const lengths = entries.map(interestEntryContentLength);
  const total = lengths.reduce((sum, value) => sum + value, 0);
  const longest = Math.max(...lengths, 0);
  if (entries.length === 2 && !hasMapReference && total <= 700 && longest <= 390) return 'two-up';
  return 'grouped';
}
