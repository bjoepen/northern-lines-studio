import type { EditorialComponentId } from './grammar/types';
import type { AuthoringEntry } from './authoring/types';

export type PageType =
  | 'cover'
  | 'welcome'
  | 'contents'
  | 'destination'
  | 'knowledge'
  | 'workflow'
  | 'notes'
  | 'closing';

export type PageRole =
  | 'front_matter'
  | 'destination'
  | 'journey_knowledge'
  | 'workflow'
  | 'notes'
  | 'closing_memory';

export type JourneyStageKind = 'destination' | 'landscape' | 'journey';

export interface StudioPage {
  id: string;
  order: number;
  type: PageType;
  role: PageRole;
  title: string;
  content: string;
  layout: string;
  journeyStage?: string;
  knowledgeType?: string;
  components?: EditorialComponentId[];
  authoring?: Partial<Record<EditorialComponentId, AuthoringEntry>>;
}

export interface JourneyStage {
  id: string;
  kind: JourneyStageKind;
  title: string;
  country?: string;
}

export interface Journey {
  id: string;
  title: string;
  type: string;
  startDate?: string;
  endDate?: string;
  stages: JourneyStage[];
}

export interface StudioProject {
  format: 'northern-lines-studio-project';
  formatVersion: string;
  projectId: string;
  title: string;
  edition?: string;
  language: string;
  editorialWorldId?: string;
  journey: Journey;
  document: {
    pageFormat: 'A5';
    orientation: 'portrait';
  };
  pageManifest: StudioPage[];
  projectPath: string;
  migratedFromVersion?: string;
}

export interface PreviewContent {
  eyebrow: string;
  heading: string;
  body: string;
}

const previewCopy: Record<PageType, PreviewContent> = {
  cover: {
    eyebrow: 'Northern Lines',
    heading: 'Norwegen Fieldbook',
    body: 'Edition 2.0'
  },
  welcome: {
    eyebrow: 'Die Reise beginnt',
    heading: 'Willkommen',
    body: 'Orte, Licht und Erinnerungen – gesammelt für unterwegs.'
  },
  contents: {
    eyebrow: 'Orientierung',
    heading: 'Inhaltsverzeichnis',
    body: 'Eine statische Vorschau der geplanten Seitenstruktur.'
  },
  destination: {
    eyebrow: 'Reiseziel',
    heading: 'Unterwegs im Norden',
    body: 'Der Ort in Kürze · Geschichte & Hintergründe · Fotografie & Erleben'
  },
  knowledge: {
    eyebrow: 'Reisebegleitung',
    heading: 'Wissen für unterwegs',
    body: 'Licht, Wetter und fotografische Erfahrung als Teil der Reise.'
  },
  workflow: {
    eyebrow: 'Fotografie',
    heading: 'Workflow',
    body: 'Ein wiederverwendbarer Northern-Lines-Workflow für die Bildentwicklung.'
  },
  notes: {
    eyebrow: 'Field Notes',
    heading: 'Notizen',
    body: 'Raum für Beobachtungen, Motive und Erinnerungen.'
  },
  closing: {
    eyebrow: 'Erinnerung',
    heading: 'Die Reise bleibt',
    body: 'Nicht die Jahre in unserem Leben zählen – sondern das Leben in unseren Jahren.'
  }
};

const emptyPreview: PreviewContent = {
  eyebrow: 'Northern Lines',
  heading: 'Deine Reise beginnt hier.',
  body: 'Öffne ein Travelbook und gib der nächsten Reise ihren eigenen Raum.'
};

export function previewFor(page: StudioPage | null): PreviewContent {
  if (!page) return emptyPreview;
  const base = previewCopy[page.type];
  return { ...base, heading: page.title };
}

export function journeyStageFor(project: StudioProject | null, page: StudioPage | null): JourneyStage | null {
  if (!project || !page?.journeyStage) return null;
  return project.journey.stages.find((stage) => stage.id === page.journeyStage) ?? null;
}
