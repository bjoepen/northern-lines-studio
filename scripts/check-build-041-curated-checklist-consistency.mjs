import { existsSync, readFileSync } from 'node:fs';

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
const app = read('src/App.svelte');
const base = read('src/styles/base-shell.css');
const workshop = read('src/styles/travel-companion-workshop.css');
const utilityCss = read('src/styles/book-utility-pages.css');
const interestCss = read('src/styles/destination-interests.css');
const main = read('src/main.ts');
const css = read('src/styles/curated-checklist.css');
const styles = read('src/styles.css');
const heroAssetUrl = new URL('../public/design-library/curated-heroes/travel-preparation.png', import.meta.url);

requireMatch(content.includes("'curated_checklist_1'") && content.includes("'curated_checklist_2'"), 'both curated checklist parts must exist');
requireMatch(content.includes('order: 27 + definition.part'), 'checklist order must remain 28/29 before memories');
requireMatch(content.includes("role: 'notes'"), 'checklist pages must share the memories publication section');
requireMatch(content.includes('components: []'), 'checklist must not expose authoring components');
requireMatch(component.includes('curated-checklist-sections') && component.includes('curated-check-box'), 'dedicated checklist renderer must render sections and printable boxes');
requireMatch(!component.includes('<input') && !component.includes('<textarea') && !component.includes('<button'), 'curated checklist must contain no user authoring controls');
requireMatch(!component.includes('curated-checklist-part') && !component.includes('definition.part} / 2'), 'visible 1/2 and 2/2 markers must not return to the page design');
requireMatch(workspace.includes("from './curated-checklist'"), 'workspace must resolve curated checklist pages');
requireMatch(workspace.includes('pagesWithCuratedChecklist(pages)'), 'publication grouping must include curated checklist pages');
requireMatch(
  workspace.includes('function memoryPagePriority(page: StudioPage)')
    && workspace.includes('if (isCuratedChecklistPage(page)) return 0;')
    && workspace.includes("if (page.role === 'notes') return 1;")
    && workspace.includes("if (page.role === 'closing_memory') return 2;")
    && workspace.includes('memoryPagePriority(a) - memoryPagePriority(b)'),
  'memories section must use semantic checklist-before-notes-before-closing ordering'
);
requireMatch(main.includes('installCuratedChecklistHost'), 'Studio bootstrap must install the checklist host');
requireMatch(host.includes('.a5-page[data-studio-page-id]'), 'checklist must render inside the existing resolved Studio A5 page');

// Global Golden-040 / Product-DNA invariants.
requireMatch(app.includes('<footer class="editorial-footer">'), 'shared Northern Lines footer must remain rendered by the resolved Studio page');
requireMatch(app.includes('companion-zone companion-zone-bottom-left'), 'shared Companion anchor must remain rendered by the resolved Studio page');
requireMatch(base.includes('bottom: calc(51px + var(--studio-a5-extension));'), 'Golden Companion Y anchor must remain intact');
requireMatch(base.includes('.a5-page .editorial-footer') && base.includes('margin-top: auto;'), 'shared footer must remain in the Golden A5 flex flow');
requireMatch(css.includes('flex: 0 1 auto;') && css.includes('min-height: 0;') && css.includes('height: auto;'), 'checklist must participate in existing A5 flex geometry');
requireMatch(css.includes('padding: 0;'), 'checklist must not introduce a second page inset');
requireMatch(!css.includes('padding: 42px 42px 86px 54px'), 'obsolete checklist-owned page geometry must not return');
requireMatch(!css.includes('.curated-checklist-page .editorial-footer') && !css.includes('.curated-checklist-page .companion-zone'), 'checklist CSS must not reposition Footer or Companion');
requireMatch(css.includes('.curated-checklist-section:nth-child(3):last-child') && css.includes('grid-column: 2;'), 'odd final checklist module must clear the lower-left Companion Safe Zone');
requireMatch(css.includes('margin: 6px 0 0 72px;'), 'secondary checklist note must use the established Companion-clearing bridge geometry');

// Established title/deck/module hierarchy remains unchanged.
for (const token of ['font-size: 28px;', 'font-size: 10.2px;', 'font-size: 10.4px;', 'grid-template-columns: repeat(2, minmax(0, 1fr));']) {
  requireMatch(workshop.includes(token), `Workshop typography/layout authority missing expected token: ${token}`);
  requireMatch(css.includes(token), `checklist must reuse established Workshop authority token: ${token}`);
}

// Checklist body uses the established normal utility-page body size, not the
// Interest Page-only tight exception.
requireMatch(utilityCss.includes('.contents-row') && utilityCss.includes('font-size: 9px;'), 'normal utility-page body typography authority must remain available');
requireMatch(css.includes('.curated-checklist-section li') && css.includes('font-size: 9px;') && css.includes('line-height: 1.25;'), 'checklist body must use normal Northern Lines utility-page typography');
requireMatch(!css.includes('font-size: 7.15px;'), 'workshop-dense checklist body typography must not return');

// Travel Preparation hero: one world-neutral curated asset through the approved
// Build-035 hero grammar. Visual enlargement is achieved by the refined asset
// crop, not by a second checklist-owned hero geometry.
requireMatch(existsSync(heroAssetUrl), 'generic travel-preparation hero asset must exist');
requireMatch(component.includes("'/design-library/curated-heroes/travel-preparation.png'"), 'checklist must use the approved generic travel-preparation hero');
requireMatch(component.includes('curated-checklist-head curated-hero-flow'), 'checklist header must reuse the canonical curated hero flow');
requireMatch(component.includes('class="curated-world-hero"'), 'checklist hero must reuse the canonical curated-world-hero class');
for (const token of ['.curated-hero-flow', '.curated-world-hero', 'width: 34%;', 'max-width: 138px;', 'margin: 0 0 8px 14px;']) {
  requireMatch(interestCss.includes(token), `canonical curated hero grammar missing expected token: ${token}`);
}
requireMatch(!css.includes('.curated-world-hero') && !css.includes('.curated-hero-flow'), 'checklist CSS must not redefine curated hero geometry');

requireMatch(css.includes('background: #fff'), 'physical checklist page must remain white');
requireMatch(css.includes('var(--world-heading-family)') && css.includes('var(--world-body-family)'), 'checklist typography must inherit Editorial World authority');
requireMatch(css.includes('var(--world-accent)') && css.includes('var(--world-ink)'), 'checklist colors must inherit Editorial World authority');
requireMatch(css.includes('.baltic-page.curated-checklist-page'), 'Ostsee/Baltic expression must be explicitly covered');
requireMatch(styles.includes("@import './styles/curated-checklist.css'"), 'curated checklist stylesheet must be part of the Studio cascade');

console.log('Build 041 curated checklist consistency: PASS');
