<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { open } from '@tauri-apps/plugin-dialog';
  import type { JourneyStage, StudioPage, StudioProject } from './lib/project';
  import { journeyStageFor, previewFor } from './lib/project';
  import { computePreviewScale, PREVIEW_BASE_HEIGHT, PREVIEW_BASE_WIDTH } from './lib/preview';
  import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus, travelbookPageNumber } from './lib/workspace';
  import { availableEditorialWorlds, requireEditorialWorld } from './lib/worlds';
  import { layoutSystemForWorld } from './lib/layout';
  import { loadCompanion } from './lib/companions';
  import { evaluateGrammar, grammarForPage } from './lib/grammar';
  import { availableStoryComponents, buildStoryStructure, missingStoryComponents, presentStoryComponents } from './lib/story';
  import type { EditorialComponentId } from './lib/grammar/types';
  import { AUTHORING_STATUSES, AUTHORING_STATUS_LABELS, authoringCompletion, authoringViewFor, authoredComponentCount, authoringIsDirty } from './lib/authoring';
  import type { AuthoringStatus } from './lib/authoring/types';

  type PendingAction =
    | { kind: 'select-page'; pageId: string }
    | { kind: 'select-component'; componentId: EditorialComponentId }
    | { kind: 'open-travel' }
    | { kind: 'close-travel' }
    | { kind: 'begin-travel' }
    | { kind: 'open-travel-path'; path: string }
    | { kind: 'move-place'; stageId: string; direction: 'earlier' | 'later' }
    | { kind: 'edit-place'; stageId: string };

  let project: StudioProject | null = null;
  let selectedPage: StudioPage | null = null;
  let errorMessage = '';
  let isLoading = false;
  let previewStage: HTMLDivElement | null = null;
  let previewScale = 1;
  let activeAuthoringComponent: EditorialComponentId | null = null;
  let authoringDraft = '';
  let authoringStatus: AuthoringStatus = 'empty';
  let authoringSaveState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let projectMenuOpen = false;
  let pendingAction: PendingAction | null = null;
  let journeyBeginningOpen = false;
  let newJourneyTitle = '';
  let newJourneyWorldId = 'fjord';
  let newJourneyLanguage = 'de';
  let saveDialogPrimary: HTMLButtonElement | null = null;
  let journeyTitleInput: HTMLInputElement | null = null;
  let placeBeginningOpen = false;
  let newPlaceTitle = '';
  let newPlaceCountry = '';
  let placeTitleInput: HTMLInputElement | null = null;
  let placeEditOpen = false;
  let editPlaceStageId = '';
  let editPlaceTitle = '';
  let editPlaceCountry = '';
  let editPlaceTitleInput: HTMLInputElement | null = null;
  const journeyWorlds = availableEditorialWorlds();

  async function showJourneyBeginning() {
    projectMenuOpen = false;
    journeyBeginningOpen = true;
    newJourneyTitle = '';
    newJourneyWorldId = journeyWorlds[0]?.id ?? 'fjord';
    await tick();
    journeyTitleInput?.focus();
  }

  function requestBeginTravel() {
    projectMenuOpen = false;
    if (authoringDirty) {
      pendingAction = { kind: 'begin-travel' };
      return;
    }
    void showJourneyBeginning();
  }

  function cancelJourneyBeginning() {
    journeyBeginningOpen = false;
  }

  async function createJourney() {
    const title = newJourneyTitle.trim();
    if (!title) {
      errorMessage = 'Gib deiner Reise zuerst einen Namen.';
      journeyTitleInput?.focus();
      return;
    }
    const parent = await open({
      directory: true,
      multiple: false,
      title: 'Wo möchtest du deine Reise aufbewahren?'
    });
    if (!parent || Array.isArray(parent)) return;

    isLoading = true;
    errorMessage = '';
    try {
      const created = await invoke<StudioProject>('create_nls_project', {
        parentPath: parent,
        title,
        editorialWorldId: newJourneyWorldId,
        language: newJourneyLanguage
      });
      project = created;
      requireEditorialWorld(project.editorialWorldId ?? '');
      selectedPage = project.pageManifest[0] ?? null;
      activeAuthoringComponent = null;
      authoringSaveState = 'idle';
      journeyBeginningOpen = false;
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  async function showPlaceBeginning() {
    newPlaceTitle = '';
    newPlaceCountry = '';
    placeBeginningOpen = true;
    await tick();
    placeTitleInput?.focus();
  }

  function cancelPlaceBeginning() { placeBeginningOpen = false; }

  async function createPlace() {
    if (!project) return;
    const title = newPlaceTitle.trim();
    if (!title) { errorMessage = 'Gib dem Ort zuerst einen Namen.'; placeTitleInput?.focus(); return; }
    isLoading = true; errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const updated = await invoke<StudioProject>('add_journey_place', { path: projectPath, title, country: newPlaceCountry });
      project = { ...updated, projectPath };
      const created = project.pageManifest.find((page) => page.type === 'destination' && page.title === title) ?? null;
      if (created) selectPageNow(created);
      placeBeginningOpen = false;
    } catch (error) { errorMessage = String(error); }
    finally { isLoading = false; }
  }

  function handlePlaceBeginningKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); cancelPlaceBeginning(); }
  }

  function routePosition(stageId: string): number {
    return (project?.journey?.stages.findIndex((stage) => stage.id === stageId) ?? -1) + 1;
  }

  function visiblePageNumber(page: StudioPage): number {
    if (!project) return page.order;
    return travelbookPageNumber(
      project.pageManifest,
      page.id,
      project.journey?.stages.map((stage) => stage.id) ?? []
    ) ?? page.order;
  }

  async function movePlaceNow(stageId: string, direction: 'earlier' | 'later') {
    if (!project) return;
    isLoading = true;
    errorMessage = '';
    try {
      const selectedPageId = selectedPage?.id ?? null;
      project = await invoke<StudioProject>('move_journey_place', {
        path: project.projectPath,
        stageId,
        direction
      });
      if (selectedPageId) {
        selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      }
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  function requestMovePlace(stageId: string, direction: 'earlier' | 'later') {
    if (authoringDirty) {
      pendingAction = { kind: 'move-place', stageId, direction };
      return;
    }
    void movePlaceNow(stageId, direction);
  }

  async function showPlaceEdit(stage: JourneyStage) {
    editPlaceStageId = stage.id;
    editPlaceTitle = stage.title;
    editPlaceCountry = stage.country ?? '';
    placeEditOpen = true;
    await tick();
    editPlaceTitleInput?.focus();
  }

  function requestPlaceEdit(stage: JourneyStage) {
    if (authoringDirty) {
      pendingAction = { kind: 'edit-place', stageId: stage.id };
      return;
    }
    void showPlaceEdit(stage);
  }

  function cancelPlaceEdit() {
    placeEditOpen = false;
    editPlaceStageId = '';
  }

  async function savePlaceEdit() {
    if (!project || !editPlaceStageId) return;
    const title = editPlaceTitle.trim();
    if (!title) {
      errorMessage = 'Gib dem Ort zuerst einen Namen.';
      editPlaceTitleInput?.focus();
      return;
    }

    isLoading = true;
    errorMessage = '';
    try {
      const selectedPageId = selectedPage?.id ?? null;
      project = await invoke<StudioProject>('update_journey_place', {
        path: project.projectPath,
        stageId: editPlaceStageId,
        title,
        country: editPlaceCountry
      });
      if (selectedPageId) {
        selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      }
      placeEditOpen = false;
      editPlaceStageId = '';
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  function handlePlaceEditKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelPlaceEdit();
    }
  }

  async function openTravelPath(path: string) {
    if (project?.projectPath === path) return;

    projectMenuOpen = false;
    errorMessage = '';
    isLoading = true;

    try {
      const loadedProject = await invoke<StudioProject>('load_nls_project', { path });
      project = {
        ...loadedProject,
        projectPath: path
      };
      requireEditorialWorld(project.editorialWorldId ?? '');
      selectedPage = project.pageManifest[0] ?? null;
      activeAuthoringComponent = null;
      authoringDraft = '';
      authoringStatus = 'empty';
      authoringSaveState = 'idle';
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  function requestOpenTravelPath(path: string) {
    if (!path || project?.projectPath === path) return;

    if (authoringDirty) {
      pendingAction = { kind: 'open-travel-path', path };
      return;
    }

    void openTravelPath(path);
  }

  async function openTravelNow() {
    projectMenuOpen = false;
    errorMessage = '';
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Northern Lines Studio Reise öffnen'
    });

    if (!selected || Array.isArray(selected)) return;

    await openTravelPath(selected);
  }

  function requestOpenTravel() {
    projectMenuOpen = false;
    if (authoringDirty) {
      pendingAction = { kind: 'open-travel' };
      return;
    }
    void openTravelNow();
  }

  function closeTravelNow() {
    project = null;
    selectedPage = null;
    activeAuthoringComponent = null;
    authoringDraft = '';
    authoringStatus = 'empty';
    authoringSaveState = 'idle';
    projectMenuOpen = false;
    errorMessage = '';
  }

  function requestCloseTravel() {
    projectMenuOpen = false;
    if (authoringDirty) {
      pendingAction = { kind: 'close-travel' };
      return;
    }
    closeTravelNow();
  }

  function selectPageNow(page: StudioPage) {
    selectedPage = page;
    activeAuthoringComponent = null;
    authoringDraft = '';
    authoringStatus = 'empty';
    authoringSaveState = 'idle';
  }

  function requestPageSelection(page: StudioPage) {
    if (selectedPage?.id === page.id) return;
    if (authoringDirty) {
      pendingAction = { kind: 'select-page', pageId: page.id };
      return;
    }
    selectPageNow(page);
  }

  function editStoryComponent(componentId: EditorialComponentId) {
    if (activeAuthoringComponent === componentId) return;
    if (authoringDirty) {
      pendingAction = { kind: 'select-component', componentId };
      return;
    }
    activeAuthoringComponent = componentId;
    const component = storyStructure?.story.find((entry) => entry.type === componentId);
    const view = authoringViewFor(selectedPage, componentId, component?.label ?? '');
    authoringDraft = view?.content ?? '';
    authoringStatus = view?.status ?? 'empty';
    authoringSaveState = 'idle';
  }

  async function saveAuthoring(): Promise<boolean> {
    if (!project || !selectedPage || !activeAuthoringComponent) return false;
    authoringSaveState = 'saving';
    try {
      const selectedPageId = selectedPage.id;
      const projectPath = project.projectPath;
      const savedProject = await invoke<StudioProject>('save_authoring_component', {
        path: projectPath,
        pageId: selectedPageId,
        componentId: activeAuthoringComponent,
        content: authoringDraft,
        status: authoringStatus
      });
      project = {
        ...savedProject,
        projectPath
      };
      selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? null;
      authoringSaveState = 'saved';
      return true;
    } catch (error) {
      errorMessage = String(error);
      authoringSaveState = 'error';
      return false;
    }
  }

  async function continuePendingAction(saveFirst: boolean) {
    const action = pendingAction;
    if (!action) return;

    if (saveFirst) {
      const saved = await saveAuthoring();
      if (!saved) return;
    }

    pendingAction = null;

    if (action.kind === 'open-travel') {
      await openTravelNow();
      return;
    }
    if (action.kind === 'begin-travel') {
      await showJourneyBeginning();
      return;
    }
    if (action.kind === 'close-travel') {
      closeTravelNow();
      return;
    }
    if (action.kind === 'open-travel-path') {
      await openTravelPath(action.path);
      return;
    }
    if (action.kind === 'move-place') {
      await movePlaceNow(action.stageId, action.direction);
      return;
    }
    if (action.kind === 'edit-place' && project) {
      const stage = project.journey.stages.find((entry) => entry.id === action.stageId);
      if (stage) await showPlaceEdit(stage);
      return;
    }
    if (action.kind === 'select-component') {
      activeAuthoringComponent = action.componentId;
      const component = storyStructure?.story.find((entry) => entry.type === action.componentId);
      const view = authoringViewFor(selectedPage, action.componentId, component?.label ?? '');
      authoringDraft = view?.content ?? '';
      authoringStatus = view?.status ?? 'empty';
      authoringSaveState = 'idle';
      return;
    }
    if (action.kind === 'select-page' && project) {
      const page = project.pageManifest.find((entry) => entry.id === action.pageId);
      if (page && page.id !== selectedPage?.id) selectPageNow(page);
    }
  }

  async function focusSaveDialog() {
    await tick();
    saveDialogPrimary?.focus();
  }

  function handleSaveDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelPendingAction();
    } else if (event.key === 'Enter' && event.target instanceof HTMLElement && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      void continuePendingAction(true);
    }
  }

  function handleJourneyBeginningKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelJourneyBeginning();
    }
  }

  function cancelPendingAction() {
    pendingAction = null;
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

  onMount(() => {
    let unlistenOpen: (() => void) | undefined;
    let disposed = false;

    void (async () => {
      unlistenOpen = await listen<string>('open-nls', (event) => {
        requestOpenTravelPath(event.payload);
      });

      const pendingPath = await invoke<string | null>('take_pending_open_path');
      if (!disposed && pendingPath) {
        requestOpenTravelPath(pendingPath);
      }
    })();

    return () => {
      disposed = true;
      unlistenOpen?.();
    };
  });

  $: preview = previewFor(selectedPage);
  $: sections = groupPages(project?.pageManifest ?? [], project?.journey?.stages.map((stage) => stage.id) ?? []);
  $: editorialWorld = editorialWorldFor(project);
  $: editorialLayout = layoutSystemForWorld(project?.editorialWorldId);
  $: statusText = projectStatus(project);
  $: journeyStage = journeyStageFor(project, selectedPage);
  $: journeyRouteCount = project?.journey?.stages.length ?? 0;
  $: journeyRoutePosition = journeyStage ? routePosition(journeyStage.id) : 0;
  $: editorialGrammar = grammarForPage(selectedPage);
  $: grammarEvaluation = evaluateGrammar(selectedPage, editorialGrammar);
  $: storyStructure = buildStoryStructure(selectedPage, editorialGrammar);
  $: storyPresent = presentStoryComponents(storyStructure);
  $: storyAvailable = availableStoryComponents(storyStructure);
  $: storyMissing = missingStoryComponents(storyStructure);
  $: activeAuthoring = authoringViewFor(selectedPage, activeAuthoringComponent, storyStructure?.story.find((entry) => entry.type === activeAuthoringComponent)?.label ?? '');
  $: authoringProgress = authoringCompletion(selectedPage);
  $: authoredCount = authoredComponentCount(selectedPage);
  $: authoringDirty = authoringIsDirty(activeAuthoring, authoringDraft, authoringStatus);
  $: previewWidth = PREVIEW_BASE_WIDTH * previewScale;
  $: previewHeight = PREVIEW_BASE_HEIGHT * previewScale;
  $: selectedJourneyWorld = journeyWorlds.find((world) => world.id === newJourneyWorldId) ?? journeyWorlds[0] ?? null;
  $: selectedJourneyCompanion = loadCompanion(selectedJourneyWorld?.companionId);
  $: if (pendingAction) { void focusSaveDialog(); }
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

    <div class="toolbar-zone toolbar-zone-end travel-menu-wrap">
      {#if project}
        <button class="primary-action" on:click={() => projectMenuOpen = !projectMenuOpen} disabled={isLoading} aria-expanded={projectMenuOpen}>
          <svg class="project-icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2.75 5.5h5l1.5 1.75h8v7.5a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5V7a1.5 1.5 0 0 1 1.5-1.5Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
          </svg>
          <span>Reise</span>
          <span class="menu-chevron" aria-hidden="true">⌄</span>
        </button>
        {#if projectMenuOpen}
          <div class="travel-menu" aria-label="Reiseaktionen">
            <button on:click={requestBeginTravel}>Neue Reise beginnen …</button>
            <button on:click={requestOpenTravel}>Reise öffnen …</button>
            <button on:click={requestCloseTravel}>Reise schließen</button>
          </div>
        {/if}
      {:else}
        <button class="primary-action" on:click={requestOpenTravel} disabled={isLoading}>
          <svg class="project-icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2.75 5.5h5l1.5 1.75h8v7.5a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5V7a1.5 1.5 0 0 1 1.5-1.5Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
          </svg>
          <span>{isLoading ? 'Öffnen …' : 'Reise öffnen'}</span>
        </button>
      {/if}
    </div>
  </header>

  {#if errorMessage}
    <div class="error-banner" role="alert">{errorMessage}</div>
  {/if}

  <main class="workspace">
    <aside class="sidebar" aria-label="Travelbook-Navigation">
      <div class="panel-heading">
        <span>Travelbook</span>
        <strong>{project?.title ?? 'Keine Reise geöffnet'}</strong>
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
                  on:click={() => requestPageSelection(page)}
                >
                  <span class="page-order">{String(visiblePageNumber(page)).padStart(2, '0')}</span>
                  <span>
                    <strong>{page.title}</strong>
                    <small>{pageRoleLabel(page.role)}</small>
                  </span>
                </button>
              {/each}
            </section>
          {/each}
          <div class="place-add-wrap">
            <button class="journey-open-link" on:click={() => void showPlaceBeginning()}>+ Ort hinzufügen</button>
          </div>
        </nav>
      {:else}
        <div class="empty-state">
          <strong>Deine Reise beginnt hier.</strong>
          <span>Öffne ein Travelbook oder beginne ein neues Abenteuer.</span>
          <div class="empty-state-actions">
            <button class="journey-begin-button" on:click={requestBeginTravel}>Neue Reise beginnen</button>
            <button class="journey-open-link" on:click={requestOpenTravel}>Reise öffnen …</button>
          </div>
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
              class:fjord-page={editorialWorld?.id === 'fjord'}
              class:destination-page={selectedPage?.type === 'destination'}
              style={`transform:scale(${previewScale});--world-paper:${editorialLayout?.paperTone ?? '#ffffff'};--world-ink:${editorialLayout?.inkTone ?? '#172a34'};--world-accent:${editorialLayout?.accentTone ?? '#547181'};--world-quiet:${editorialLayout?.quietTone ?? '#75868e'}`}
              in:fade={{ duration: 190 }}
            >
              {#if editorialWorld?.id === 'fjord'}
                <div class="fjord-page-marker" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              {/if}
              <div class="page-rule"></div>
              <p class="eyebrow">{preview.eyebrow}</p>
              <h1>{preview.heading}</h1>
              <p class="preview-body">{preview.body}</p>
              <footer class="editorial-footer">
                <span class="footer-anchor">{editorialLayout?.footer.anchor ?? editorialWorld?.name ?? 'Northern Lines Studio'}</span>
                <span class="footer-world">{editorialLayout?.footer.worldLabel ?? editorialWorld?.name ?? ''}</span>
                <span class="footer-page-number">{selectedPage ? visiblePageNumber(selectedPage) : '–'}</span>
              </footer>
            </article>
          {/key}
        </div>
      </div>
    </section>

    <aside class="inspector" aria-label="Inspector">
      <div class="panel-heading">
        <span>Inspector</span>
        <strong>{selectedPage ? 'Seite' : 'Reise'}</strong>
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
            <span>Layout Language</span>
            <strong>{editorialWorld.layoutSystemName}</strong>
            <span>Grammars</span>
            <strong>{editorialWorld.pageGrammars.length} verfügbar</strong>
          </div>
        </section>
      {/if}

      {#if editorialLayout}
        <section class="inspector-card layout-language-card" aria-label="Layout Language">
          <span class="inspector-label">Layout Language</span>
          <strong>{editorialLayout.name}</strong>
          <small>Wenige starke Layouts. Viele persönliche Geschichten.</small>
          <div class="layout-language-facts">
            <span>Wiederkehrender Anker</span>
            <strong>{editorialLayout.footer.anchor}</strong>
            <span>Ortsseiten</span>
            <strong>{editorialLayout.destinationLayouts.map((layout) => layout.label).join(' · ')}</strong>
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
              <span>Story Vollständigkeit</span>
              <strong>{grammarEvaluation.completeness}%</strong>
            </div>
            <div class="grammar-meter" aria-label={`Story Vollständigkeit ${grammarEvaluation.completeness}%`}>
              <span style={`width:${grammarEvaluation.completeness}%`}></span>
            </div>
            <div class="grammar-facts">
              <span>Kernelemente</span>
              <strong>{grammarEvaluation.presentRequiredCount}/{grammarEvaluation.requiredCount} vorhanden</strong>
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

      {#if storyStructure}
        <section class="inspector-card story-card" aria-label="Story Components">
          <span class="inspector-label">Story</span>
          <strong>Deine Geschichte</strong>
          <small>Wähle den Teil der Geschichte, an dem du gerade arbeiten möchtest.</small>

          <div class="story-component-list">
            {#each storyPresent as component}
              <button
                class="story-component-row story-component-present story-component-action"
                class:active={activeAuthoringComponent === component.type}
                title={component.description}
                on:click={() => editStoryComponent(component.type)}
              >
                <span class="story-component-state" aria-hidden="true">✓</span>
                <span class="story-component-copy">
                  <strong>{component.label}</strong>
                  <small>{component.role.replaceAll('_', ' ')}</small>
                </span>
                <span class="story-status-label">{AUTHORING_STATUS_LABELS[authoringViewFor(selectedPage, component.type, component.label)?.status ?? 'empty']}</span>
              </button>
            {/each}

            {#each storyMissing as component}
              <div class="story-component-row story-component-missing" title={component.description}>
                <span class="story-component-state" aria-hidden="true">!</span>
                <span>
                  <strong>{component.label}</strong>
                  <small>erforderlich</small>
                </span>
              </div>
            {/each}
          </div>

          {#if activeAuthoring}
            <div class="authoring-panel" aria-label={`Story bearbeiten: ${activeAuthoring.label}`}>
              <div class="authoring-heading">
                <span>Bearbeiten</span>
                <strong>{activeAuthoring.label}</strong>
              </div>
              <textarea
                bind:value={authoringDraft}
                rows="6"
                placeholder="Was möchtest du hier erzählen?"
                aria-label={`${activeAuthoring.label} Inhalt`}
              ></textarea>
              <div class="authoring-controls">
                <label>
                  <span>Status</span>
                  <select bind:value={authoringStatus}>
                    {#each AUTHORING_STATUSES as state}
                      <option value={state}>{AUTHORING_STATUS_LABELS[state]}</option>
                    {/each}
                  </select>
                </label>
                <button class="authoring-save" on:click={saveAuthoring} disabled={authoringSaveState === 'saving'}>
                  {authoringSaveState === 'saving' ? 'Sichern …' : 'Sichern'}
                </button>
              </div>
              <small class:saveOk={authoringSaveState === 'saved'} class:saveDirty={authoringDirty}>
                {authoringDirty
                  ? '● Nicht gesichert'
                  : authoringSaveState === 'saved'
                    ? 'Gespeichert'
                    : activeAuthoring.isPersisted
                      ? 'Gespeichert'
                      : 'Noch nicht gespeichert'}
              </small>
            </div>
          {/if}

          <div class="authoring-progress">
            <span>Story Fortschritt</span>
            <strong>{authoredCount} von {storyPresent.length} Story-Elementen authoriert · {authoringProgress}%</strong>
          </div>

          {#if storyAvailable.length > 0}
            <div class="story-optional">
              <span>Optional möglich</span>
              <strong>{storyAvailable.map((component) => component.label).join(' · ')}</strong>
            </div>
          {/if}

          <div class="story-layer-summary">
            <span>Editorial Frame</span>
            <strong>{storyStructure.editorialFrame.length ? storyStructure.editorialFrame.map((component) => component.label).join(' · ') : 'Cover-spezifisch'}</strong>
          </div>
        </section>
      {/if}

      {#if journeyStage}
        <section class="inspector-card route-card" aria-label="Deine Route">
          <span class="inspector-label">Deine Route</span>
          <strong>{journeyStage.title}</strong>
          <small>{journeyStage.country ?? 'Teil deiner Reise'} · {journeyRoutePosition} von {journeyRouteCount}</small>
          <div class="route-actions">
            <button
              on:click={() => requestMovePlace(journeyStage.id, 'earlier')}
              disabled={isLoading || journeyRoutePosition <= 1}
            >Früher in der Reise</button>
            <button
              on:click={() => requestMovePlace(journeyStage.id, 'later')}
              disabled={isLoading || journeyRoutePosition >= journeyRouteCount}
            >Später in der Reise</button>
          </div>
          <button class="route-edit-button" on:click={() => requestPlaceEdit(journeyStage)}>Ort bearbeiten</button>
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
        <dt>Travelbook-Format</dt><dd>{project?.formatVersion ?? '–'}</dd>
      </dl>
    </aside>
  </main>

  <footer class="status-bar" aria-label="Reisestatus">
    <span>{editorialWorld ? `${editorialWorld.name} · ${editorialWorld.isReference ? 'Reference World' : 'Editorial World'}` : 'Northern Lines Studio'}</span>
    <span class:status-ok={project}>{statusText}</span>
  </footer>

  {#if pendingAction}
    <div class="save-dialog-backdrop">
      <div
        class="save-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-dialog-title"
        aria-describedby="save-dialog-description"
	tabindex="-1"
        on:keydown={handleSaveDialogKeydown}
      >
        <span class="inspector-label">Deine Geschichte</span>
        <strong id="save-dialog-title">Änderungen an „{activeAuthoring?.label ?? 'Story'}“ sichern?</strong>
        <p id="save-dialog-description">Du hast Änderungen vorgenommen, die noch nicht gespeichert wurden.</p>
        <div class="save-dialog-actions">
          <button class="dialog-secondary" on:click={() => continuePendingAction(false)}>Verwerfen</button>
          <button class="dialog-secondary" on:click={cancelPendingAction}>Abbrechen</button>
          <button bind:this={saveDialogPrimary} class="dialog-primary" on:click={() => continuePendingAction(true)}>Sichern</button>
        </div>
      </div>
    </div>
  {/if}

  {#if placeBeginningOpen}
    <div class="save-dialog-backdrop">
      <div class="journey-begin-dialog" role="dialog" aria-modal="true" aria-labelledby="place-begin-title" aria-describedby="place-begin-description" tabindex="-1" on:keydown={handlePlaceBeginningKeydown}>
        <span class="inspector-label">Neuer Ort</span>
        <strong id="place-begin-title">Welcher Ort gehört zu deiner Reise?</strong>
        <p id="place-begin-description">Nenne den Ort. Studio baut daraus die passende Seite für deine Geschichte.</p>
        <label class="journey-field"><span>Name des Ortes</span><input bind:this={placeTitleInput} bind:value={newPlaceTitle} placeholder="Zum Beispiel: Bergen" /></label>
        <label class="journey-field"><span>Land / Region</span><input bind:value={newPlaceCountry} placeholder="Zum Beispiel: Norwegen" /></label>
        <div class="save-dialog-actions">
          <button class="dialog-secondary" on:click={cancelPlaceBeginning}>Abbrechen</button>
          <button class="dialog-primary" on:click={createPlace} disabled={isLoading || !newPlaceTitle.trim()}>{isLoading ? 'Ort entsteht …' : 'Ort hinzufügen'}</button>
        </div>
      </div>
    </div>
  {/if}

  {#if placeEditOpen}
    <div class="save-dialog-backdrop">
      <div
        class="journey-begin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-edit-title"
        aria-describedby="place-edit-description"
        tabindex="-1"
        on:keydown={handlePlaceEditKeydown}
      >
        <span class="inspector-label">Ort bearbeiten</span>
        <strong id="place-edit-title">Was möchtest du an diesem Ort ändern?</strong>
        <p id="place-edit-description">Name und Region bleiben Teil derselben Etappe deiner Reise.</p>
        <label class="journey-field">
          <span>Name des Ortes</span>
          <input bind:this={editPlaceTitleInput} bind:value={editPlaceTitle} />
        </label>
        <label class="journey-field">
          <span>Land / Region</span>
          <input bind:value={editPlaceCountry} placeholder="Zum Beispiel: Norwegen" />
        </label>
        <div class="save-dialog-actions">
          <button class="dialog-secondary" on:click={cancelPlaceEdit}>Abbrechen</button>
          <button class="dialog-primary" on:click={savePlaceEdit} disabled={isLoading || !editPlaceTitle.trim()}>
            {isLoading ? 'Ort wird aktualisiert …' : 'Änderungen sichern'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if journeyBeginningOpen}
    <div class="save-dialog-backdrop">
      <div class="journey-begin-dialog" role="dialog" aria-modal="true" aria-labelledby="journey-begin-title" aria-describedby="journey-begin-description" on:keydown={handleJourneyBeginningKeydown} tabindex="-1">
        <span class="inspector-label">Neue Reise</span>
        <strong id="journey-begin-title">Wo beginnt deine nächste Geschichte?</strong>
        <p id="journey-begin-description">Gib deiner Reise einen Namen und wähle die Editorial World, die sie begleiten soll.</p>

        <label class="journey-field">
          <span>Name deiner Reise</span>
          <input bind:this={journeyTitleInput} bind:value={newJourneyTitle} placeholder="Zum Beispiel: Island im Winter" />
        </label>

        <label class="journey-field">
          <span>Editorial World</span>
          <select bind:value={newJourneyWorldId}>
            {#each journeyWorlds as world}
              <option value={world.id}>{world.name}</option>
            {/each}
          </select>
        </label>

        {#if selectedJourneyWorld && selectedJourneyCompanion}
          <div class="companion-first-encounter">
            <img src={`/${selectedJourneyCompanion.assetPath}`} alt={selectedJourneyCompanion.name} />
            <div>
              <small>Dein Reisebegleiter</small>
              <strong>{selectedJourneyCompanion.name}</strong>
              <span>{selectedJourneyCompanion.character}</span>
            </div>
          </div>
        {/if}

        <div class="save-dialog-actions">
          <button class="dialog-secondary" on:click={cancelJourneyBeginning}>Abbrechen</button>
          <button class="dialog-primary" on:click={createJourney} disabled={isLoading || !newJourneyTitle.trim()}>
            {isLoading ? 'Reise entsteht …' : 'Reise beginnen'}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
