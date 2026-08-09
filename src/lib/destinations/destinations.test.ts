import { describe, expect, it } from 'vitest';
import type { StudioProject } from '../project';
import { destinationDraft, destinationForPage, destinationImageGeometry, destinationImagePath, destinationImageRole, destinationIsDirty, destinationLayoutLabel, formatTravelTime, normalizeTravelTimeInput } from './index';

const project: StudioProject = {
  format: 'northern-lines-studio-project',
  formatVersion: '0.9.0',
  projectId: 'norway',
  title: 'Norway',
  language: 'de',
  journey: {
    id: 'norway-journey', title: 'Norway', type: 'cruise',
    stages: [{ id: 'bergen', kind: 'destination', title: 'Bergen', destinationId: 'destination-bergen' }]
  },
  destinations: [{
    id: 'destination-bergen', name: 'Bergen', subtitle: 'Tor zu den Fjorden', reasons: ['Bryggen'],
    highlights: [], practicalInfo: [], images: { wide: 'assets/destinations/destination-bergen/wide.jpg', portrait: 'assets/destinations/destination-bergen/portrait.jpg' }, editorial: { layoutVariant: 'destination-hero-banner' }
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

  it('maps each page effect to its semantic image role', () => {
    expect(destinationImageRole('destination-hero-banner')).toBe('wide');
    expect(destinationImageRole('destination-hero-left')).toBe('portrait');
    expect(destinationImageRole('destination-hero-right')).toBe('portrait');
    expect(destinationImagePath(project.destinations[0], 'wide')).toContain('/wide.jpg');
    expect(destinationImagePath(project.destinations[0], 'portrait')).toContain('/portrait.jpg');
    expect(destinationImageGeometry('wide').ratio).toBe('ca. 3:1–4:1');
    expect(destinationImageGeometry('portrait').ratio).toBe('ca. 2:3');
  });
  it('detects unsaved destination changes across nested editorial fields', () => {
    const clean = destinationDraft(project.destinations[0]);
    expect(destinationIsDirty(project.destinations[0], clean)).toBe(false);

    const changedHighlight = destinationDraft(project.destinations[0]);
    changedHighlight.highlights.push({ id: 'highlight-bryggen', name: 'Bryggen', description: 'Am Morgen', category: 'landmark' });
    expect(destinationIsDirty(project.destinations[0], changedHighlight)).toBe(true);

    const changedPractical = destinationDraft(project.destinations[0]);
    changedPractical.practicalInfo.push({ id: 'practical-rain', title: 'Regen', text: 'Jacke griffbereit halten' });
    expect(destinationIsDirty(project.destinations[0], changedPractical)).toBe(true);
  });

  it('uses Travel Language time formatting without storing the word Uhr as UI burden', () => {
    expect(normalizeTravelTimeInput('08:00 Uhr')).toBe('08:00');
    expect(formatTravelTime('08:00')).toBe('08:00 Uhr');
    expect(formatTravelTime('morgens')).toBe('morgens');
    expect(formatTravelTime('')).toBe('offen');
  });

});
