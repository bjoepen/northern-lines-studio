import { describe, expect, it } from 'vitest';
import { previewFor, type StudioPage } from './project';

describe('previewFor', () => {
  it('uses the selected page title in the static preview', () => {
    const page: StudioPage = {
      id: 'bergen',
      order: 10,
      type: 'destination',
      title: 'Bergen',
      content: 'content/pages/010-bergen.md',
      layout: 'destination-standard'
    };

    expect(previewFor(page).heading).toBe('Bergen');
  });
});
