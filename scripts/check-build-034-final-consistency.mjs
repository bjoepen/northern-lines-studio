import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const baseCss = read('src/styles/base-shell.css');
const imageryCss = read('src/styles/destination-imagery.css');
const interestCss = read('src/styles/destination-interests.css');
const worldsCss = read('src/styles/editorial-worlds.css');
const lightCss = read('src/styles/travel-companion-light.css');
const weatherCss = read('src/styles/travel-companion-weather.css');
const workshopCss = read('src/styles/travel-companion-workshop.css');
const fjord = read('src/lib/layout/fjord.ts');
const baltic = read('src/lib/layout/baltic.ts');
const packageJson = JSON.parse(read('package.json'));
const tauri = JSON.parse(read('src-tauri/tauri.conf.json'));
const cargoToml = read('src-tauri/Cargo.toml');
const cargoLock = read('src-tauri/Cargo.lock');

const failures = [];
const requireCheck = (ok, message) => { if (!ok) failures.push(message); };

requireCheck(baseCss.includes('.a5-page.fjord-page') && baseCss.includes('background: #ffffff;'), 'Fjord base page surface must be literal #FFFFFF.');
requireCheck(imageryCss.includes('.a5-page.fjord-page.destination-page') && imageryCss.includes('background: #ffffff;'), 'Fjord Destination Page override must remain literal #FFFFFF.');
requireCheck(worldsCss.includes('.baltic-page') && worldsCss.includes('background: #ffffff;'), 'Ostsee page surface must remain literal #FFFFFF.');
requireCheck(interestCss.includes('.a5-page.destination-interest-page') && (interestCss.includes('background: #fff;') || interestCss.includes('background: #ffffff;')), 'Interest Page surface must remain white.');
requireCheck(lightCss.includes('.a5-page.light-companion-page') && lightCss.includes('background: #fff;'), 'Light companion page surface must remain white.');
requireCheck(weatherCss.includes('.a5-page.weather-companion-page') && weatherCss.includes('background: #fff;'), 'Weather companion page surface must remain white.');
requireCheck(workshopCss.includes('.a5-page.photography-workshop-page') && workshopCss.includes('background: #fff;'), 'Workshop companion page surface must remain white.');
requireCheck(fjord.includes("paperTone: '#ffffff'"), 'Fjord semantic paperTone must be #FFFFFF.');
requireCheck(baltic.includes("paperTone: '#ffffff'"), 'Ostsee semantic paperTone must be #FFFFFF.');
requireCheck(!imageryCss.includes('#fffdfa') && !fjord.includes('#f8f7f3'), 'Historical cream destination paper tones must not return.');

const version = packageJson.version;
requireCheck(typeof version === 'string' && version.length > 0, 'Package version must be present.');
requireCheck(tauri.version === version, 'Tauri bundle version must match package.json.');
requireCheck(cargoToml.includes(`version = "${version}"`), 'Cargo.toml version must match package.json.');
requireCheck(cargoLock.includes(`name = "northern-lines-studio"\nversion = "${version}"`), 'Cargo.lock package version must match package.json.');

if (failures.length) {
  console.error('Build 034 Final Consistency Gate: FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Build 034 Final Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Literal white content pages → World paper tones → Version parity → PASS');
