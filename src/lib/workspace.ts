import type { PageType, StudioPage, StudioProject } from './project';

export type WorkspaceSectionId = 'book' | 'destinations' | 'journey';

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
}

const sectionForType: Record<PageType, WorkspaceSectionId> = {
  cover: 'book',
  welcome: 'book',
  contents: 'book',
  destination: 'destinations',
  notes: 'journey'
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
    description: 'Notizen und Begleitseiten'
  }
};

export function groupPages(pages: StudioPage[]): WorkspaceSection[] {
  const grouped = new Map<WorkspaceSectionId, StudioPage[]>();

  for (const page of pages) {
    const section = sectionForType[page.type];
    const current = grouped.get(section) ?? [];
    current.push(page);
    grouped.set(section, current);
  }

  return (Object.keys(sectionMeta) as WorkspaceSectionId[])
    .map((id) => ({ ...sectionMeta[id], pages: grouped.get(id) ?? [] }))
    .filter((section) => section.pages.length > 0);
}

export function editorialWorldFor(project: StudioProject | null): EditorialWorldView | null {
  if (!project?.editorialWorld) return null;

  return {
    id: project.editorialWorld.id,
    name: project.editorialWorld.name,
    companionName: project.editorialWorld.companion.name,
    companionId: project.editorialWorld.companion.id,
    isReference: project.editorialWorld.reference === true
  };
}

export function projectStatus(project: StudioProject | null): string {
  if (!project) return 'Kein Projekt geöffnet';
  return `${project.pageManifest.length} Seiten · Projekt gültig`;
}
