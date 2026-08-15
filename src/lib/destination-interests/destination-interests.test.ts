import { describe, expect, it } from 'vitest';
import type { StudioPage } from '../project';
import { DESTINATION_INTEREST_DEFINITIONS, destinationInterestKindsForStage, destinationInterestLabel } from './index';

describe('destination interest pages', () => {
  it('keeps the initial vocabulary deliberately small', () => {
    expect(DESTINATION_INTEREST_DEFINITIONS.map((entry) => entry.kind)).toEqual([
      'photography', 'hiking_nature', 'culture_history', 'culinary_local'
    ]);
  });

  it('derives interests from pages linked to the destination stage', () => {
    const pages: StudioPage[] = [
      { id: 'bergen', order: 1, type: 'destination', role: 'destination', title: 'Bergen', content: 'bergen.md', layout: 'destination', journeyStage: 'bergen' },
      { id: 'bergen-photo', order: 2, type: 'destination_interest', role: 'destination', title: 'Fotografie', content: 'photo.md', layout: 'destination-interest', journeyStage: 'bergen', destinationInterestKind: 'photography' },
      { id: 'alesund-history', order: 3, type: 'destination_interest', role: 'destination', title: 'Kultur & Geschichte', content: 'history.md', layout: 'destination-interest', journeyStage: 'alesund', destinationInterestKind: 'culture_history' }
    ];
    expect(destinationInterestKindsForStage(pages, 'bergen')).toEqual(['photography']);
    expect(destinationInterestLabel('culture_history')).toBe('Kultur & Geschichte');
  });
});
