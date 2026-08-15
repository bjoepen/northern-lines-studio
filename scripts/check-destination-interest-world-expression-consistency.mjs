import fs from 'node:fs';

const interestCss = fs.readFileSync('src/styles/destination-interests.css', 'utf8');
const worldCss = fs.readFileSync('src/styles/editorial-worlds.css', 'utf8');
const app = fs.readFileSync('src/App.svelte', 'utf8');
const failures = [];

function requireCheck(ok, message) { if (!ok) failures.push(message); }

requireCheck(app.includes('class:destination-interest-page'), 'Interest pages must remain explicit page surfaces.');
requireCheck(interestCss.includes('var(--interest-surface'), 'Interest foundation surface must resolve through World-owned tokens.');
requireCheck(interestCss.includes('var(--interest-ink') && interestCss.includes('var(--interest-meta'), 'Interest text hierarchy must inherit World-owned expression tokens.');
requireCheck(worldCss.includes('.fjord-page.destination-interest-page'), 'Fjord must define Interest Page expression.');
requireCheck(worldCss.includes('.baltic-page.destination-interest-page'), 'Ostsee must define Interest Page expression.');
requireCheck(worldCss.includes('--interest-surface: color-mix(in srgb, var(--baltic-brick) 10%, var(--baltic-warm-paper))'), 'Ostsee Interest surface must use the approved warm Hanse/Backstein expression.');
requireCheck(worldCss.includes('.baltic-page') && worldCss.includes('background: #ffffff;'), 'Ostsee page surface must remain white.');
requireCheck(worldCss.includes('.baltic-page.destination-interest-page .page-rule') && worldCss.includes('background: var(--baltic-brick);'), 'Ostsee Interest Page accent rule must use World expression.');

if (failures.length) {
  console.error('Destination Interest World Expression Consistency Gate: FAIL');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Destination Interest World Expression Consistency Gate: PASS');
console.log('White Page → Shared Interest Grammar → World Typography → World Accent → World Editorial Surface');
