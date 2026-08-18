import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const app = read('src/App.svelte');
const light = read('src/lib/travel-companion-light.ts');
const grammar = read('src/lib/grammar/definitions.ts');
const rust = read('src-tauri/src/lib.rs');
const css = read('src/styles/travel-companion-light.css');
const dna = read('docs/PRODUCT-DNA.md');

const checks = [
  ['dedicated light companion preview', app.includes("selectedPage.knowledgeType === 'photography_light'") && app.includes('CURATED_LIGHT_PHASES')],
  ['research provenance stays with content', light.includes('NOAA Global Monitoring Laboratory') && light.includes('Met Office') && light.includes('timeanddate.com')],
  ['light page uses Travel Companion grammar', grammar.includes("name: 'Travel Companion · Licht'")],
  ['travel-specific note uses introduction semantics', grammar.includes("optional('introduction', 'Für diese Reise')")],
  ['Build 031 remains supported after Build 032 migration', rust.includes('const CURRENT_FORMAT_VERSION: &str = "0.16.0";') && rust.includes('const BUILD_031_FORMAT_VERSION: &str = "0.15.0";')],
  ['light components are normalized on migration', rust.includes('ensure_light_companion_components') && rust.includes('["title", "light_phases", "photography", "introduction"]')],
  ['light page follows shared A5 geometry', css.includes('padding: 0;') && css.includes('grid-template-columns: repeat(3, minmax(0, 1fr));')],
  ['light preview no longer introduces extra page rule or redundant eyebrow', !app.includes('light-companion-page-rule') && !app.includes('<p class="eyebrow">Reisebegleitung</p>')],
  ['Product DNA records reusable companion principle', dna.includes('Travel Companion Pages') && dna.includes('kuratiertes, wiederverwendbares Wissen')],
  ['Product DNA forbids nested page safe zones', dna.includes('Page Geometry ist einmalig, nicht verschachtelt') && dna.includes('Safe-Zones sind semantisch, nicht dekorativ')],
  ['Native HTML default controls not introduced in light page', !app.includes('<button>Abbrechen</button>')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}
console.log('\x1b[32mTravel Companion · Licht Consistency Gate: PASS\x1b[0m');
