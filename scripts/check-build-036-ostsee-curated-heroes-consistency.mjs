import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const heroes = read('src/lib/curated-heroes.ts');
const app = read('src/App.svelte');
const interestCss = read('src/styles/destination-interests.css');
const workshopCss = read('src/styles/travel-companion-workshop.css');
const pkg = JSON.parse(read('package.json'));
const tauri = JSON.parse(read('src-tauri/tauri.conf.json'));
const cargo = read('src-tauri/Cargo.toml');
const cargoLock = read('src-tauri/Cargo.lock');
const dna = read('docs/PRODUCT-DNA.md');

const balticAssetPaths = [
  'public/design-library/worlds/baltic/curated-heroes/photography.png',
  'public/design-library/worlds/baltic/curated-heroes/hiking-nature.png',
  'public/design-library/worlds/baltic/curated-heroes/culture-history.png',
  'public/design-library/worlds/baltic/curated-heroes/culinary-local.png',
  'public/design-library/worlds/baltic/curated-heroes/photography-workshop.png'
];

const checks = [
  ['five Ostsee curated hero assets exist', balticAssetPaths.every((p) => fs.existsSync(p))],
  ['Ostsee world owns its hero registry', heroes.includes('BALTIC_CURATED_HEROES') && heroes.includes('baltic: BALTIC_CURATED_HEROES')],
  ['Fjord hero registry remains intact', heroes.includes('FJORD_CURATED_HEROES') && heroes.includes('fjord: FJORD_CURATED_HEROES')],
  ['all four interest archetypes remain mapped', ['photography:', 'hiking_nature:', 'culture_history:', 'culinary_local:'].every((x) => heroes.includes(x))],
  ['workshop hero remains mapped', heroes.includes('photography_workshop:')],
  ['interest and workshop rendering remain world-driven', app.includes('curatedHeroFor(editorialWorld?.id') && app.includes('curated-hero-flow')],
  ['head-flow grammar remains float-based', interestCss.includes('float: right') && interestCss.includes('display: flow-root')],
  ['post-header content clears hero flow', interestCss.includes('.curated-hero-flow::after') && interestCss.includes('clear: both')],
  ['workshop maximum-size reference remains 136px', workshopCss.includes('max-width: 136px')],
  ['hero remains non-interactive', interestCss.includes('pointer-events: none') && interestCss.includes('user-select: none')],
  ['Product DNA records both World-owned hero sets', dna.includes('Ostsee Curated Heroes') && dna.includes('Fjord')],
  ['version parity remains synchronized', pkg.version === tauri.version && cargo.includes(`version = "${pkg.version}"`) && cargoLock.includes(`name = "northern-lines-studio"\nversion = "${pkg.version}"`)]
];

let failed = false;
for (const [name, ok] of checks) {
  if (!ok) { console.error(`FAIL: ${name}`); failed = true; }
}
if (failed) process.exit(1);
console.log('\x1b[32mBuild 036 Ostsee Curated Heroes Consistency Gate: PASS\x1b[0m');
