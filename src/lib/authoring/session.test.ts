import { describe, expect, it } from 'vitest';
import type { StudioPage } from '../project';
import { authoredComponentCount, authoringIsDirty, authoringViewFor, withAuthoringEntry } from './index';

const page: StudioPage = {
  id: 'page-bergen', order: 10, type: 'destination', role: 'destination', title: 'Bergen',
  content: 'content/pages/010-bergen.md', layout: 'destination-standard', components: ['title', 'introduction']
};

describe('editorial story workspace authoring state', () => {
  it('detects unsaved semantic changes', () => {
    const view = authoringViewFor(page, 'introduction', 'Einleitung');
    expect(authoringIsDirty(view, 'Neue Einleitung', 'draft')).toBe(true);
    expect(authoringIsDirty(view, '', 'empty')).toBe(false);
  });

  it('counts only persisted non-empty story elements', () => {
    const updated = withAuthoringEntry(page, { componentId: 'introduction', content: 'Text', status: 'draft' });
    expect(authoredComponentCount(updated)).toBe(1);
  });
});
