import { describe, expect, it } from 'vitest';
import type { StudioPage, StudioProject } from './project';
import { editorialWorldFor, groupPages, projectStatus } from './workspace';

const pages: StudioPage[] = [
  { id: 'cover', order: 1, type: 'cover', title: 'Cover', content: 'cover.md', layout: 'cover-standard' },
  { id: 'bergen', order: 10, type: 'destination', title: 'Bergen', content: 'bergen.md', layout: 'destination-standard' },
  { id: 'notes', order: 90, type: 'notes', title: 'Notizen', content: 'notes.md', layout: 'notes-standard' }
];

function project(): StudioProject {
  return {
    format: 'northern-lines-studio-project',
    formatVersion: '0.1.0',
    projectId: 'sample',
    title: 'Norwegen Fieldbook',
    language: 'de',
    editorialWorld: {
      id: 'fjord',
      name: 'Fjord',
      reference: true,
      companion: { id: 'puffin', name: 'Papageientaucher' }
    },
    document: { pageFormat: 'A5', orientation: 'portrait' },
    pageManifest: pages,
    projectPath: '/tmp/sample.nls'
  };
}

describe('workspace model', () => {
  it('groups pages into author-facing sections', () => {
    expect(groupPages(pages).map((section) => section.label)).toEqual([
      'Buch',
      'Reiseziele',
      'Reisebegleitung'
    ]);
  });

  it('exposes the Fjord reference world and companion', () => {
    expect(editorialWorldFor(project())).toEqual({
      id: 'fjord',
      name: 'Fjord',
      companionName: 'Papageientaucher',
      companionId: 'puffin',
      isReference: true
    });
  });

  it('returns a calm project status instead of a technical build state', () => {
    expect(projectStatus(project())).toBe('3 Seiten · Projekt gültig');
  });
});
