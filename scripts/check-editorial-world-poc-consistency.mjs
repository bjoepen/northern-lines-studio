import fs from 'node:fs';
const read = (p) => fs.readFileSync(p, 'utf8');
const app = read('src/App.svelte');
const worlds = read('src/lib/worlds/index.ts');
const baltic = read('src/lib/worlds/baltic/world.ts');
const layout = read('src/lib/layout/baltic.ts');
const css = read('src/styles/editorial-worlds.css');
const rust = read('src-tauri/src/lib.rs');
const companion = read('src/lib/companions/registry.ts');
const required = [
  [worlds.includes('balticWorld'), 'Ostsee World registry'],
  [baltic.includes("name: 'Ostsee'"), 'Ostsee world definition'],
  [layout.includes("worldId: 'baltic'"), 'Ostsee layout language'],
  [companion.includes("id: 'baltic-otter'") && companion.includes("status: 'active'"), 'active Fischotter'],
  [app.includes('update_editorial_world') && app.includes('Welt wechseln'), 'traveller-facing World switch'],
  [app.includes("$: worldPageClass = editorialWorld ? `${editorialWorld.id}-page` : '';") && app.includes('class={`a5-page ${worldPageClass}`}'), 'Ostsee preview expression'],
  [rust.includes('fn update_editorial_world') && rust.includes('BALTIC_WORLD_ID'), 'persisted World switch'],
  [css.includes('.baltic-page') && css.includes('--baltic-amber'), 'world-specific palette expression'],
  [css.includes('.destination-extension-zone.extension-souvenir'), 'world-specific extension expression']
];
const failed = required.filter(([ok]) => !ok);
if (failed.length) {
  for (const [, label] of failed) console.error(`Editorial World PoC: \x1b[31mFAIL\x1b[0m · ${label}`);
  process.exit(1);
}
console.log('Editorial World PoC Consistency Gate: \x1b[32mPASS\x1b[0m');
