export interface CuratedLightPhase {
  id: 'golden' | 'blue' | 'civil' | 'cloud';
  label: string;
  orientation: string;
  description: string;
  photography: string;
}

export interface CuratedLightSource {
  title: string;
  publisher: string;
  url: string;
  supports: string[];
}

/**
 * Curated Northern Lines knowledge. These statements are deliberately kept
 * stable and general: no destination-specific times are baked into the page.
 * Exact times belong to a date/location-aware future layer.
 */
export const CURATED_LIGHT_PHASES: readonly CuratedLightPhase[] = [
  {
    id: 'golden',
    label: 'Goldenes Licht',
    orientation: 'Rund um Sonnenauf- und -untergang',
    description: 'Steht die Sonne tief, wirkt direktes Licht häufig wärmer und weicher; Konturen und Schatten werden stärker modelliert.',
    photography: 'Gut für Landschaft, Architektur und Menschen. Entscheidend ist nicht eine feste Uhrzeit, sondern Sonnenstand, Wetter und Blickrichtung.'
  },
  {
    id: 'blue',
    label: 'Blaue Stunde',
    orientation: 'In der Dämmerung',
    description: 'Die Blaue Stunde ist kein astronomisch fest definierter Zeitraum. Sie beschreibt eine dunklere Dämmerungsphase mit tiefblauer Himmelswirkung.',
    photography: 'Besonders stark, wenn warmes Kunstlicht auf den kühlen Himmel trifft. Stativ oder stabile Auflage helfen bei längeren Belichtungszeiten.'
  },
  {
    id: 'civil',
    label: 'Zivile Dämmerung',
    orientation: 'Sonne bis 6° unter dem Horizont',
    description: 'Die zivile Dämmerung ist astronomisch definiert: Die Sonne steht höchstens 6° unter dem Horizont. Der Himmel besitzt noch deutliches Restlicht.',
    photography: 'Eine verlässliche Orientierung für Übergangslicht. In hohen Breiten kann diese Phase – je nach Jahreszeit – deutlich länger dauern.'
  },
  {
    id: 'cloud',
    label: 'Bedeckter Himmel',
    orientation: 'Weiches, richtungsarmes Licht',
    description: 'Wolkentröpfchen streuen sichtbares Sonnenlicht über viele Richtungen. Dichte Bewölkung reduziert den direkten Anteil und schwächt harte Schatten.',
    photography: 'Sehr brauchbar für Details, Farben, Wald, Fassaden und ruhige Portraits. Ein bedeckter Tag ist fotografisch kein verlorener Tag.'
  }
] as const;

export const CURATED_LIGHT_GUIDANCE = [
  'Goldene und Blaue Stunde sind keine festen 60-Minuten-Fenster. Dauer und Zeitpunkt hängen von Breitengrad, Jahreszeit und Sonnenstand ab.',
  'Wetter, Wolken, Dunst und Partikel verändern Farbe, Kontrast und Intensität des Lichts – Planung bleibt deshalb Orientierung, keine Garantie.',
  'Für ein konkretes Motiv zählt neben der Uhrzeit immer auch die Richtung des Lichts.'
] as const;

export const CURATED_LIGHT_SOURCES: readonly CuratedLightSource[] = [
  {
    title: 'Golden Hour – When Sunlight Turns Magical',
    publisher: 'timeanddate.com',
    url: 'https://www.timeanddate.com/astronomy/golden-hour.html',
    supports: ['Goldenes Licht', 'Breitengrad und Jahreszeit', 'tiefer Sonnenstand']
  },
  {
    title: 'The Blue Hour',
    publisher: 'timeanddate.com',
    url: 'https://www.timeanddate.com/astronomy/blue-hour.html',
    supports: ['Blaue Stunde', 'Dämmerung', 'keine offizielle Einheitsdefinition']
  },
  {
    title: 'Solar Calculator Glossary',
    publisher: 'NOAA Global Monitoring Laboratory',
    url: 'https://gml.noaa.gov/grad/solcalc/glossary.html',
    supports: ['Zivile Dämmerung', 'Sonnenhöhe']
  },
  {
    title: 'Why are clouds white?',
    publisher: 'Met Office',
    url: 'https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/clouds/why-are-clouds-white',
    supports: ['Lichtstreuung in Wolken']
  }
] as const;
