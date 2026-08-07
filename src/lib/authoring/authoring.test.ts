import { describe, expect, it } from 'vitest';
import type { StudioPage } from '../project';
import {
  authoringCompletion,
  authoringViewFor,
  withAuthoringEntry
} from './index';

const page: StudioPage = {
  id: 'page-bergen',
  order: 10,
  type: 'destination',
  role: 'destination',
  title: 'Bergen',
  content: 'content/pages/010-bergen.md',
  layout: 'destination-standard',
  components: ['title', 'introduction']
};

describe('semantic authoring', () => {
  it('uses the page title as the initial title authoring value', () => {
    expect(authoringViewFor(page, 'title', 'Titel')?.content).toBe('Bergen');
  });

  it('stores authored values by semantic component id', () => {
    const updated = withAuthoringEntry(page, {
      componentId: 'introduction',
      content: 'Ankommen zwischen sieben Bergen.',
      status: 'draft'
    });

    const introduction = updated.authoring?.introduction;

    if (!introduction) {
      throw new Error('Expected introduction authoring entry to exist');
    }

    expect(introduction.content).toContain('sieben Bergen');
  });

  it('reports completion only for persisted non-empty authored components', () => {
    const updated = withAuthoringEntry(page, {
      componentId: 'introduction',
      content: 'Text',
      status: 'revised'
    });

    expect(authoringCompletion(updated)).toBe(50);
  });
});
