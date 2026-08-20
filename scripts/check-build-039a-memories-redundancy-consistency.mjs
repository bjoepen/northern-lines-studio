import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const app = read('src/App.svelte');
const css = read('src/styles/book-utility-pages.css');
const accents = read('src/lib/curated-accents.ts');

const fail = (message) => {
  console.error(`Build 039a Memories Redundancy Gate: FAIL — ${message}`);
  process.exit(1);
};

const notesBlock = app.match(/\{:else if selectedPage\?\.type === 'notes'[\s\S]*?\{:else if/)?.[0] ?? app.match(/\{:else if selectedPage\?\.type === 'notes'[\s\S]*?<\/div>\s*\{\/if\}/)?.[0] ?? '';
if (!notesBlock.includes('<h1>Erinnerungen</h1>')) fail('Erinnerungen title missing');
if (notesBlock.includes('<p class="eyebrow">Erinnerungen</p>')) fail('duplicate Erinnerungen eyebrow still visible');
if (!notesBlock.includes('Ideen, Eindrücke und kleine Beobachtungen.')) fail('Erinnerungen deck changed unexpectedly');
if (!notesBlock.includes("curatedAccentFor(editorialWorld?.id, 'notes')")) fail('Memories Curated Accent changed unexpectedly');
if (!css.includes('.a5-page.baltic-page.notes-page .notes-main')) fail('approved Ostsee memories surface scope missing');
if (!css.includes('var(--baltic-amber) 8%')) fail('approved Ostsee ochre expression changed unexpectedly');
if (!accents.includes("CuratedAccentKey = 'notes'")) fail('Curated Accent contract changed unexpectedly');

console.log('\x1b[32mBuild 039a Memories Redundancy Gate: PASS\x1b[0m');
