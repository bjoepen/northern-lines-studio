import { describe, expect, it } from 'vitest';
import type { DestinationInterestEntry } from '../project';
import { interestEntryComposition, interestPageLayoutState } from './entries';

const culinary = (id: string, title: string, fields: Record<string, string>): DestinationInterestEntry => ({
  id,
  kind: 'culinary_recommendation',
  title,
  fields
});


const hiking = (id: string, title: string, fields: Record<string, string>): DestinationInterestEntry => ({
  id,
  kind: 'hiking_route',
  title,
  fields
});

describe('Interest Page layout state', () => {
  it('restores the Bergen culinary capacity warning after every approved composition is exhausted', () => {
    const entries = [
      culinary('skillingsbolle', 'Skillingsbolle bei Baker Brun', {
        category: 'lokale Spezialität / Bäckerei',
        why: 'Die Skillingsbolle gilt als typische Bergener Spezialität; Visit Bergen hebt sie ausdrücklich als lokale Tradition hervor.',
        try: 'Frisch gebackene Skillingsbolle mit Zimt und Zucker',
        guidance: 'Baker Brun Svensgården liegt direkt in Bryggen.',
        placeReference: 'Bryggen 27, Bergen'
      }),
      culinary('fisketorget', 'Bergener Fischmarkt / Mathallen', {
        category: 'Markt / Seafood',
        why: 'Der Fischmarkt ist seit dem 13. Jahrhundert ein zentraler Handelsplatz Bergens und verbindet damit lokale Geschichte und heutige Esskultur.',
        try: 'Frischer Fisch und Meeresfrüchte; alternativ klassische Bergener Fischsuppe. Fisch und Seafood gehören ohnehin stark zur lokalen Küche.',
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
    expect(state.overflow).toBe(true);
    expect(interestEntryComposition(entries, true, 'culinary_local')).not.toBe('single');
  });

  it('keeps the Geiranger two-route page renderable when the full Skageflå safety note is present', () => {
    const entries = [
      hiking('fosserasa', 'Fosseråsa → Storsæterfossen', {
        startPoint: 'Geiranger Zentrum / Norwegian Fjord Centre',
        duration: 'ca. 4 h hin und zurück ab Fjord Centre',
        difficulty: 'Mittel',
        highlights: 'Storsæterfossen, Wasserfall, Wald- und Kulturlandschaft',
        guidance: 'längerer Anstieg; stellenweise Steinstufen, bei Nässe vorsichtig'
      }),
      hiking('skagefla', 'Skagehola → Skageflå → Homlong', {
        startPoint: 'Skagehola, nur per Boot erreichbar',
        duration: 'etwa 3–4 h Wanderzeit plus Bootstransfer',
        difficulty: 'Anspruchsvoll',
        highlights: 'Skageflå, Geirangerfjord, Blick zu den Sieben Schwestern',
        guidance: 'Sehr steile und teilweise ausgesetzte Abschnitte; Trittsicherheit erforderlich.'
      })
    ];

    const state = interestPageLayoutState('hiking_nature', entries, 83);
    expect(state.overflow).toBe(false);
    expect(state.composition).toBe('two-up');
    expect(state.density).toBe('comfortable');
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
