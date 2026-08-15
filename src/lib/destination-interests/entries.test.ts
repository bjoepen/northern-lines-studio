import { describe, expect, it } from 'vitest';
import type { DestinationInterestEntry } from '../project';
import { interestEntryComposition, interestPageLayoutState } from './entries';

const culinary = (id: string, title: string, fields: Record<string, string>): DestinationInterestEntry => ({
  id,
  kind: 'culinary_recommendation',
  title,
  fields
});

describe('Interest Page layout state', () => {
  it('keeps two real-world culinary recommendations side by side even with textual place references', () => {
    const entries = [
      culinary('skillingsbolle', 'Skillingsbolle bei Baker Brun', {
        category: 'lokale Spezialität / Bäckerei',
        why: 'Die Skillingsbolle gilt als typische Bergener Spezialität und lokale Tradition.',
        try: 'Frisch gebackene Skillingsbolle mit Zimt und Zucker',
        guidance: 'Baker Brun Svensgården liegt direkt in Bryggen.',
        placeReference: 'Bryggen 27, Bergen'
      }),
      culinary('fisketorget', 'Bergener Fischmarkt / Mathallen', {
        category: 'Markt / Seafood',
        why: 'Der Fischmarkt ist ein historischer Handelsplatz und verbindet lokale Geschichte und heutige Esskultur.',
        try: 'Frischer Fisch, Meeresfrüchte oder klassische Bergener Fischsuppe.',
        guidance: 'Die Markthallen sind ganzjährig geöffnet; der Außenmarkt ist saisonal.',
        placeReference: 'Torget, Bergen'
      })
    ];

    expect(interestEntryComposition(entries, true, 'culinary_local')).toBe('two-up');
    const state = interestPageLayoutState('culinary_local', entries, 72);
    expect(state.composition).toBe('two-up');
    expect(['comfortable', 'tight']).toContain(state.density);
    expect(state.overflow).toBe(false);
  });

  it('uses overflow instead of inventing a third smaller typography state', () => {
    const entries = [
      culinary('long', 'Sehr ausführliche Empfehlung', {
        why: 'x'.repeat(560),
        try: 'y'.repeat(180),
        guidance: 'z'.repeat(180)
      })
    ];
    expect(interestPageLayoutState('culinary_local', entries, 120).overflow).toBe(true);
  });
});
