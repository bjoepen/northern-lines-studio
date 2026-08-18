import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const app = read('src/App.svelte');
const weather = read('src/lib/travel-companion-weather.ts');
const grammar = read('src/lib/grammar/definitions.ts');
const rust = read('src-tauri/src/lib.rs');
const css = read('src/styles/travel-companion-weather.css');
const lightCss = read('src/styles/travel-companion-light.css');
const dna = read('docs/PRODUCT-DNA.md');

const checks = [
  ['dedicated weather companion preview', app.includes("selectedPage.knowledgeType === 'travel_weather'") && app.includes('CURATED_WEATHER_SITUATIONS')],
  ['curated core contains four researched weather situations', ['rain', 'wind', 'fog', 'cloud'].every((id) => weather.includes(`id: '${id}'`))],
  ['research provenance uses authoritative meteorological sources', weather.includes("publisher: 'Met Office'") && weather.includes('National Weather Service (NOAA)')],
  ['weather page uses Travel Companion grammar', grammar.includes("name: 'Travel Companion · Wetter'")],
  ['travel-specific note uses introduction semantics', grammar.includes("optional('introduction', 'Für diese Reise')")],
  ['Build 031 migrates to 0.16.0', rust.includes('const CURRENT_FORMAT_VERSION: &str = "0.16.0";') && rust.includes('const BUILD_031_FORMAT_VERSION: &str = "0.15.0";')],
  ['weather components are normalized on migration', rust.includes('ensure_weather_companion_components') && rust.includes('["title", "weather_guidance", "photography", "introduction"]')],
  ['weather uses shared Travel Companion page geometry', css.includes('padding: 0;') && css.includes('grid-template-columns: repeat(3, minmax(0, 1fr));')],
  ['weather keeps an optional journey note below curated core', app.includes('weather-companion-journey-note') && app.includes('Für diese Reise')],
  ['Travel Companion inspector values stay quiet', lightCss.includes('.travel-companion-curated-facts strong') && lightCss.includes('font-size: 10px;') && app.includes('travel-companion-inspector-title')],
  ['Product DNA records Travel Companion Master', dna.includes('Travel Companion Master') && dna.includes('Licht') && dna.includes('Wetter')],
  ['Native HTML default controls not introduced in weather page', !app.includes('<button>Abbrechen</button>')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}
console.log('\x1b[32mTravel Companion · Wetter Consistency Gate: PASS\x1b[0m');
