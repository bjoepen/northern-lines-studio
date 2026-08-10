import { describe, expect, it } from 'vitest';
import { destinationContentCapacity, destinationExtensionComposition, destinationModuleComposition, destinationTitleComposition } from './capacity';

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
  it('counts editorial extensions as real page capacity without shrinking type', () => {
    expect(destinationContentCapacity({
      name: 'Bergen', subtitle: 'Tor zu den Fjorden', introduction: 'Kurz.',
      reasons: [], highlights: [], practicalInfo: [],
      editorialExtensions: Array.from({ length: 5 }, (_, i) => ({ id: `e-${i}`, kind: 'knowledge', title: 'Wissen', text: 'x'.repeat(180) }))
    })).toBe('overflow');
  });

});


describe('destination module composition', () => {
  it('uses three columns only for three compact editorial groups', () => {
    expect(destinationModuleComposition({
      name: 'Bergen', subtitle: '', introduction: '',
      reasons: ['Hafen'],
      highlights: [{ id: 'h-1', name: 'Bryggen', description: '', category: 'landmark' }],
      practicalInfo: [{ id: 'p-1', title: 'Zu Fuß', text: 'Gut erreichbar.' }]
    })).toBe('three');
  });

  it('falls back to two columns when three groups become text-heavy', () => {
    expect(destinationModuleComposition({
      name: 'Bergen', subtitle: '', introduction: '',
      reasons: ['x'.repeat(180), 'x'.repeat(180)],
      highlights: [{ id: 'h-1', name: 'Bryggen', description: 'x'.repeat(220), category: 'landmark' }],
      practicalInfo: [{ id: 'p-1', title: 'Unterwegs', text: 'x'.repeat(220) }]
    })).toBe('two');
  });
});


describe('adaptive destination title composition', () => {
  it('keeps Bergen balanced', () => {
    expect(destinationTitleComposition({ name: 'Bergen', introduction: 'Kurzer Einstieg.' })).toBe('balanced');
  });

  it('gives Stavanger and Geiranger more title room without breaking the word', () => {
    expect(destinationTitleComposition({ name: 'Stavanger', introduction: 'Kurzer Einstieg.' })).toBe('title-wide');
    expect(destinationTitleComposition({ name: 'Geiranger', introduction: 'Kurzer Einstieg.' })).toBe('title-wide');
  });

  it('stacks the introduction when a very long place name needs the full title zone', () => {
    expect(destinationTitleComposition({ name: 'Llanfairpwllgwyngyll', introduction: 'Ein ruhiger Einstieg.' })).toBe('stacked');
  });
});

describe('adaptive editorial extension composition', () => {
  const extension = (id: string, text: string) => ({ id, kind: 'knowledge' as const, title: id, text });

  it('keeps two compact extensions balanced', () => {
    expect(destinationExtensionComposition([extension('Wissen', 'Kurz.'), extension('Tipp', 'Kurz.')])).toBe('balanced');
  });

  it('gives a longer first extension more width', () => {
    expect(destinationExtensionComposition([extension('Wissen', 'x'.repeat(220)), extension('Tipp', 'Kurz.')])).toBe('wide-first');
  });

  it('stacks dense extensions instead of forcing a 50/50 row', () => {
    expect(destinationExtensionComposition([extension('Wissen', 'x'.repeat(420)), extension('Geschichte', 'x'.repeat(360))])).toBe('stacked');
  });
});
