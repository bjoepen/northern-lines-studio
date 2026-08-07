import { describe, expect, it } from 'vitest';
import { journeyStageFor, previewFor, type StudioPage, type StudioProject } from './project';

const destinationPage: StudioPage = {
  id: 'bergen',
  order: 10,
  type: 'destination',
  role: 'destination',
  title: 'Bergen',
  content: 'content/pages/010-bergen.md',
  layout: 'destination-standard',
  journeyStage: 'bergen',
  components: ['hero', 'title', 'introduction', 'history', 'photography', 'knowledge', 'qr']
};

const project: StudioProject = {
  format: 'northern-lines-studio-project',
  formatVersion: '0.4.0',
  projectId: 'sample',
  title: 'Norwegen Fieldbook',
  language: 'de',
  journey: {
    id: 'norway-2026',
    title: 'Norwegen 2026',
    type: 'cruise',
    stages: [{ id: 'bergen', kind: 'destination', title: 'Bergen', country: 'Norway' }]
  },
  document: { pageFormat: 'A5', orientation: 'portrait' },
  pageManifest: [destinationPage],
  projectPath: '/tmp/sample.nls'
};

describe('project domain model', () => {
  it('uses the selected page title in the static preview', () => {
    expect(previewFor(destinationPage).heading).toBe('Bergen');
  });

  it('uses a neutral Northern Lines invitation when no project page is selected', () => {
    expect(previewFor(null).heading).toBe('Deine Reise beginnt hier.');
  });

  it('resolves the journey stage for a destination page', () => {
    expect(journeyStageFor(project, destinationPage)?.title).toBe('Bergen');
  });

  it('returns no journey stage for a non-stage page', () => {
    expect(journeyStageFor(project, { ...destinationPage, journeyStage: undefined })).toBeNull();
  });
});
