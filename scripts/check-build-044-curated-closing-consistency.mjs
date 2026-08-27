import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 044 Closing gate failed: ${message}`);
}

const app = fs.readFileSync('src/App.svelte', 'utf8');
const css = fs.readFileSync('src/styles/curated-closing.css', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const grammar = fs.readFileSync('src/lib/grammar/definitions.ts', 'utf8');
const companion = fs.readFileSync('src/lib/companions/layout.ts', 'utf8');
const closingMap = fs.readFileSync('src/lib/curated-closing.ts', 'utf8');
const worldAssets = fs.readFileSync('src/lib/world-assets.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

must(grammar.includes("id: 'closing'") && grammar.includes("required('hero', 'Hero')") && grammar.includes("required('quote', 'Zitat')") && grammar.includes("required('closing_text', 'Abschlusstext')"), 'Closing grammar changed or missing');
must(app.includes("class:closing-page={selectedPage?.type === 'closing'}"), 'Closing page class is missing');
must(app.includes("{:else if selectedPage?.type === 'closing'}"), 'curated Closing rendering branch is missing');
must(app.includes('curated-closing-preview'), 'curated Closing structure is missing');
must(app.includes("selectedPage.authoring?.quote?.content?.trim()"), 'authored Closing quote is not authoritative');
must(app.includes("selectedPage.authoring?.closing_text?.content?.trim()"), 'authored Closing text is not authoritative');
must(app.includes('Weiter üben') && app.includes('Entdecken') && app.includes('Erinnern'), 'approved Closing reflection cards are missing');
must(app.includes('Unsere Highlights dieser Reise'), 'approved Closing highlights area is missing');
must(app.includes('curatedClosingHeroFor(editorialWorld?.id)'), 'world-specific Closing hero is not wired');

must(closingMap.includes('worldAssetManifestFor'), 'Closing hero API bypasses the World asset registry');
must(worldAssets.includes("closingHero: '/design-library/worlds/fjord/curated-heroes/closing.png'"), 'Fjord Closing hero mapping is missing');
must(worldAssets.includes("closingHero: '/design-library/worlds/baltic/curated-heroes/closing.png'"), 'Ostsee Closing hero mapping is missing');
must(fs.existsSync('public/design-library/worlds/fjord/curated-heroes/closing.png'), 'Fjord Closing hero asset is missing');
must(fs.existsSync('public/design-library/worlds/baltic/curated-heroes/closing.png'), 'Ostsee Closing hero asset is missing');

must(styles.includes("@import './styles/curated-closing.css';"), 'Closing stylesheet is not imported');
must(css.includes('background: #ffffff'), 'Closing paper is not explicitly white');
must(css.includes('var(--world-heading-family') && css.includes('var(--world-body-family'), 'Closing typography does not inherit World typography');
must(css.includes('.a5-page.closing-page .companion-zone'), 'Closing Companion protected slot is missing');
must(css.includes('.a5-page.closing-page .editorial-footer'), 'Closing footer safe-zone guard is missing');
must(
  css.includes('.a5-page.baltic-page.closing-page .curated-closing-card'),
  'Ostsee Closing card World Expression is missing'
);

must(
  css.includes('#b58a4a') &&
  css.includes('#c6a46a') &&
  css.includes('#9b6f32'),
  'Ostsee Closing cards no longer use the approved amber / sand expression'
);

must(companion.includes("'closing_memory'"), 'Closing memory is no longer Companion-visible');
must(pkg.scripts['consistency:build-044'] === 'node scripts/check-build-044-curated-closing-consistency.mjs', 'Build 044 package gate is missing');
must(pkg.scripts.consistency.includes('check-build-044-curated-closing-consistency.mjs'), 'Build 044 is not part of full consistency');

console.log('Build 044 Curated Closing Consistency Gate: PASS');
console.log('White paper → Closing copy → Weiter üben · Entdecken · Erinnern → Highlights → World hero → Companion → Existing footer');
