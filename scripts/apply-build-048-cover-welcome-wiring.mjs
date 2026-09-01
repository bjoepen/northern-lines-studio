import fs from 'node:fs';

const appPath = 'src/App.svelte';
let app = fs.readFileSync(appPath, 'utf8');

const before = `                  <div class="curated-cover-hero-wrap" aria-hidden="true">
                    {#if curatedHeroFor(editorialWorld?.id, 'photography')}
                      <img
                        class="curated-cover-hero"
                        src={curatedHeroFor(editorialWorld?.id, 'photography') ?? ''}
                        alt=""
                      />
                    {/if}
                  </div>`;

const after = `                  <div class="curated-cover-hero-wrap" aria-hidden="true">
                    {#if curatedWelcomeHeroFor(editorialWorld?.id)}
                      <img
                        class="curated-cover-hero"
                        src={curatedWelcomeHeroFor(editorialWorld?.id) ?? ''}
                        alt=""
                      />
                    {/if}
                  </div>`;

if (app.includes(after)) {
  console.log('Build 048 cover welcome wiring apply: PASS (already applied)');
  process.exit(0);
}

const count = app.split(before).length - 1;
if (count !== 1) {
  throw new Error(`Build 048 cover welcome wiring apply failed: expected exactly one legacy cover hero block, found ${count}`);
}

app = app.replace(before, after);
fs.writeFileSync(appPath, app);

console.log('Build 048 cover welcome wiring apply: PASS');
console.log('Cover now resolves the World welcomeHero; photography.png remains reserved for the Photography interest page.');
