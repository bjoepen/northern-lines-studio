import fs from 'node:fs';

const app = fs.readFileSync('src/App.svelte', 'utf8');
const workspace = fs.readFileSync('src/lib/workspace.ts', 'utf8');
const accents = fs.readFileSync('src/lib/curated-accents.ts', 'utf8');
const css = fs.readFileSync('src/styles/book-utility-pages.css', 'utf8');
const project = fs.readFileSync('src/lib/project.ts', 'utf8');
const rust = fs.readFileSync('src-tauri/src/lib.rs', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const tauri = JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json', 'utf8'));
const cargo = fs.readFileSync('src-tauri/Cargo.toml', 'utf8');

const checks = [
  ['Orientierung visible title', app.includes('<h1>Orientierung</h1>')],
  ['Erinnerungen visible title', app.includes('<h1>Erinnerungen</h1>')],
  ['Orientierung has no curated accent', !app.includes("curatedAccentFor(editorialWorld?.id, 'contents')")],
  ['Erinnerungen keeps curated accent', app.includes("curatedAccentFor(editorialWorld?.id, 'notes')")],
  ['Accent API only exposes notes', accents.includes("CuratedAccentKey = 'notes'") && !accents.includes("contents:" )],
  ['Workspace speaks Erinnerungen', workspace.includes("case 'notes': return 'Erinnerungen'")],
  ['Project headings speak Travel Language', project.includes("heading: 'Orientierung'") && project.includes("heading: 'Erinnerungen'")],
  ['Starter pages speak Travel Language', rust.includes('"Orientierung", "content/pages/003-contents.md"') && rust.includes('"Erinnerungen", "content/pages/030-notes.md"')],
  ['Orientation head is single-column', css.includes('.contents-head { grid-template-columns: minmax(0, 1fr); }')],
  ['Version parity', tauri.version === pkg.version && cargo.includes(`version = "${pkg.version}"`)],
  ['Fjord memories accent exists', fs.existsSync('public/design-library/worlds/fjord/curated-accents/notes.png')],
  ['Ostsee memories accent exists', fs.existsSync('public/design-library/worlds/baltic/curated-accents/notes.png')],
  ['Orientation accent removed from Fjord', !fs.existsSync('public/design-library/worlds/fjord/curated-accents/contents.png')],
  ['Orientation accent removed from Ostsee', !fs.existsSync('public/design-library/worlds/baltic/curated-accents/contents.png')],
];

let failed = false;
for (const [label, ok] of checks) {
  if (!ok) { console.error(`FAIL: ${label}`); failed = true; }
}
if (failed) process.exit(1);
console.log('\x1b[32mBuild 038 Orientation & Memories Consistency Gate: PASS\x1b[0m');
