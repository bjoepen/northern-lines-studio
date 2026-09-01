import fs from 'node:fs';

const app = fs.readFileSync('src/App.svelte', 'utf8');

function must(condition, message) {
  if (!condition) throw new Error(`Build 048 Cover Welcome Wiring gate failed: ${message}`);
}

const coverStart = app.indexOf('<div class="curated-cover-hero-wrap"');
must(coverStart >= 0, 'curated cover hero block is missing');
const coverEnd = app.indexOf('</div>', coverStart);
must(coverEnd > coverStart, 'curated cover hero block cannot be resolved');
const coverBlock = app.slice(coverStart, coverEnd + 6);

must(coverBlock.includes('curatedWelcomeHeroFor(editorialWorld?.id)'), 'cover does not resolve the World welcomeHero');
must(!coverBlock.includes("curatedHeroFor(editorialWorld?.id, 'photography')"), 'cover still reuses the Photography interest hero');
must(app.includes("curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind)"), 'interest pages no longer use their own curated hero keys');

console.log('Build 048 Cover Welcome Wiring Gate: PASS');
console.log('Cover → welcomeHero; Photography interest → photography.png.');
