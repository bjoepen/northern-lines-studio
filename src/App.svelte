<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { invoke } from '@tauri-apps/api/core';
  import { open } from '@tauri-apps/plugin-dialog';
  import type { StudioPage, StudioProject } from './lib/project';
  import { journeyStageFor, previewFor } from './lib/project';
  import { computePreviewScale, PREVIEW_BASE_HEIGHT, PREVIEW_BASE_WIDTH } from './lib/preview';
  import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus } from './lib/workspace';
  import { requireEditorialWorld } from './lib/worlds';
  import { evaluateGrammar, grammarForPage } from './lib/grammar';

  let project: StudioProject | null = null;
  let selectedPage: StudioPage | null = null;
  let errorMessage = '';
  let isLoading = false;
  let previewStage: HTMLDivElement | null = null;
  let previewScale = 1;

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
      requireEditorialWorld(project.editorialWorldId ?? '');
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

  function updatePreviewScale() {
    if (!previewStage) return;
    previewScale = computePreviewScale(previewStage.clientWidth, previewStage.clientHeight);
  }

  onMount(() => {
    if (!previewStage) return;
    const observer = new ResizeObserver(updatePreviewScale);
    observer.observe(previewStage);
    updatePreviewScale();
    return () => observer.disconnect();
  });

  $: preview = previewFor(selectedPage);
  $: sections = groupPages(project?.pageManifest ?? []);
  $: editorialWorld = editorialWorldFor(project);
  $: statusText = projectStatus(project);
  $: journeyStage = journeyStageFor(project, selectedPage);
  $: editorialGrammar = grammarForPage(selectedPage);
  $: grammarEvaluation = evaluateGrammar(selectedPage, editorialGrammar);
  $: previewWidth = PREVIEW_BASE_WIDTH * previewScale;
  $: previewHeight = PREVIEW_BASE_HEIGHT * previewScale;
</script>

<svelte:head>
  <title>{project ? `${project.title} – Northern Lines Studio` : 'Northern Lines Studio'}</title>
</svelte:head>

<div class="app-shell">
  <header class="toolbar">
    <div class="brand toolbar-zone toolbar-zone-start">
      <span class="brand-mark">NL</span>
      <div>
        <strong>Northern Lines Studio</strong>
        <small>Travel Publishing</small>
      </div>
    </div>

    {#if editorialWorld}
      <div class="toolbar-context toolbar-zone toolbar-zone-center" aria-label="Aktiver Travelbook-Kontext">
        <span class="world-wave" aria-hidden="true">≈</span>
        <div>
          <strong>{project?.title ?? editorialWorld.name}</strong>
          <small>Editorial World · {editorialWorld.name}</small>
        </div>
      </div>
    {/if}

    <div class="toolbar-zone toolbar-zone-end">
      <button class="primary-action" on:click={openProject} disabled={isLoading}>
        <svg class="project-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M2.75 5.5h5l1.5 1.75h8v7.5a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5V7a1.5 1.5 0 0 1 1.5-1.5Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
        </svg>
        <span>{isLoading ? 'Öffnen …' : 'Projekt'}</span>
      </button>
    </div>
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
            <small>{editorialWorld.isReference ? `Reference World ${String(editorialWorld.referenceNumber ?? 1).padStart(3, '0')}` : 'Editorial World'}</small>
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

    <section class="editorial-desk" aria-label="Editorial Desk">
      <div class="canvas-header">
        <div>
          <span>Editorial Workspace</span>
          <strong>{selectedPage?.title ?? 'Keine Seite ausgewählt'}</strong>
        </div>
        <small>{editorialWorld ? `${editorialWorld.name} · ${selectedPage?.layout ?? 'ohne Layout'}` : selectedPage?.layout ?? 'ohne Layout'}</small>
      </div>

      <div class="preview-stage" bind:this={previewStage}>
        <div class="page-scale-frame" style={`width:${previewWidth}px;height:${previewHeight}px`}>
          {#key selectedPage?.id ?? 'empty-editorial-desk'}
            <article
              class="a5-page"
              class:cover-page={selectedPage?.type === 'cover'}
              style={`transform:scale(${previewScale})`}
              in:fade={{ duration: 190 }}
            >
              <div class="page-rule"></div>
              <p class="eyebrow">{preview.eyebrow}</p>
              <h1>{preview.heading}</h1>
              <p class="preview-body">{preview.body}</p>
              <footer>
                <span>{editorialWorld?.name ?? 'Northern Lines Studio'}</span>
                <span>{selectedPage?.order ?? '–'}</span>
              </footer>
            </article>
          {/key}
        </div>
      </div>
    </section>

    <aside class="inspector" aria-label="Inspector">
      <div class="panel-heading">
        <span>Inspector</span>
        <strong>{selectedPage ? 'Seite' : 'Projekt'}</strong>
      </div>

      {#if editorialWorld}
        <section class="inspector-card world-inspector-card">
          <span class="inspector-label">Reference World</span>
          <strong>{editorialWorld.name}</strong>
          <small>Reference World {String(editorialWorld.referenceNumber ?? 1).padStart(3, '0')}</small>
          <div class="world-facts">
            <span>Editorial Companion</span>
            <strong>{editorialWorld.companionName}</strong>
            <span>Design Language</span>
            <strong>{editorialWorld.designLanguage.join(' · ')}</strong>
            <span>Grammars</span>
            <strong>{editorialWorld.pageGrammars.length} verfügbar</strong>
          </div>
        </section>
      {/if}

      {#if editorialGrammar && grammarEvaluation}
        <section class="inspector-card grammar-card" aria-label="Editorial Grammar">
          <span class="inspector-label">Editorial Grammar</span>
          <strong>{editorialGrammar.name}</strong>
          <small>{editorialGrammar.purpose}</small>
          <div class="grammar-status">
            <div class="grammar-status-line">
              <span>Story Completeness</span>
              <strong>{grammarEvaluation.completeness}%</strong>
            </div>
            <div class="grammar-meter" aria-label={`Editorial Completeness ${grammarEvaluation.completeness}%`}>
              <span style={`width:${grammarEvaluation.completeness}%`}></span>
            </div>
            <div class="grammar-facts">
              <span>Required Story</span>
              <strong>{grammarEvaluation.presentRequiredCount}/{grammarEvaluation.requiredCount} vorhanden</strong>
              <span>Editorial Frame</span>
              <strong>{editorialGrammar.editorialFrame.length ? 'Header · Footer · Seitenzahl · Companion' : 'Cover-spezifisch'}</strong>
            </div>
            {#if grammarEvaluation.missingRequired.length > 0}
              <div class="grammar-note grammar-warning">
                <span>Fehlt</span>
                <strong>{grammarEvaluation.missingRequired.map((rule) => rule.label).join(' · ')}</strong>
              </div>
            {:else if grammarEvaluation.optionalAvailable.length > 0}
              <div class="grammar-note">
                <span>Optional möglich</span>
                <strong>{grammarEvaluation.optionalAvailable.map((rule) => rule.label).join(' · ')}</strong>
              </div>
            {:else}
              <div class="grammar-note grammar-ok">
                <span>Status</span>
                <strong>Editorial vollständig</strong>
              </div>
            {/if}
          </div>
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
