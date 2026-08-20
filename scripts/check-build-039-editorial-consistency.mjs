import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const app = read('src/App.svelte');
const accents = read('src/lib/curated-accents.ts');
const accentTests = read('src/lib/curated-accents.test.ts');
const css = read('src/styles/book-utility-pages.css');
const worldCss = read('src/styles/editorial-worlds.css');
const pkg = JSON.parse(read('package.json'));
const tauri = JSON.parse(read('src-tauri/tauri.conf.json'));
const cargo = read('src-tauri/Cargo.toml');

const fail = (message) => {
  console.error(`Build 039 Editorial Consistency Gate: FAIL — ${message}`);
  process.exit(1);
};

const contentsBlock = app.match(/\{:else if selectedPage\?\.type === 'contents'[\s\S]*?\{:else if selectedPage\?\.type === 'notes'\}/)?.[0] ?? '';
if (!contentsBlock.includes('<h1>Orientierung</h1>')) fail('Orientierung title missing');
if (contentsBlock.includes('<p class="eyebrow">Orientierung</p>')) fail('duplicate Orientierung eyebrow still visible');
if (contentsBlock.includes("curatedAccentFor(editorialWorld?.id, 'contents')")) fail('Orientation must remain image-free');

if (!app.includes('<h1>Erinnerungen</h1>')) fail('Erinnerungen title missing');
if (!app.includes("curatedAccentFor(editorialWorld?.id, 'notes')")) fail('Memories Curated Accent missing');

if (!accents.includes("CuratedAccentKey = 'notes'")) fail('Curated Accent API must expose notes only');
if (accents.includes("'contents' | 'notes'") || accents.includes('contents:')) fail('obsolete contents Curated Accent mapping returned');
if (accentTests.includes("'contents'")) fail('stale contents Curated Accent test returned');
if (!accentTests.includes("'notes'")) fail('notes Curated Accent regression coverage missing');

if (!fs.existsSync('public/design-library/worlds/fjord/curated-accents/notes.png')) fail('Fjord memories accent missing');
if (!fs.existsSync('public/design-library/worlds/baltic/curated-accents/notes.png')) fail('Ostsee memories accent missing');
if (fs.existsSync('public/design-library/worlds/fjord/curated-accents/contents.png')) fail('obsolete Fjord Orientation accent present');
if (fs.existsSync('public/design-library/worlds/baltic/curated-accents/contents.png')) fail('obsolete Ostsee Orientation accent present');

if (!worldCss.includes('--baltic-amber: #d08a2e')) fail('established Baltic Amber token missing');
if (!worldCss.includes('--baltic-warm-paper: #f6f0e8')) fail('established Baltic Warm Paper token missing');
if (!css.includes('.a5-page.baltic-page.notes-page .notes-main')) fail('Ostsee memories surface scope missing');
if (!css.includes('var(--baltic-amber) 8%')) fail('Ostsee memories light ochre mix missing');
if (!css.includes('var(--baltic-warm-paper)')) fail('Ostsee memories warm-paper mix missing');
if (!css.includes('.a5-page.contents-page,\n.a5-page.notes-page {\n  background: #fff;')) fail('literal white utility page surface guard missing');

if (pkg.version !== '0.39.0-alpha.1') fail('package version is not Build 039');
if (tauri.version !== pkg.version || !cargo.includes(`version = "${pkg.version}"`)) fail('version parity missing');

console.log('\x1b[32mBuild 039 Editorial Consistency Gate: PASS\x1b[0m');
