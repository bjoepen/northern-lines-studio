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
  it('evaluates every approved two-entry composition before density or overflow', () => {
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

    const state = interestPageLayoutState('culinary_local', entries, 72);
    expect(state.evaluatedCompositions).toEqual([
      'two-up',
      'one-third-two-thirds',
      'two-thirds-one-third',
      'stacked'
    ]);
    expect(['two-up', 'one-third-two-thirds', 'two-thirds-one-third', 'stacked']).toContain(state.composition);
    expect(['comfortable', 'tight']).toContain(state.density);
    expect(state.overflow).toBe(false);
    expect(interestEntryComposition(entries, true, 'culinary_local')).not.toBe('single');
  });

  it('can prefer an asymmetric pair when the second entry needs materially more width', () => {
    const entries = [
      culinary('short', 'Kleine Empfehlung', {
        category: 'Spezialität',
        why: 'Kurz und lokal.',
        try: 'Probieren.'
      }),
      culinary('longer', 'Ausführlicher Marktbesuch', {
        category: 'Markt',
        why: 'Ein deutlich längerer redaktioneller Text, der mehr Breite benötigt, damit die Seite ruhig und ohne unnötige Zeilenumbrüche komponiert werden kann.'.repeat(2),
        guidance: 'Auch der Besuchshinweis ist ausführlicher und verlangt nach einer breiteren zweiten Spalte.'
      })
    ];
    const state = interestPageLayoutState('culinary_local', entries, 30);
    expect(['one-third-two-thirds', 'stacked']).toContain(state.composition);
  });

  it('uses overflow instead of inventing a third smaller typography state', () => {
    const entries = [
      culinary('long', 'Sehr ausführliche Empfehlung', {
        why: 'x'.repeat(900),
        try: 'y'.repeat(420),
        guidance: 'z'.repeat(420)
      })
    ];
    const state = interestPageLayoutState('culinary_local', entries, 120);
    expect(state.density).toBe('tight');
    expect(state.overflow).toBe(true);
  });
});
