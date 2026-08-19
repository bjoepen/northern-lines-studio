import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const app = read('src/App.svelte');
const interestCss = read('src/styles/destination-interests.css');
const workshopCss = read('src/styles/travel-companion-workshop.css');
const heroes = read('src/lib/curated-heroes.ts');
const pkg = JSON.parse(read('package.json'));
const tauri = JSON.parse(read('src-tauri/tauri.conf.json'));
const cargo = read('src-tauri/Cargo.toml');
const dna = read('docs/PRODUCT-DNA.md');

const assetPaths = [
  'public/design-library/worlds/fjord/curated-heroes/photography.png',
  'public/design-library/worlds/fjord/curated-heroes/hiking-nature.png',
  'public/design-library/worlds/fjord/curated-heroes/culture-history.png',
  'public/design-library/worlds/fjord/curated-heroes/culinary-local.png',
  'public/design-library/worlds/fjord/curated-heroes/photography-workshop.png'
];

const checks = [
  ['five Fjord curated hero assets exist', assetPaths.every((p) => fs.existsSync(p))],
  ['hero registry is Fjord-owned', heroes.includes("worldId === 'fjord'") && heroes.includes('FJORD_CURATED_HEROES')],
  ['all four interest archetypes are mapped', ['photography:', 'hiking_nature:', 'culture_history:', 'culinary_local:'].every((x) => heroes.includes(x))],
  ['workshop hero is mapped', heroes.includes('photography_workshop:')],
  ['interest pages render the curated hero in header flow', app.includes('curated-hero-flow') && app.includes('selectedPage.destinationInterestKind')],
  ['workshop renders its curated hero', app.includes("curatedHeroFor(editorialWorld?.id, 'photography_workshop')")],
  ['hero uses float flow instead of persistent split grid', interestCss.includes('float: right') && interestCss.includes('display: flow-root') && !interestCss.includes('.curated-hero-flow {\n  display: grid')],
  ['post-header modules clear the hero flow', interestCss.includes('.curated-hero-flow::after') && interestCss.includes('clear: both')],
  ['workshop hero uses approved maximum size reference', workshopCss.includes('max-width: 136px')],
  ['hero is non-interactive', interestCss.includes('pointer-events: none') && interestCss.includes('user-select: none')],
  ['Product DNA records curated world hero contract', dna.includes('Curated World Heroes') && dna.includes('cannot choose, replace, hide or upload')],
  ['version parity is 0.35.0-alpha.1', pkg.version === '0.35.0-alpha.1' && tauri.version === '0.35.0-alpha.1' && cargo.includes('version = "0.35.0-alpha.1"')]
];

let failed = false;
for (const [name, ok] of checks) {
  if (!ok) { console.error(`FAIL: ${name}`); failed = true; }
}
if (failed) process.exit(1);
console.log('\x1b[32mBuild 035 Fjord Curated Heroes Consistency Gate: PASS\x1b[0m');
