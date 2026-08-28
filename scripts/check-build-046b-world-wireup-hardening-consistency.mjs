import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 046B World Wire-up gate failed: ${message}`);
}

const app = fs.readFileSync('src/App.svelte', 'utf8');
const companionLayouts = fs.readFileSync('src/lib/companions/layout.ts', 'utf8');

must(app.includes("import { companionVisibleForRole, requireCompanionLayout } from './lib/companions/layout';"), 'App does not use the Companion layout registry API');
must(!app.includes('fjordCompanionLayout') && !app.includes('balticCompanionLayout'), 'App still imports concrete Companion layouts');
must(app.includes('requireCompanionLayout(editorialLayout.companionLayoutId)'), 'App does not resolve Companion layout from the active Layout System contract');
must(!app.includes("editorialWorld?.id === 'baltic' ? balticCompanionLayout : fjordCompanionLayout"), 'App still branches on a concrete World for Companion layout');

must(app.includes("$: worldPageClass = editorialWorld ? `${editorialWorld.id}-page` : '';"), 'dynamic World page class derivation is missing');
must(app.includes('class={`a5-page ${worldPageClass}`}'), 'A5 page does not receive the dynamic World class');
must(!app.includes("class:fjord-page={editorialWorld?.id === 'fjord'}"), 'Fjord page class is still hard-coded in the renderer');
must(!app.includes("class:baltic-page={editorialWorld?.id === 'baltic'}"), 'Baltic page class is still hard-coded in the renderer');

must(companionLayouts.includes("['fjord-companion-layout', fjordCompanionLayout]"), 'Fjord Companion layout is not registered');
must(companionLayouts.includes("['baltic-companion-layout', balticCompanionLayout]"), 'Baltic Companion layout is not registered');

console.log('Build 046B World Wire-up Hardening Gate: PASS');
console.log('Renderer resolves World class and Companion layout generically; no concrete World branch remains in App.svelte.');
