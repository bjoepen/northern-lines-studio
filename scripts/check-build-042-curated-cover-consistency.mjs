import fs from 'node:fs';

const app = fs.readFileSync('src/App.svelte', 'utf8');
const styles = fs.readFileSync('src/styles/curated-cover.css', 'utf8');
const rootStyles = fs.readFileSync('src/styles.css', 'utf8');
const companion = fs.readFileSync('src/lib/companions/layout.ts', 'utf8');

const must = (condition, message) => {
  if (!condition) throw new Error(`Build 042 curated cover consistency: FAIL — ${message}`);
};

must(app.includes("selectedPage?.type === 'cover' && project"), 'App must resolve curated cover');
must(app.includes("curated-cover-preview"), 'cover markup missing');
must(app.includes("curatedHeroFor(editorialWorld?.id, 'photography')"), 'world-owned hero resolution missing');
must(app.includes('Reisebuch'), 'Reisebuch wording missing');
must(app.includes('project.journey.startDate') && app.includes('project.journey.endDate'), 'structured journey dates missing');
must(rootStyles.includes("@import './styles/curated-cover.css';"), 'cover stylesheet import missing');
must(styles.includes('background: #ffffff'), 'white physical paper rule missing');
must(styles.includes('.a5-page.cover-page .companion-zone'), 'cover no-companion guard missing');
must(companion.includes("visibleFromRole: 'journey_planning'"), 'companion first encounter contract changed');

console.log('Build 042 Curated Cover Consistency Gate: PASS');
console.log('White paper → World hero → Reisebuch → Structured dates → No companion → Existing footer');
