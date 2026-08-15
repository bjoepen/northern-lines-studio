import fs from 'node:fs';

const app = fs.readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/destination-interests.css', import.meta.url), 'utf8');
const definitions = fs.readFileSync(new URL('../src/lib/destination-interests/index.ts', import.meta.url), 'utf8');

for (const token of [
  '<p class="eyebrow">{destinationInterest.label}</p>',
  '<h1>{journeyStage.title}</h1>',
  'destination-interest-introduction',
  'interest-introduction-authoring',
  'Einleitung sichern',
  "editStoryComponent('introduction')",
  "selectedPage.authoring?.introduction?.content || destinationInterestIntroduction",
  "storyStructure && selectedPage?.type !== 'destination' && !structuredInterestPage"
]) {
  if (!app.includes(token)) throw new Error(`Interest Page Header/Intro gate failed: missing ${token}`);
}

if (app.includes('<p class="destination-interest-place">{journeyStage.title}</p>')) {
  throw new Error('Interest Page Header/Intro gate failed: redundant place subline still rendered.');
}
if (app.includes('<p class="eyebrow">Draußen unterwegs</p>')) {
  throw new Error('Interest Page Header/Intro gate failed: hiking anchor is not the canonical Interest label.');
}
for (const token of ["eyebrow: 'Wandern & Natur'", "eyebrow: 'Kulinarik & Lokal'"]) {
  if (!definitions.includes(token)) throw new Error(`Interest label gate failed: missing ${token}`);
}
for (const token of ['.destination-interest-preview .destination-interest-introduction', '.interest-introduction-authoring', '.interest-introduction-edit']) {
  if (!css.includes(token)) throw new Error(`Interest intro style gate failed: missing ${token}`);
}

console.log('Interest Page Header & Intro Consistency Gate: \x1b[32mPASS\x1b[0m');
