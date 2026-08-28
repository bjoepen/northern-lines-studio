import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const app = read('src/App.svelte');
const accents = read('src/lib/curated-accents.ts');
const worldAssets = read('src/lib/world-assets.ts');
const css = read('src/styles/book-utility-pages.css');
const grammar = read('src/lib/grammar/definitions.ts');
const pkg = JSON.parse(read('package.json'));
const tauri = JSON.parse(read('src-tauri/tauri.conf.json'));
const cargo = read('src-tauri/Cargo.toml');

const fail = (message) => { console.error(`Build 037 Utility Pages Foundation Gate: FAIL — ${message}`); process.exit(1); };

for (const token of ["class:contents-page", "class:notes-page", "curatedAccentFor(editorialWorld?.id, 'notes')", 'Schnellnotiz', 'Ideen', 'Skizze']) {
  if (!app.includes(token)) fail(`missing App token: ${token}`);
}
if (!accents.includes('worldAssetManifestFor')) fail('Curated accents bypass the World asset manifest');
for (const token of ['fjord/curated-accents/notes.png','baltic/curated-accents/notes.png']) {
  if (!worldAssets.includes(token)) fail(`missing memories accent mapping: ${token}`);
  if (!fs.existsSync(`public/design-library/worlds/${token}`)) fail(`missing asset: public/design-library/worlds/${token}`);
}
if (!css.includes('.contents-preview') || !css.includes('.notes-layout')) fail('utility page CSS missing');
if (!css.includes('background: #fff')) fail('true-white utility surface guard missing');
if (!grammar.includes("id: 'contents'") || !grammar.includes("id: 'notes'")) fail('grammar definitions missing');
if (grammar.includes("required('contents', 'Inhaltsübersicht')")) fail('Orientation must remain system generated, not authored');
if (grammar.includes("required('notes_area', 'Notizbereich')")) fail('Memories writing frame must not require authored payload');
if (pkg.version !== tauri.version || !cargo.includes(`version = "${pkg.version}"`)) fail('version parity missing');

console.log('\u001b[32mBuild 037 Utility Pages Foundation Gate: PASS\u001b[0m');
