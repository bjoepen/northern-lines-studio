import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const mustContain = (source, token, message) => { if (!source.includes(token)) throw new Error(message); };

const project = read('src/lib/project.ts');
const interests = read('src/lib/destination-interests/index.ts');
const rust = read('src-tauri/src/lib.rs');
const app = read('src/App.svelte');
const workspace = read('src/lib/workspace.ts');
const css = read('src/styles/destination-interests.css');
const dna = read('docs/PRODUCT-DNA.md');
const format = read('docs/project-format.md');

mustContain(project, "'destination_interest'", 'TypeScript project model must know destination interest pages.');
for (const kind of ['photography', 'hiking_nature', 'culture_history', 'culinary_local']) {
  mustContain(project, `'${kind}'`, `Missing interest kind ${kind} in TypeScript model.`);
  mustContain(interests, `kind: '${kind}'`, `Missing curated interest definition ${kind}.`);
  mustContain(rust, `\"${kind}\"`, `Rust must validate interest kind ${kind}.`);
}
mustContain(rust, 'const BUILD_026_FORMAT_VERSION: &str = "0.11.0"', 'Build 026 compatibility must retain .nls 0.11.0.');
mustContain(rust, 'fn add_destination_interest', 'Rust add command is missing.');
mustContain(rust, 'fn remove_destination_interest', 'Rust remove command is missing.');
mustContain(app, 'Was möchtest du in {destinationName || journeyStage.title} erleben?', 'Travel Language question is missing.');
mustContain(app, 'add_destination_interest', 'Frontend must invoke the add command.');
mustContain(app, 'remove_destination_interest', 'Frontend must invoke the remove command.');
mustContain(app, 'destination-interest-preview', 'Preview foundation is missing.');
mustContain(workspace, "a.type === 'destination' ? 0 : 1", 'Destination page must remain before its interest pages in route navigation.');
mustContain(css, '.destination-interest-page', 'Interest page CSS foundation is missing.');
mustContain(dna, 'Die Destination bleibt das Zentrum.', 'Product DNA must document the destination-centred interest principle.');
mustContain(format, '0.11.0', 'Project format documentation must describe .nls 0.11.0.');

console.log('Destination Interest Pages Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Destination → Travel Language → Interest Page → World Expression → Navigation → Persistence → Tests');
