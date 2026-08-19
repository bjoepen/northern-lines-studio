import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const app = read('src/App.svelte');
const workshop = read('src/lib/travel-companion-workshop.ts');
const grammar = read('src/lib/grammar/definitions.ts');
const css = read('src/styles/travel-companion-workshop.css');
const workspace = read('src/lib/workspace.ts');
const dna = read('docs/PRODUCT-DNA.md');

const checks = [
  ['dedicated curated workshop preview', app.includes("selectedPage?.type === 'workflow'") && app.includes('CURATED_WORKSHOP_WORLDS')],
  ['four curated worlds', ['see', 'compose', 'expose', 'travel'].every((id) => workshop.includes(`id: '${id}'`))],
  ['program neutral content', !/Luminar|ON1|Lightroom|Photoshop/i.test(workshop)],
  ['light and weather bridge exists', workshop.includes('Licht und Wetter') && app.includes('CURATED_WORKSHOP_BRIDGE')],
  ['workflow authoring is hidden', app.includes("!structuredInterestPage && selectedPage?.type !== 'workflow'")],
  ['Travel Language names the page photography workshop', workspace.includes("case 'workflow': return 'Fotografie-Workshop';") && app.includes('Fotografie-Workshop')],
  ['curated grammar has no optional workshop tip', grammar.includes("name: 'Travel Companion · Fotografie-Workshop'") && !grammar.includes("optional('workflow_tip', 'Praxis-Tipp')")],
  ['2x2 workshop composition uses shared A5 page geometry', css.includes('grid-template-columns: repeat(2, minmax(0, 1fr));') && css.includes('padding: 0;')],
  ['curated inspector exposes no editing control', app.includes('Reisebezug</span><strong>nicht vorgesehen</strong>')],
  ['Product DNA records curated workshop rule', dna.includes('Travel Companion Master · Fotografie-Workshop') && dna.includes('vollständig kuratiert')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}
console.log('\x1b[32mTravel Companion · Fotografie-Workshop Consistency Gate: PASS\x1b[0m');
