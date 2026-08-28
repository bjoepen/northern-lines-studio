import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 047B Mediterranean Expression gate failed: ${message}`);
}

const css = fs.readFileSync('src/styles/editorial-worlds.css', 'utf8');
const layout = fs.readFileSync('src/lib/layout/mediterranean.ts', 'utf8');
const app = fs.readFileSync('src/App.svelte', 'utf8');

must(css.includes('.mediterranean-page {'), 'Mediterranean page expression is missing');
must(css.includes('background: #ffffff;'), 'World expression must preserve a literal white page');
must(css.includes('--med-cypress: #405447'), 'Cypress anchor is missing');
must(css.includes('--med-stone: #d8cdbb'), 'Stone anchor is missing');
must(css.includes('--med-terracotta: #b86f4b'), 'Terracotta accent is missing');
must(css.includes('.mediterranean-page.destination-interest-page'), 'Interest pages do not inherit Mediterranean expression');
must(css.includes('.mediterranean-page .destination-extension-zone.extension-history'), 'History extension expression is missing');
must(css.includes('.mediterranean-page .extension-souvenir .editorial-signet'), 'Souvenir signet expression is missing');
must(css.includes('.mediterranean-page .travel-footer-signet path'), 'Footer signet expression is missing');
must(css.includes('.a5-page.mediterranean-page.destination-page .companion-zone-bottom-left'), 'Lynx proportions are not expressed inside the shared protected room');
must(layout.includes("paperTone: '#ffffff'"), 'Mediterranean layout contract does not preserve white paper');
must(layout.includes("headingFamily: 'Georgia"), 'Mediterranean typography contract is missing');
must(!app.includes("editorialWorld?.id === 'mediterranean'"), 'Renderer contains a Mediterranean-specific branch');
must(!app.includes('mediterraneanCompanionLayout'), 'Renderer imports a concrete Mediterranean Companion layout');

console.log('Build 047B Mediterranean World Expression Gate: PASS');
console.log('Zypresse & Stein is expressed through typography, accents and editorial surfaces without new page semantics.');
