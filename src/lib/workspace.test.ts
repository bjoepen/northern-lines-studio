import { describe, expect, it } from 'vitest';
import type { StudioPage, StudioProject } from './project';
import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus } from './workspace';

const pages: StudioPage[] = [
  { id: 'cover', order: 1, type: 'cover', role: 'front_matter', title: 'Cover', content: 'cover.md', layout: 'cover-standard' },
  { id: 'bergen', order: 10, type: 'destination', role: 'destination', title: 'Bergen', content: 'bergen.md', layout: 'destination-standard', journeyStage: 'bergen' },
  { id: 'light', order: 30, type: 'knowledge', role: 'journey_knowledge', title: 'Licht', content: 'light.md', layout: 'knowledge-light' },
  { id: 'on1', order: 50, type: 'workflow', role: 'workflow', title: 'ON1 Photo RAW', content: 'on1.md', layout: 'workflow-on1' },
  { id: 'notes', order: 90, type: 'notes', role: 'notes', title: 'Notizen', content: 'notes.md', layout: 'notes-standard' },
  { id: 'closing', order: 99, type: 'closing', role: 'closing_memory', title: 'Abschluss', content: 'closing.md', layout: 'closing-memory' }
];

function project(): StudioProject {
  return {
    format: 'northern-lines-studio-project',
    formatVersion: '0.3.0',
    projectId: 'sample',
    title: 'Norwegen Fieldbook',
    language: 'de',
    editorialWorldId: 'fjord',
    journey: {
      id: 'norway-2026',
      title: 'Norwegen 2026',
      type: 'cruise',
      stages: [{ id: 'bergen', kind: 'destination', title: 'Bergen', country: 'Norway' }]
    },
    document: { pageFormat: 'A5', orientation: 'portrait' },
    pageManifest: pages,
    projectPath: '/tmp/sample.nls'
  };
}

describe('workspace model', () => {
  it('groups pages by editorial role, not by technical page type', () => {
    expect(groupPages(pages).map((section) => section.label)).toEqual([
      'Buch',
      'Reiseziele',
      'Reisebegleitung',
      'Fotografie',
      'Erinnerungen'
    ]);
  });

  it('exposes the Fjord reference world and companion', () => {
    expect(editorialWorldFor(project())).toEqual({
      id: 'fjord',
      name: 'Fjord',
      companionName: 'Papageientaucher',
      companionId: 'puffin',
      isReference: true,
      referenceNumber: 1,
      character: ['calm', 'spacious', 'nordic', 'photographic', 'reflective'],
      designLanguage: ['Northern', 'Calm', 'Image-led'],
      pageGrammars: ['cover', 'welcome', 'contents', 'destination', 'light', 'weather', 'workflow', 'notes', 'closing']
    });
  });

  it('returns a calm project status instead of a technical build state', () => {
    expect(projectStatus(project())).toBe('6 Seiten · Projekt gültig');
  });

  it('uses author-facing labels for page roles', () => {
    expect(pageRoleLabel('closing_memory')).toBe('Abschluss');
    expect(pageRoleLabel('journey_knowledge')).toBe('Reisebegleitung');
  });
});
