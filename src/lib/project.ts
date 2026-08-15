import type { EditorialComponentId } from './grammar/types';
import type { AuthoringEntry } from './authoring/types';

export type PageType =
  | 'cover'
  | 'welcome'
  | 'contents'
  | 'planning'
  | 'destination'
  | 'destination_interest'
  | 'knowledge'
  | 'workflow'
  | 'notes'
  | 'closing';

export type PageRole =
  | 'front_matter'
  | 'journey_planning'
  | 'destination'
  | 'journey_knowledge'
  | 'workflow'
  | 'notes'
  | 'closing_memory';

export type JourneyStageKind = 'destination' | 'landscape' | 'journey';

export type DestinationInterestKind =
  | 'photography'
  | 'hiking_nature'
  | 'culture_history'
  | 'culinary_local';

export interface StudioPage {
  id: string;
  order: number;
  type: PageType;
  role: PageRole;
  title: string;
  content: string;
  layout: string;
  journeyStage?: string;
  destinationInterestKind?: DestinationInterestKind;
  knowledgeType?: string;
  components?: EditorialComponentId[];
  authoring?: Partial<Record<EditorialComponentId, AuthoringEntry>>;
}

export interface JourneyStage {
  id: string;
  kind: JourneyStageKind;
  title: string;
  country?: string;
  destinationId?: string;
}

export type DestinationLayoutVariantId =
  | 'destination-hero-banner'
  | 'destination-hero-left'
  | 'destination-hero-right';

export interface DestinationJourneyContext {
  arrival?: string;
  departure?: string;
  timezone?: string;
}

export interface DestinationHighlight {
  id: string;
  name: string;
  description: string;
  category: 'landmark' | 'viewpoint' | 'architecture' | 'nature' | 'culture' | 'photography' | 'other';
}

export interface DestinationPracticalInfo {
  id: string;
  title: string;
  text: string;
}

export type EditorialExtensionKind =
  | 'knowledge'
  | 'photo_spot'
  | 'tip'
  | 'souvenir'
  | 'important'
  | 'history';

export interface DestinationEditorialExtension {
  id: string;
  kind: EditorialExtensionKind;
  title: string;
  text: string;
}

export interface DestinationImages {
  wide?: string;
  portrait?: string;
  /** Compatibility only for pre-final Build 022 projects. */
  left?: string;
  /** Compatibility only for pre-final Build 022 projects. */
  right?: string;
}

export interface Destination {
  id: string;
  name: string;
  subtitle?: string;
  introduction?: string;
  journeyContext?: DestinationJourneyContext;
  reasons: string[];
  highlights: DestinationHighlight[];
  practicalInfo: DestinationPracticalInfo[];
  editorialExtensions: DestinationEditorialExtension[];
  images?: DestinationImages;
  editorial: {
    layoutVariant: DestinationLayoutVariantId;
  };
}

export interface Journey {
  id: string;
  title: string;
  type: string;
  startDate?: string;
  endDate?: string;
  departurePlace?: string;
  returnPlace?: string;
  transport?: string;
  routeSummary?: string;
  travelFocus?: string[];
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
  destinations: Destination[];
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
  planning: {
    eyebrow: 'Deine Reise',
    heading: 'Reiseplanung',
    body: 'Route, Reisezeit und alles, was deine nächste Geschichte vorbereitet.'
  },
  destination: {
    eyebrow: 'Reiseziel',
    heading: 'Unterwegs im Norden',
    body: 'Der Ort in Kürze · Geschichte & Hintergründe · Fotografie & Erleben'
  },
  destination_interest: {
    eyebrow: 'Dein Erlebnis',
    heading: 'Mehr von diesem Ort',
    body: 'Eine thematische Vertiefung für das, was dir auf dieser Reise wichtig ist.'
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

const previewAuthoringPriority: readonly EditorialComponentId[] = [
  'introduction',
  'history',
  'photography',
  'knowledge',
  'souvenirs',
  'quote',
  'closing_text',
  'notes_area',
  'workflow_steps',
  'weather_guidance',
  'light_phases'
];

function authoredPreviewContent(page: StudioPage): { heading?: string; body?: string } {
  const authoredTitle = page.authoring?.title?.content.trim();
  const bodyEntry = previewAuthoringPriority
    .map((id) => page.authoring?.[id]?.content.trim())
    .find((content) => Boolean(content));

  return {
    heading: authoredTitle || page.title,
    body: bodyEntry || undefined
  };
}

export function previewFor(page: StudioPage | null): PreviewContent {
  if (!page) return emptyPreview;
  const base = previewCopy[page.type];
  const authored = authoredPreviewContent(page);
  return {
    ...base,
    heading: authored.heading ?? page.title,
    body: authored.body ?? base.body
  };
}

export function journeyStageFor(project: StudioProject | null, page: StudioPage | null): JourneyStage | null {
  if (!project || !page?.journeyStage) return null;
  return project.journey.stages.find((stage) => stage.id === page.journeyStage) ?? null;
}
