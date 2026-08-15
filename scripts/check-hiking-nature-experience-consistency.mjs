import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const mustContain = (text, token, message) => { if (!text.includes(token)) throw new Error(message); };

const types = read('src/lib/grammar/types.ts');
const story = read('src/lib/story/definitions.ts');
const grammar = read('src/lib/grammar/index.ts');
const app = read('src/App.svelte');
const css = read('src/styles/destination-interests.css');
const rust = read('src-tauri/src/lib.rs');
const format = read('docs/project-format.md');
const dna = read('docs/PRODUCT-DNA.md');

for (const id of ['hike_routes','hike_start_points','hike_durations','hike_difficulties','hike_highlights','hike_guidance','hike_place_reference']) {
  mustContain(types, `'${id}'`, `Missing EditorialComponentId ${id}.`);
  mustContain(story, `${id}:`, `Missing story definition ${id}.`);
  mustContain(rust, `\"${id}\"`, `Rust must persist ${id}.`);
}

mustContain(grammar, 'Hiking & Nature Experience', 'Hiking & Nature grammar is missing.');
mustContain(grammar, "page.destinationInterestKind === 'hiking_nature'", 'Hiking & Nature must resolve its own grammar.');
mustContain(app, 'class:hiking-nature-interest-page', 'Hiking & Nature page must have an explicit page expression hook.');
mustContain(app, 'hiking-route-meta', 'Route, start, duration and difficulty must stay visibly paired.');
mustContain(app, "hikingStartPointLines[index]", 'Start point must map directly to its route.');
mustContain(app, "hikingDurationLines[index]", 'Duration must map directly to its route.');
mustContain(app, "hikingDifficultyLines[index]", 'Difficulty must map directly to its route.');
mustContain(app, "hikingHighlightLines[index]", 'Nature targets must map directly to their route.');
mustContain(app, "hikingGuidanceLines[index]", 'Trail guidance must map directly to its route.');
mustContain(app, 'class:hiking-interest-compact={hikingInterestCompact}', 'Dense Interest Pages need the bounded compact typography step.');
mustContain(app, 'Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.', 'Capacity protection must remain active.');
mustContain(css, '.hiking-nature-experience', 'Hiking & Nature layout is missing.');
mustContain(css, '.hiking-route-details', 'Route-owned targets and guidance must stay visibly attached.');
mustContain(css, '.hiking-interest-compact', 'Interest-only compact typography step is missing.');
mustContain(css, 'position: absolute;', 'Hiking footer must be a hard page anchor.');
mustContain(css, 'var(--interest-surface', 'Hiking & Nature must inherit World-owned surfaces.');
mustContain(css, '.baltic-page.destination-interest-page .hiking-routes', 'Ostsee expression must reach Hiking & Nature.');
mustContain(rust, 'const CURRENT_FORMAT_VERSION: &str = "0.13.0";', 'Build 028 must use .nls 0.13.0.');
mustContain(rust, 'const BUILD_027_FORMAT_VERSION: &str = "0.12.0";', '0.12.0 migration source must remain explicit.');
mustContain(format, '0.13.0', 'Project format documentation must mention 0.13.0.');
mustContain(dna, 'Semantische Nähe bleibt sichtbar', 'Product DNA must preserve the semantic-proximity rule.');
mustContain(dna, 'Ausschließlich Interest Pages', 'Product DNA must bound compact typography to Interest Pages only.');
mustContain(dna, 'Alle anderen Seitentypen', 'All non-Interest pages must remain excluded from compact typography.');

console.log('Hiking & Nature Experience Consistency Gate: PASS');
console.log('Destination → Hiking & Nature → Route + Start + Duration + Difficulty → World Expression → Capacity → Persistence');
