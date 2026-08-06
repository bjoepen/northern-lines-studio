<script lang="ts">
  import { invoke } from '@tauri-apps/api/core';
  import { open } from '@tauri-apps/plugin-dialog';
  import type { StudioPage, StudioProject } from './lib/project';
  import { previewFor } from './lib/project';

  let project: StudioProject | null = null;
  let selectedPage: StudioPage | null = null;
  let errorMessage = '';
  let isLoading = false;

  async function openProject() {
    errorMessage = '';
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Northern Lines Studio Projekt öffnen'
    });

    if (!selected || Array.isArray(selected)) return;

    isLoading = true;
    try {
      project = await invoke<StudioProject>('load_nls_project', { path: selected });
      selectedPage = project.pageManifest[0] ?? null;
    } catch (error) {
      project = null;
      selectedPage = null;
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  function selectPage(page: StudioPage) {
    selectedPage = page;
  }

  $: preview = previewFor(selectedPage);
</script>

<svelte:head>
  <title>{project ? `${project.title} – Northern Lines Studio` : 'Northern Lines Studio'}</title>
</svelte:head>

<div class="app-shell">
  <header class="toolbar">
    <div class="brand">
      <span class="brand-mark">NL</span>
      <div>
        <strong>Northern Lines Studio</strong>
        <small>Travel Publishing</small>
      </div>
    </div>
    <button class="primary-action" on:click={openProject} disabled={isLoading}>
      {isLoading ? 'Projekt wird geöffnet …' : 'Projekt öffnen'}
    </button>
  </header>

  {#if errorMessage}
    <div class="error-banner" role="alert">{errorMessage}</div>
  {/if}

  <main class="workspace">
    <aside class="sidebar" aria-label="Seitenstruktur">
      <div class="panel-heading">
        <span>Projekt</span>
        <strong>{project?.title ?? 'Kein Projekt geöffnet'}</strong>
      </div>

      {#if project}
        <nav class="page-list" aria-label="Seiten">
          {#each project.pageManifest as page}
            <button
              class:active={selectedPage?.id === page.id}
              on:click={() => selectPage(page)}
            >
              <span class="page-order">{String(page.order).padStart(2, '0')}</span>
              <span>
                <strong>{page.title}</strong>
                <small>{page.type}</small>
              </span>
            </button>
          {/each}
        </nav>
      {:else}
        <div class="empty-state">
          Öffne das Beispielprojekt oder ein anderes gültiges <code>.nls</code>-Verzeichnis.
        </div>
      {/if}
    </aside>

    <section class="canvas-area" aria-label="A5-Vorschau">
      <div class="canvas-label">Statische A5-Vorschau · {selectedPage?.layout ?? 'ohne Layout'}</div>
      <article class="a5-page" class:cover-page={selectedPage?.type === 'cover'}>
        <div class="page-rule"></div>
        <p class="eyebrow">{preview.eyebrow}</p>
        <h1>{preview.heading}</h1>
        <p class="preview-body">{preview.body}</p>
        <footer>
          <span>{project?.title ?? 'Northern Lines Studio'}</span>
          <span>{selectedPage?.order ?? '–'}</span>
        </footer>
      </article>
    </section>

    <aside class="inspector" aria-label="Inspector">
      <div class="panel-heading">
        <span>Inspector</span>
        <strong>Nur Lesen</strong>
      </div>
      <dl>
        <dt>Seitentitel</dt><dd>{selectedPage?.title ?? '–'}</dd>
        <dt>Seitentyp</dt><dd>{selectedPage?.type ?? '–'}</dd>
        <dt>Layout</dt><dd>{selectedPage?.layout ?? '–'}</dd>
        <dt>Inhalt</dt><dd>{selectedPage?.content ?? '–'}</dd>
        <dt>Format</dt><dd>{project?.document.pageFormat ?? 'A5'} {project?.document.orientation ?? 'portrait'}</dd>
        <dt>Projektformat</dt><dd>{project?.formatVersion ?? '–'}</dd>
      </dl>
    </aside>
  </main>
</div>
