import { readFileSync } from 'node:fs';

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

function requireMatch(condition, message) {
  if (!condition) throw new Error(`Build 041 curated checklist consistency: FAIL — ${message}`);
}

const content = read('src/lib/curated-checklist.ts');
const component = read('src/lib/CuratedChecklistPage.svelte');
const host = read('src/lib/curated-checklist-host.ts');
const workspace = read('src/lib/workspace.ts');
const main = read('src/main.ts');
const css = read('src/styles/curated-checklist.css');
const styles = read('src/styles.css');

requireMatch(content.includes("'curated_checklist_1'") && content.includes("'curated_checklist_2'"), 'both curated checklist parts must exist');
requireMatch(content.includes('order: 27 + definition.part'), 'checklist order must remain 28/29 before memories');
requireMatch(content.includes("role: 'notes'"), 'checklist pages must share the memories publication section');
requireMatch(content.includes("components: []"), 'checklist must not expose authoring components');
requireMatch(component.includes('curated-checklist-sections') && component.includes('curated-check-box'), 'dedicated checklist renderer must render sections and printable boxes');
requireMatch(!component.includes('<input') && !component.includes('<textarea') && !component.includes('<button'), 'curated checklist must contain no user authoring controls');
requireMatch(workspace.includes("import { curatedChecklistPages } from './curated-checklist'"), 'workspace must resolve curated checklist pages');
requireMatch(workspace.includes('pagesWithCuratedChecklist(pages)'), 'publication grouping must include curated checklist pages');
requireMatch(workspace.includes("memories.sort((a, b) => a.order - b.order)"), 'memories section must preserve checklist-before-notes order');
requireMatch(main.includes("installCuratedChecklistHost"), 'Studio bootstrap must install the checklist host');
requireMatch(host.includes(".a5-page[data-studio-page-id]"), 'checklist must render inside the existing resolved Studio A5 page');
requireMatch(css.includes('background: #fff'), 'physical checklist page must remain white');
requireMatch(css.includes('var(--world-heading-family)') && css.includes('var(--world-body-family)'), 'checklist typography must inherit Editorial World authority');
requireMatch(css.includes('var(--world-accent)') && css.includes('var(--world-ink)'), 'checklist colors must inherit Editorial World authority');
requireMatch(css.includes('.baltic-page.curated-checklist-page'), 'Ostsee/Baltic expression must be explicitly covered');
requireMatch(styles.includes("@import './styles/curated-checklist.css'"), 'curated checklist stylesheet must be part of the Studio cascade');

console.log('Build 041 curated checklist consistency: PASS');
