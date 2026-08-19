import { describe, expect, it } from 'vitest';
import type { StudioPage, StudioProject } from './project';
import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus, travelbookPageNumber } from './workspace';

const pages: StudioPage[] = [
  { id: 'cover', order: 1, type: 'cover', role: 'front_matter', title: 'Cover', content: 'cover.md', layout: 'cover-standard' },
  { id: 'bergen', order: 10, type: 'destination', role: 'destination', title: 'Bergen', content: 'bergen.md', layout: 'destination-standard', journeyStage: 'bergen' },
  { id: 'light', order: 30, type: 'knowledge', role: 'journey_knowledge', title: 'Licht', content: 'light.md', layout: 'knowledge-light' },
  { id: 'on1', order: 50, type: 'workflow', role: 'workflow', title: 'ON1 Photo RAW', content: 'on1.md', layout: 'workflow-on1' },
  { id: 'notes', order: 90, type: 'notes', role: 'notes', title: 'Erinnerungen', content: 'notes.md', layout: 'notes-standard' },
  { id: 'closing', order: 99, type: 'closing', role: 'closing_memory', title: 'Abschluss', content: 'closing.md', layout: 'closing-memory' }
];

function project(): StudioProject {
  return {
    format: 'northern-lines-studio-project',
    formatVersion: '0.4.0',
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
    destinations: [],
  document: { pageFormat: 'A5', orientation: 'portrait' },
    pageManifest: pages,
    projectPath: '/tmp/sample.nls'
  };
}

describe('workspace model', () => {
  it('groups pages by editorial role, not by technical page type', () => {
    expect(groupPages(pages).map((section) => section.label)).toEqual([
      'Buch',
      'Deine Route',
      'Reisebegleitung',
      'Fotografie',
      'Erinnerungen'
    ]);
  });


  it('derives Travelbook page numbers from the current journey route', () => {
    const routePages: StudioPage[] = [
      { id: 'cover', order: 1, type: 'cover', role: 'front_matter', title: 'Cover', content: 'cover.md', layout: 'cover-standard' },
      { id: 'welcome', order: 2, type: 'welcome', role: 'front_matter', title: 'Willkommen', content: 'welcome.md', layout: 'welcome' },
      { id: 'contents', order: 3, type: 'contents', role: 'front_matter', title: 'Inhalt', content: 'contents.md', layout: 'contents' },
      { id: 'bergen', order: 4, type: 'destination', role: 'destination', title: 'Bergen', content: 'bergen.md', layout: 'destination-standard', journeyStage: 'bergen' },
      { id: 'geiranger', order: 5, type: 'destination', role: 'destination', title: 'Geiranger', content: 'geiranger.md', layout: 'destination-standard', journeyStage: 'geiranger' },
      { id: 'alesund', order: 6, type: 'destination', role: 'destination', title: 'Ålesund', content: 'alesund.md', layout: 'destination-standard', journeyStage: 'alesund' },
      { id: 'light', order: 10, type: 'knowledge', role: 'journey_knowledge', title: 'Licht', content: 'light.md', layout: 'light' }
    ];

    expect(travelbookPageNumber(routePages, 'alesund', ['bergen', 'geiranger', 'alesund'])).toBe(6);
    expect(travelbookPageNumber(routePages, 'alesund', ['bergen', 'alesund', 'geiranger'])).toBe(5);
    expect(travelbookPageNumber(routePages, 'geiranger', ['bergen', 'alesund', 'geiranger'])).toBe(6);
    expect(travelbookPageNumber(routePages, 'light', ['bergen', 'alesund', 'geiranger'])).toBe(7);
  });

  it('places journey planning between book and route', () => {
    const withPlanning: StudioPage[] = [
      ...pages,
      {
        id: 'planning',
        order: 4,
        type: 'planning',
        role: 'journey_planning',
        title: 'Reiseplanung',
        content: 'planning.md',
        layout: 'planning'
      }
    ];

    const labels = groupPages(withPlanning).map((section) => section.label);
    expect(labels.indexOf('Buch')).toBeLessThan(labels.indexOf('Reiseplanung'));
    expect(labels.indexOf('Reiseplanung')).toBeLessThan(labels.indexOf('Deine Route'));
  });

  it('exposes the Fjord reference world and companion', () => {
    expect(editorialWorldFor(project())).toEqual({
      id: 'fjord',
      name: 'Fjord',
      companionName: 'Papageientaucher',
      companionId: 'fjord-puffin',
      isReference: true,
      referenceNumber: 1,
      character: ['calm', 'spacious', 'nordic', 'photographic', 'reflective'],
      layoutSystemId: 'fjord-layout',
      layoutSystemName: 'Fjord Layout Language',
      designLanguage: ['Northern', 'Calm', 'Image-led'],
      pageGrammars: ['cover', 'welcome', 'contents', 'planning', 'destination', 'destination_interest', 'light', 'weather', 'workflow', 'notes', 'closing']
    });
  });

  it('returns a calm project status instead of a technical build state', () => {
    expect(projectStatus(project())).toBe('6 Seiten · Reise bereit');
  });

  it('uses author-facing labels for page roles', () => {
    expect(pageRoleLabel('closing_memory')).toBe('Abschluss');
    expect(pageRoleLabel('journey_knowledge')).toBe('Reisebegleitung');
  });
});
