export type PageType = 'cover' | 'welcome' | 'contents' | 'destination' | 'notes';

export interface StudioPage {
  id: string;
  order: number;
  type: PageType;
  title: string;
  content: string;
  layout: string;
}

export interface EditorialWorld {
  id: 'fjord' | string;
  name: string;
  reference?: boolean;
  companion: {
    id: string;
    name: string;
  };
}

export interface StudioProject {
  format: 'northern-lines-studio-project';
  formatVersion: string;
  projectId: string;
  title: string;
  edition?: string;
  language: string;
  editorialWorld?: EditorialWorld;
  document: {
    pageFormat: 'A5';
    orientation: 'portrait';
  };
  pageManifest: StudioPage[];
  projectPath: string;
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
  notes: {
    eyebrow: 'Field Notes',
    heading: 'Notizen',
    body: 'Raum für Beobachtungen, Motive und Erinnerungen.'
  }
};

export function previewFor(page: StudioPage | null): PreviewContent {
  if (!page) return previewCopy.cover;
  const base = previewCopy[page.type];
  return { ...base, heading: page.title };
}
