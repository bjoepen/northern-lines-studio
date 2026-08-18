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
  ['curated core contains four researched light situations', ['golden', 'blue', 'civil', 'cloud'].every((id) => light.includes(`id: '${id}'`))],
  ['research provenance stays with content', light.includes('NOAA Global Monitoring Laboratory') && light.includes('Met Office') && light.includes('timeanddate.com')],
  ['light page uses Travel Companion grammar', grammar.includes("name: 'Travel Companion · Licht'")],
  ['travel-specific note uses introduction semantics', grammar.includes("optional('introduction', 'Für diese Reise')")],
  ['Build 030 migrates to 0.15.0', rust.includes('const CURRENT_FORMAT_VERSION: &str = "0.15.0";') && rust.includes('const BUILD_030_FORMAT_VERSION: &str = "0.14.0";')],
  ['light components are normalized on migration', rust.includes('ensure_light_companion_components') && rust.includes('["title", "light_phases", "photography", "introduction"]')],
  ['companion and footer space remain protected by page-specific layout', css.includes('padding: 54px 44px 72px')],
  ['Product DNA records reusable companion principle', dna.includes('Travel Companion Pages') && dna.includes('kuratiertes, wiederverwendbares Wissen')],
  ['Native HTML default controls not introduced in light page', !app.includes('<button>Abbrechen</button>')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}
console.log('\x1b[32mTravel Companion · Licht Consistency Gate: PASS\x1b[0m');
