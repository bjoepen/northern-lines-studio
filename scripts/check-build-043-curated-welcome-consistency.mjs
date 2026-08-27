import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 043 Welcome gate failed: ${message}`);
}

const app = fs.readFileSync('src/App.svelte', 'utf8');
const css = fs.readFileSync('src/styles/curated-welcome.css', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const grammar = fs.readFileSync('src/lib/grammar/definitions.ts', 'utf8');
const companion = fs.readFileSync('src/lib/companions/layout.ts', 'utf8');
const worldContract = fs.readFileSync('docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md', 'utf8');
const dna = fs.readFileSync('docs/PRODUCT-DNA.md', 'utf8');
const welcomeMap = fs.readFileSync('src/lib/curated-welcome.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

must(grammar.includes("id: 'welcome'") && grammar.includes("required('hero', 'Hero')") && grammar.includes("required('introduction', 'Willkommenstext')") && grammar.includes("optional('quote', 'Zitat')"), 'existing Welcome grammar changed or missing');
must(app.includes("class:welcome-page={selectedPage?.type === 'welcome'}"), 'Welcome page class is missing');
must(app.includes("{:else if selectedPage?.type === 'welcome'}"), 'curated Welcome rendering branch is missing');
must(app.includes('curated-welcome-preview'), 'curated Welcome structure is missing');
must(app.includes("selectedPage.authoring?.introduction?.content?.trim()"), 'authored Introduction is not authoritative');
must(app.includes("selectedPage.authoring?.quote?.content?.trim()"), 'authored Quote is not authoritative');
must(app.includes('Jede Reise beginnt mit einer Ahnung von dem, was bleiben könnte.'), 'approved Northern Lines quote fallback is missing');
must(app.includes('curatedWelcomeHeroFor(editorialWorld?.id)'), 'world-specific Welcome hero is not wired');

must(welcomeMap.includes("fjord: '/design-library/worlds/fjord/curated-heroes/welcome.png'"), 'Fjord Welcome hero mapping is missing');
must(welcomeMap.includes("baltic: '/design-library/worlds/baltic/curated-heroes/welcome.png'"), 'Ostsee Welcome hero mapping is missing');
must(fs.existsSync('public/design-library/worlds/fjord/curated-heroes/welcome.png'), 'Fjord Welcome hero asset is missing');
must(fs.existsSync('public/design-library/worlds/baltic/curated-heroes/welcome.png'), 'Ostsee Welcome hero asset is missing');

must(styles.includes("@import './styles/curated-welcome.css';"), 'Welcome stylesheet is not imported');
must(css.includes('background: #ffffff'), 'Welcome paper is not explicitly white');
must(css.includes('var(--world-heading-family') && css.includes('var(--world-body-family'), 'Welcome typography does not inherit World typography');
must(css.includes('.a5-page.welcome-page .companion-zone') && css.includes('display: none !important'), 'Welcome does not hard-guard the Companion');
must(css.includes('.a5-page.welcome-page .editorial-footer'), 'Footer safe-zone guard is missing');

must(companion.includes("visibleFromRole: 'journey_planning'"), 'Companion first appearance is no longer journey planning');
must(!companion.match(/visibleRoles:\s*\[[^\]]*'front_matter'/s), 'front matter was added to Companion visibility');
must(worldContract.includes('Hero, Title, Content, Extension, Companion und Footer sind geschützte semantische Zonen.'), 'Editorial World protected-zone contract is missing');
must(dna.includes('erster Auftritt ab Reiseplanung'), 'Product DNA no longer records Companion first appearance');
must(dna.includes('Footer Safe Area'), 'Product DNA no longer records Footer Safe Area');

must(pkg.scripts['consistency:build-043'] === 'node scripts/check-build-043-curated-welcome-consistency.mjs', 'Build 043 package gate is missing');
must(pkg.scripts.consistency.includes('check-build-043-curated-welcome-consistency.mjs'), 'Build 043 is not part of full consistency');

must(app.includes('curated-welcome-thoughts'), 'personal journey thoughts section is missing');
must(app.includes('Meine Gedanken zur Reise'), 'personal journey thoughts heading is missing');
must(css.includes('.curated-welcome-thoughts'), 'personal journey thoughts styling is missing');

console.log('Build 043 Curated Welcome Consistency Gate: PASS');
console.log('White paper → World hero → World typography → Introduction → Quote → No Companion → Existing footer');
