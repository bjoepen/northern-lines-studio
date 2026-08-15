import fs from 'node:fs';
const read = (path) => fs.readFileSync(path, 'utf8');
const mustContain = (text, token, message) => { if (!text.includes(token)) throw new Error(message); };

const project = read('src/lib/project.ts');
const types = read('src/lib/grammar/types.ts');
const story = read('src/lib/story/definitions.ts');
const grammar = read('src/lib/grammar/index.ts');
const entries = read('src/lib/destination-interests/entries.ts');
const app = read('src/App.svelte');
const css = read('src/styles/destination-interests.css');
const rust = read('src-tauri/src/lib.rs');
const format = read('docs/project-format.md');
const dna = read('docs/PRODUCT-DNA.md');

for (const id of ['hike_routes','hike_start_points','hike_durations','hike_difficulties','hike_highlights','hike_guidance','hike_place_reference']) {
  mustContain(types, `'${id}'`, `Missing compatibility EditorialComponentId ${id}.`);
  mustContain(story, `${id}:`, `Missing story definition ${id}.`);
  mustContain(rust, `"${id}"`, `Rust migration must preserve ${id}.`);
}

mustContain(project, "'hiking_route'", 'Structured hiking_route entries are missing from the project model.');
mustContain(entries, "addLabel: 'Route hinzufügen'", 'Hiking must use add-first structured authoring.');
for (const field of ['startPoint','duration','difficulty','highlights','guidance']) mustContain(entries, `id: '${field}'`, `Route field ${field} is missing.`);
mustContain(grammar, 'Hiking & Nature Experience', 'Hiking & Nature grammar is missing.');
mustContain(app, 'class:hiking-nature-interest-page', 'Hiking & Nature page must have an explicit page expression hook.');
mustContain(app, 'entry.fields.startPoint', 'Start point must stay on its route.');
mustContain(app, 'entry.fields.duration', 'Duration must stay on its route.');
mustContain(app, 'entry.fields.difficulty', 'Difficulty must stay on its route.');
mustContain(app, 'entry.fields.highlights', 'Nature targets must stay on their route.');
mustContain(app, 'entry.fields.guidance', 'Trail guidance must stay on its route.');
mustContain(app, "interestDensity === 'tight'", 'Dense Interest Pages need the bounded compact typography state.');
mustContain(app, 'Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.', 'Capacity protection must remain active.');
mustContain(css, '.hiking-nature-experience', 'Hiking & Nature layout is missing.');
mustContain(css, 'max-height: none', 'Structured routes must not be clipped by a fixed preview height.');
mustContain(css, '.interest-entry-two-up', 'Studio must support a two-box composition.');
mustContain(css, '.interest-entry-grouped', 'Studio must support a one-box grouped composition.');
mustContain(css, '.a5-page.destination-interest-page .editorial-footer', 'Interest-page footer must remain a hard page anchor.');
mustContain(rust, 'const CURRENT_FORMAT_VERSION: &str = "0.14.0";', 'Structured entry persistence requires .nls 0.14.0.');
mustContain(rust, 'const BUILD_028_FORMAT_VERSION: &str = "0.13.0";', '0.13.0 migration source must remain explicit.');
mustContain(format, '0.14.0', 'Project format documentation must mention 0.14.0.');
mustContain(dna, 'Ausschließlich Interest Pages', 'Product DNA must bound compact typography to Interest Pages only.');
mustContain(dna, 'wiederholbaren semantischen Einträgen', 'Product DNA must document structured Interest authoring.');

console.log('Hiking & Nature Experience Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Route Association & No-Clipping Gate: \x1b[32mPASS\x1b[0m');
