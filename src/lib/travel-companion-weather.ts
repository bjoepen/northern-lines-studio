export interface CuratedWeatherSituation {
  id: 'rain' | 'wind' | 'fog' | 'cloud';
  label: string;
  orientation: string;
  description: string;
  travel: string;
}

export interface CuratedWeatherSource {
  title: string;
  publisher: string;
  url: string;
  supports: string[];
}

/**
 * Curated Northern Lines companion knowledge.
 * The core stays deliberately general. Destination/date-specific forecasts
 * belong to a future live-weather or journey-specific layer.
 */
export const CURATED_WEATHER_SITUATIONS: readonly CuratedWeatherSituation[] = [
  {
    id: 'rain',
    label: 'Regen & Nässe',
    orientation: 'Sicht und Untergrund verändern sich',
    description: 'Schon mäßiger Regen kann die Sicht verschlechtern. Nasse Wege und Straßen brauchen mehr Aufmerksamkeit und Zeit.',
    travel: 'Regen ist kein Grund, einen Ort abzuschreiben: Plane Reserve, schütze empfindliche Ausrüstung und rechne mit rutschigeren Flächen.'
  },
  {
    id: 'wind',
    label: 'Wind & Böen',
    orientation: 'Exponierte Orte reagieren stärker',
    description: 'Wind kann in Böen deutlich kräftiger sein als der mittlere Wind. An offenen Küsten, Brücken und Höhenlagen fällt das besonders auf.',
    travel: 'Wind erhöht bei Kälte den Wärmeverlust des Körpers. Kleidung und Aufenthaltsdauer sollten deshalb nicht nur zur Lufttemperatur passen.'
  },
  {
    id: 'fog',
    label: 'Nebel & Sicht',
    orientation: 'Fernsicht kann sehr schnell verschwinden',
    description: 'Meteorologisch gilt Sichtweite unter 1.000 Metern als Nebel. Nebel kann lokal und fleckenweise auftreten und sich rasch verändern.',
    travel: 'Weniger Sicht verändert Orientierung und Verkehr. Bei dichterem Nebel sind mehr Zeit, geringeres Tempo und lokale Warnungen wichtiger als der ursprüngliche Plan.'
  },
  {
    id: 'cloud',
    label: 'Wolken & Wandel',
    orientation: 'Wolken zeigen Bewegung in der Atmosphäre',
    description: 'Wolken entstehen, wenn feuchte Luft aufsteigt, abkühlt und Wasserdampf zu kleinen Tröpfchen kondensiert. Form und Menge können sich schnell verändern.',
    travel: 'Wolken gehören zur Reise, nicht nur zur Prognose: Sie beeinflussen Sicht, Licht und die Wirkung einer Landschaft – und machen Wetterlagen sichtbar.'
  }
] as const;

export const CURATED_WEATHER_SOURCES: readonly CuratedWeatherSource[] = [
  {
    title: 'Travelling in storms, rain and strong wind',
    publisher: 'Met Office',
    url: 'https://weather.metoffice.gov.uk/warnings-and-advice/seasonal-advice/travel/travelling-in-storms-rain-and-wind',
    supports: ['Regen reduziert Sicht', 'nasse Flächen und Reiseplanung', 'Böen an exponierten Stellen']
  },
  {
    title: 'What does this forecast mean?',
    publisher: 'Met Office',
    url: 'https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean',
    supports: ['mittlerer Wind und Böen', 'Sichtweite']
  },
  {
    title: 'How fog affects travel',
    publisher: 'Met Office',
    url: 'https://weather.metoffice.gov.uk/warnings-and-advice/seasonal-advice/travel/how-fog-affects-travel',
    supports: ['Nebel unter 1.000 m Sichtweite', 'lokaler und wechselnder Nebel', 'Reiseauswirkungen']
  },
  {
    title: 'Clouds',
    publisher: 'Met Office',
    url: 'https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/clouds',
    supports: ['Wolkenbildung', 'Kondensation', 'variable Wolkenformen']
  },
  {
    title: 'Wind Chill Safety',
    publisher: 'National Weather Service (NOAA)',
    url: 'https://www.weather.gov/bou/windchill',
    supports: ['Wind erhöht Wärmeverlust des Körpers bei Kälte']
  }
] as const;
