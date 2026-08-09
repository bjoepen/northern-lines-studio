import { describe, expect, it } from 'vitest';
import { destinationContentCapacity } from './capacity';

describe('destination content capacity', () => {
  it('keeps a concise destination comfortable', () => {
    expect(destinationContentCapacity({
      name: 'Bergen', subtitle: 'Tor zu den Fjorden', introduction: 'Hanse, Hafen und Aussicht.',
      reasons: ['Bryggen am Morgen'], highlights: [], practicalInfo: []
    })).toBe('comfortable');
  });

  it('marks dense editorial content without shrinking or discarding it', () => {
    expect(destinationContentCapacity({
      name: 'Geirangerfjord', subtitle: 'Zwischen Wasserfällen und steilen Felswänden',
      introduction: 'x'.repeat(320), reasons: Array.from({ length: 7 }, () => 'x'.repeat(70)),
      highlights: Array.from({ length: 6 }, (_, i) => ({ id: `h-${i}`, name: 'Aussichtspunkt', description: 'x'.repeat(90), category: 'viewpoint' })),
      practicalInfo: Array.from({ length: 4 }, (_, i) => ({ id: `p-${i}`, title: 'Hinweis', text: 'x'.repeat(100) }))
    })).toBe('overflow');
  });
});
