import fs from 'node:fs';

const appPath = 'src/App.svelte';
const stylesPath = 'src/styles.css';

let app = fs.readFileSync(appPath, 'utf8');
let styles = fs.readFileSync(stylesPath, 'utf8');

const coverMarker = `selectedPage?.type === 'cover' && project`;
const cssImport = `@import './styles/curated-cover.css';`;

if (!styles.includes(cssImport)) {
  const anchor = `@import './styles/curated-checklist.css';`;
  if (!styles.includes(anchor)) {
    throw new Error('Build 042 apply: styles.css anchor not found; stop without modifying files.');
  }
  styles = styles.replace(anchor, `${anchor}\n${cssImport}`);
}

if (!app.includes(coverMarker)) {
  const anchor = `              {:else}
                <div class="page-rule"></div>
                <p class="eyebrow">{preview.eyebrow}</p>
                <h1>{preview.heading}</h1>
                <p class="preview-body">{preview.body}</p>
              {/if}`;

  if (!app.includes(anchor)) {
    throw new Error('Build 042 apply: App.svelte fallback-preview anchor not found; stop without modifying files.');
  }

  const replacement = `              {:else if selectedPage?.type === 'cover' && project}
                <div class="curated-cover-preview" aria-label={\`Cover · \${editorialWorld?.name ?? 'Northern Lines'}\`}>
                  <p class="curated-cover-kicker">Northern Lines · {editorialWorld?.name ?? 'Reisewelt'}</p>
                  <h1 class="curated-cover-title">{project.journey.title || project.title}</h1>
                  <p class="curated-cover-book-label">Reisebuch</p>
                  <p class="curated-cover-tagline">Deine Reise. Deine Bilder. Deine Erinnerungen.</p>
                  <div class="curated-cover-date" aria-label="Reisezeitraum">
                    <span>Reisezeitraum</span>
                    <strong>{project.journey.startDate || project.journey.endDate
                      ? [project.journey.startDate, project.journey.endDate].filter(Boolean).join(' – ')
                      : 'Noch offen'}</strong>
                  </div>
                  <div class="curated-cover-hero-wrap" aria-hidden="true">
                    {#if curatedHeroFor(editorialWorld?.id, 'photography')}
                      <img
                        class="curated-cover-hero"
                        src={curatedHeroFor(editorialWorld?.id, 'photography') ?? ''}
                        alt=""
                      />
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="page-rule"></div>
                <p class="eyebrow">{preview.eyebrow}</p>
                <h1>{preview.heading}</h1>
                <p class="preview-body">{preview.body}</p>
              {/if}`;

  app = app.replace(anchor, replacement);
}

fs.writeFileSync(stylesPath, styles);
fs.writeFileSync(appPath, app);

console.log('Build 042 apply: PASS');
console.log('Modified only src/App.svelte and src/styles.css; new drop-in files are copied separately.');
