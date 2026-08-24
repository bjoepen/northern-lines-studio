import type { StudioPage } from './project';

export const CURATED_CHECKLIST_KNOWLEDGE_TYPES = ['curated_checklist_1', 'curated_checklist_2'] as const;
export type CuratedChecklistKnowledgeType = typeof CURATED_CHECKLIST_KNOWLEDGE_TYPES[number];

export interface CuratedChecklistSection {
  id: string;
  label: string;
  items: readonly string[];
}

export interface CuratedChecklistDefinition {
  knowledgeType: CuratedChecklistKnowledgeType;
  part: 1 | 2;
  title: string;
  deck: string;
  sections: readonly CuratedChecklistSection[];
  closingNote?: string;
}

const CHECKLIST_DEFINITIONS: readonly CuratedChecklistDefinition[] = [
  {
    knowledgeType: 'curated_checklist_1',
    part: 1,
    title: 'Checkliste',
    deck: 'Die wichtigen Dinge vor der Reise – ruhig gesammelt, damit im Kopf mehr Platz für Vorfreude bleibt.',
    sections: [
      {
        id: 'travel-documents',
        label: 'Reise & Dokumente',
        items: [
          'Ausweis / Reisepass',
          'Tickets & Buchungsunterlagen',
          'Versicherung & wichtige Nachweise',
          'Zahlungsmittel',
          'Notfallkontakte',
          'Führerschein / notwendige Reisedokumente'
        ]
      },
      {
        id: 'photography',
        label: 'Fotografie',
        items: [
          'Kamera',
          'Objektive',
          'Akkus',
          'Ladegerät',
          'Speicherkarten',
          'Filter & kleines Zubehör',
          'Reinigungstuch / Blasebalg'
        ]
      },
      {
        id: 'personal',
        label: 'Kleidung & Persönliches',
        items: [
          'Wetterfeste Jacke',
          'Kleidung in Schichten',
          'Bequeme, wetterfeste Schuhe',
          'Medikamente',
          'Kulturbeutel',
          'Sonnen- und Regenschutz'
        ]
      }
    ]
  },
  {
    knowledgeType: 'curated_checklist_2',
    part: 2,
    title: 'Checkliste',
    deck: 'Noch einmal kurz durchgehen – dann kann die Reise beginnen.',
    sections: [
      {
        id: 'outdoor',
        label: 'Unterwegs & Outdoor',
        items: [
          'Tagesrucksack',
          'Trinkflasche',
          'Kleine Reiseapotheke',
          'Mütze / Handschuhe je nach Reiseziel',
          'Sonnenbrille',
          'Kleiner Wetterschutz für unterwegs'
        ]
      },
      {
        id: 'technology',
        label: 'Technik',
        items: [
          'Smartphone',
          'Ladekabel',
          'Powerbank',
          'Kopfhörer',
          'Steckdosenadapter, falls nötig',
          'Offline-Karten / wichtige Dokumente lokal verfügbar'
        ]
      },
      {
        id: 'before-departure',
        label: 'Vor der Abreise',
        items: [
          'Wetter noch einmal prüfen',
          'Akkus laden',
          'Speicherkarten leeren / prüfen',
          'Wichtige Buchungen kontrollieren',
          'Adresse & Anreise zum Startpunkt prüfen',
          'Zuhause alles geregelt'
        ]
      }
    ],
    closingNote: 'Die kleinen Dinge: Stift, ein paar Pflaster, etwas Bargeld – und genug Platz für das, was unterwegs unerwartet wichtig wird.'
  }
] as const;

export function curatedChecklistDefinitionFor(knowledgeType: string | undefined): CuratedChecklistDefinition | null {
  return CHECKLIST_DEFINITIONS.find((definition) => definition.knowledgeType === knowledgeType) ?? null;
}

export function isCuratedChecklistPage(page: StudioPage | null | undefined): boolean {
  return page?.type === 'knowledge' && curatedChecklistDefinitionFor(page.knowledgeType) !== null;
}

export function curatedChecklistPages(): StudioPage[] {
  return CHECKLIST_DEFINITIONS.map((definition) => ({
    id: `page-curated-checklist-${definition.part}`,
    order: 27 + definition.part,
    type: 'knowledge',
    role: 'notes',
    title: `Checkliste · ${definition.part}/2`,
    content: `curated://checklist/${definition.part}`,
    layout: 'curated-checklist',
    knowledgeType: definition.knowledgeType,
    components: []
  }));
}
