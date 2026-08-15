import fs from 'node:fs';
const app = fs.readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/destination-interests.css', import.meta.url), 'utf8');

if (app.includes('<button type="button" on:click={cancelInterestEntry}>Abbrechen</button>')) {
  throw new Error('Native UI gate failed: entry editor still exposes default-language Abbrechen button.');
}
if (!app.includes('class="interest-entry-back" on:click={cancelInterestEntry}>Zurück</button>')) {
  throw new Error('Native UI gate failed: calm Travel-Language back action missing.');
}
if (!css.includes('.interest-entry-back') || !css.includes('border: 0;') || !css.includes('background: transparent;')) {
  throw new Error('Native UI gate failed: entry back action is not explicitly styled.');
}
if (!css.includes('.interest-entry-editor input,') || !css.includes('.interest-entry-editor textarea')) {
  throw new Error('Native UI gate failed: structured entry controls are not explicitly scoped/styled.');
}
console.log('Native UI Consistency Gate: \x1b[32mPASS\x1b[0m');
