import { describe, expect, it } from 'vitest';
import type { StudioProject } from '../project';
import { destinationDraft, destinationForPage, destinationLayoutLabel } from './index';

const project: StudioProject = {
  format: 'northern-lines-studio-project',
  formatVersion: '0.8.0',
  projectId: 'norway',
  title: 'Norway',
  language: 'de',
  journey: {
    id: 'norway-journey', title: 'Norway', type: 'cruise',
    stages: [{ id: 'bergen', kind: 'destination', title: 'Bergen', destinationId: 'destination-bergen' }]
  },
  destinations: [{
    id: 'destination-bergen', name: 'Bergen', subtitle: 'Tor zu den Fjorden', reasons: ['Bryggen'],
    highlights: [], practicalInfo: [], editorial: { layoutVariant: 'destination-hero-banner' }
  }],
  document: { pageFormat: 'A5', orientation: 'portrait' },
  pageManifest: [{ id: 'page-bergen', order: 5, type: 'destination', role: 'destination', title: 'Bergen', content: 'bergen.md', layout: 'destination-hero-banner', journeyStage: 'bergen' }],
  projectPath: '/tmp/Norway.nls'
};

describe('destination profiles', () => {
  it('resolves a destination through the route stage stable reference', () => {
    expect(destinationForPage(project, project.pageManifest[0])?.subtitle).toBe('Tor zu den Fjorden');
  });

  it('creates an editable non-destructive draft', () => {
    const draft = destinationDraft(project.destinations[0]);
    draft.reasons.push('Fløyen');
    expect(project.destinations[0].reasons).toEqual(['Bryggen']);
  });

  it('uses editorial language for layout variants', () => {
    expect(destinationLayoutLabel('destination-hero-right')).toBe('Bild rechts');
  });
});
