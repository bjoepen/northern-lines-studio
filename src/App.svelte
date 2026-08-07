<script lang="ts">
  import { invoke } from '@tauri-apps/api/core';
  import { open } from '@tauri-apps/plugin-dialog';
  import type { StudioPage, StudioProject } from './lib/project';
  import { journeyStageFor, previewFor } from './lib/project';
  import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus } from './lib/workspace';

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
  $: sections = groupPages(project?.pageManifest ?? []);
  $: editorialWorld = editorialWorldFor(project);
  $: statusText = projectStatus(project);
  $: journeyStage = journeyStageFor(project, selectedPage);
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

    {#if editorialWorld}
      <div class="toolbar-context" aria-label="Aktive Editorial World">
        <span class="world-wave" aria-hidden="true">≈</span>
        <div>
          <small>Editorial World</small>
          <strong>{editorialWorld.name}</strong>
        </div>
      </div>
    {/if}

    <button class="primary-action" on:click={openProject} disabled={isLoading}>
      {isLoading ? 'Projekt wird geöffnet …' : 'Projekt öffnen'}
    </button>
  </header>

  {#if errorMessage}
    <div class="error-banner" role="alert">{errorMessage}</div>
  {/if}

  <main class="workspace">
    <aside class="sidebar" aria-label="Travelbook-Navigation">
      <div class="panel-heading">
        <span>Travelbook</span>
        <strong>{project?.title ?? 'Kein Projekt geöffnet'}</strong>
        {#if project?.edition}<small>Edition {project.edition}</small>{/if}
        {#if project?.journey?.title}<small>{project.journey.title}</small>{/if}
      </div>

      {#if editorialWorld}
        <section class="world-card" aria-label="Reference Editorial World">
          <div class="world-icon" aria-hidden="true">≈</div>
          <div>
            <small>{editorialWorld.isReference ? 'Reference World' : 'Editorial World'}</small>
            <strong>{editorialWorld.name}</strong>
            <span>Companion · {editorialWorld.companionName}</span>
          </div>
        </section>
      {/if}

      {#if project}
        <nav class="page-list" aria-label="Travelbook-Struktur">
          {#each sections as section}
            <section class="navigation-section">
              <div class="section-heading">
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </div>
              {#each section.pages as page}
                <button
                  class:active={selectedPage?.id === page.id}
                  on:click={() => selectPage(page)}
                >
                  <span class="page-order">{String(page.order).padStart(2, '0')}</span>
                  <span>
                    <strong>{page.title}</strong>
                    <small>{pageRoleLabel(page.role)}</small>
                  </span>
                </button>
              {/each}
            </section>
          {/each}
        </nav>
      {:else}
        <div class="empty-state">
          <strong>Deine Reise beginnt hier.</strong>
          <span>Öffne ein gültiges <code>.nls</code>-Travelbook, um seine Struktur zu erkunden.</span>
        </div>
      {/if}
    </aside>

    <section class="canvas-area" aria-label="A5-Vorschau">
      <div class="canvas-header">
        <div>
          <span>Editorial Preview</span>
          <strong>{selectedPage?.title ?? 'Keine Seite ausgewählt'}</strong>
        </div>
        <small>{selectedPage?.layout ?? 'ohne Layout'}</small>
      </div>

      <article class="a5-page" class:cover-page={selectedPage?.type === 'cover'}>
        <div class="page-rule"></div>
        <p class="eyebrow">{preview.eyebrow}</p>
        <h1>{preview.heading}</h1>
        <p class="preview-body">{preview.body}</p>
        <footer>
          <span>{editorialWorld?.name ?? 'Northern Lines Studio'}</span>
          <span>{selectedPage?.order ?? '–'}</span>
        </footer>
      </article>
    </section>

    <aside class="inspector" aria-label="Inspector">
      <div class="panel-heading">
        <span>Inspector</span>
        <strong>{selectedPage ? 'Seite' : 'Projekt'}</strong>
      </div>

      {#if editorialWorld}
        <section class="inspector-card">
          <span class="inspector-label">Editorial World</span>
          <strong>{editorialWorld.name}</strong>
          <small>{editorialWorld.isReference ? 'Reference World 001' : 'Aktive World'} · {editorialWorld.companionName}</small>
        </section>
      {/if}

      <dl>
        <dt>Seitentitel</dt><dd>{selectedPage?.title ?? '–'}</dd>
        <dt>Rolle</dt><dd>{pageRoleLabel(selectedPage?.role)}</dd>
        <dt>Seitentyp</dt><dd>{selectedPage?.type ?? '–'}</dd>
        {#if journeyStage}
          <dt>Etappe</dt><dd>{journeyStage.title}</dd>
          <dt>Etappentyp</dt><dd>{journeyStage.kind}</dd>
        {/if}
        {#if selectedPage?.knowledgeType}
          <dt>Knowledge</dt><dd>{selectedPage.knowledgeType}</dd>
        {/if}
        <dt>Layout</dt><dd>{selectedPage?.layout ?? '–'}</dd>
        <dt>Format</dt><dd>{project?.document.pageFormat ?? 'A5'} {project?.document.orientation ?? 'portrait'}</dd>
        <dt>Projektformat</dt><dd>{project?.formatVersion ?? '–'}</dd>
      </dl>
    </aside>
  </main>

  <footer class="status-bar" aria-label="Projektstatus">
    <span>{editorialWorld ? `${editorialWorld.name} · ${editorialWorld.isReference ? 'Reference World' : 'Editorial World'}` : 'Northern Lines Studio'}</span>
    <span class:status-ok={project}>{statusText}</span>
  </footer>
</div>
