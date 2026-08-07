import type { PageRole, StudioPage, StudioProject } from './project';
import { loadEditorialWorld } from './worlds';
import type { EditorialWorldDefinition } from './worlds/types';

export type WorkspaceSectionId = 'book' | 'destinations' | 'journey' | 'workflow' | 'memories';

export interface WorkspaceSection {
  id: WorkspaceSectionId;
  label: string;
  description: string;
  pages: StudioPage[];
}

export interface EditorialWorldView {
  id: string;
  name: string;
  companionName: string;
  companionId: string;
  isReference: boolean;
  referenceNumber?: number;
  character: readonly string[];
  designLanguage: readonly string[];
  pageGrammars: EditorialWorldDefinition['pageGrammars'];
}

const sectionForRole: Record<PageRole, WorkspaceSectionId> = {
  front_matter: 'book',
  destination: 'destinations',
  journey_knowledge: 'journey',
  workflow: 'workflow',
  notes: 'memories',
  closing_memory: 'memories'
};

const sectionMeta: Record<WorkspaceSectionId, Omit<WorkspaceSection, 'pages'>> = {
  book: {
    id: 'book',
    label: 'Buch',
    description: 'Einstieg und Orientierung'
  },
  destinations: {
    id: 'destinations',
    label: 'Reiseziele',
    description: 'Orte und Etappen'
  },
  journey: {
    id: 'journey',
    label: 'Reisebegleitung',
    description: 'Wissen für unterwegs'
  },
  workflow: {
    id: 'workflow',
    label: 'Fotografie',
    description: 'Bildentwicklung und Praxis'
  },
  memories: {
    id: 'memories',
    label: 'Erinnerungen',
    description: 'Notizen und Abschluss'
  }
};

export function groupPages(pages: StudioPage[]): WorkspaceSection[] {
  const grouped = new Map<WorkspaceSectionId, StudioPage[]>();

  for (const page of pages) {
    const section = sectionForRole[page.role];
    const current = grouped.get(section) ?? [];
    current.push(page);
    grouped.set(section, current);
  }

  return (Object.keys(sectionMeta) as WorkspaceSectionId[])
    .map((id) => ({ ...sectionMeta[id], pages: grouped.get(id) ?? [] }))
    .filter((section) => section.pages.length > 0);
}

export function editorialWorldFor(project: StudioProject | null): EditorialWorldView | null {
  const world = loadEditorialWorld(project?.editorialWorldId);
  if (!world) return null;

  return {
    id: world.id,
    name: world.name,
    companionName: world.companion.name,
    companionId: world.companion.id,
    isReference: world.status === 'reference',
    referenceNumber: world.referenceNumber,
    character: world.character,
    designLanguage: world.designLanguage,
    pageGrammars: world.pageGrammars
  };
}

export function projectStatus(project: StudioProject | null): string {
  if (!project) return 'Kein Projekt geöffnet';
  const migrated = project.migratedFromVersion ? ` · migriert von ${project.migratedFromVersion}` : '';
  return `${project.pageManifest.length} Seiten · Projekt gültig${migrated}`;
}

export function pageRoleLabel(role: PageRole | undefined): string {
  switch (role) {
    case 'front_matter': return 'Buch';
    case 'destination': return 'Reiseziel';
    case 'journey_knowledge': return 'Reisebegleitung';
    case 'workflow': return 'Fotografie-Workflow';
    case 'notes': return 'Notizen';
    case 'closing_memory': return 'Abschluss';
    default: return '–';
  }
}
