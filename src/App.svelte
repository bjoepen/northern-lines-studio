<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { open } from '@tauri-apps/plugin-dialog';
  import type { DestinationEditorialExtension, DestinationHighlight, DestinationLayoutVariantId, DestinationPracticalInfo, EditorialExtensionKind, JourneyStage, StudioPage, StudioProject } from './lib/project';
  import { journeyStageFor, previewFor } from './lib/project';
  import { computePreviewScale, PREVIEW_BASE_HEIGHT, PREVIEW_BASE_WIDTH } from './lib/preview';
  import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus, travelbookPageNumber } from './lib/workspace';
  import { availableEditorialWorlds, requireEditorialWorld } from './lib/worlds';
  import { layoutSystemForWorld } from './lib/layout';
  import { destinationContentCapacity, destinationExtensionCapacityResult, destinationExtensionComposition, destinationModuleComposition, destinationTitleComposition } from './lib/layout/capacity';
  import { northernLinesFooter } from './lib/travel-language/footer';
  import { requireCompanion } from './lib/companions';
  import { companionVisibleForRole, fjordCompanionLayout } from './lib/companions/layout';
  import { loadCompanion } from './lib/companions';
  import { evaluateGrammar, grammarForPage } from './lib/grammar';
  import { availableStoryComponents, buildStoryStructure, missingStoryComponents, presentStoryComponents } from './lib/story';
  import type { EditorialComponentId } from './lib/grammar/types';
  import { AUTHORING_STATUSES, AUTHORING_STATUS_LABELS, authoringCompletion, authoringViewFor, authoredComponentCount, authoringIsDirty } from './lib/authoring';
  import type { AuthoringStatus } from './lib/authoring/types';
  import {
    journeyDurationLabel,
    journeyPlanningDraft,
    travelFocusValues
  } from './lib/journey-planning';
  import {
    destinationDraft,
    destinationForPage,
    destinationImageGeometry,
    destinationImagePath,
    destinationImageRole,
    destinationImageRoleLabel,
    destinationIsDirty,
    formatTravelTime
  } from './lib/destinations';
  import type { DestinationImageRole } from './lib/destinations';
  import { EDITORIAL_EXTENSION_DEFINITIONS, editorialExtensionDefinition, editorialExtensionLabel } from './lib/editorial-extensions';
  import { clampInspectorWidth, INSPECTOR_DEFAULT_WIDTH, INSPECTOR_WIDTH_STORAGE_KEY, parseStoredInspectorWidth } from './lib/inspector-layout';

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
  let planningStartDate = '';
  let planningEndDate = '';
  let planningDeparturePlace = '';
  let planningReturnPlace = '';
  let planningTransport = '';
  let planningRouteSummary = '';
  let planningTravelFocus = '';
  let planningSaveState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let destinationName = '';
  let destinationSubtitle = '';
  let destinationIntroduction = '';
  let destinationArrival = '';
  let destinationDeparture = '';
  let destinationTimezone = '';
  let destinationReasons: string[] = [];
  let destinationHighlights: DestinationHighlight[] = [];
  let destinationPracticalInfo: DestinationPracticalInfo[] = [];
  let destinationEditorialExtensions: DestinationEditorialExtension[] = [];
  let destinationNewExtensionKind: EditorialExtensionKind = 'tip';
  let destinationLayoutVariant: DestinationLayoutVariantId = 'destination-hero-banner';
  let destinationSaveState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let destinationActiveImageRole: DestinationImageRole = 'wide';
  let destinationActiveImagePath = '';
  let destinationImagePreviewUrl = '';
  let destinationImagePreviewSource = '';
  let destinationImagePreviewError = '';
  let destinationImageState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let destinationImagePreviewRequest = 0;
  let inspectorWidth = INSPECTOR_DEFAULT_WIDTH;
  let inspectorPreferredWidth = INSPECTOR_DEFAULT_WIDTH;
  let inspectorResizing = false;
  const journeyWorlds = availableEditorialWorlds();

  function applyInspectorWidth(width: number) {
    inspectorPreferredWidth = clampInspectorWidth(width, window.innerWidth);
    inspectorWidth = inspectorPreferredWidth;
    window.localStorage.setItem(INSPECTOR_WIDTH_STORAGE_KEY, String(inspectorPreferredWidth));
  }

  function beginInspectorResize(event: MouseEvent) {
    event.preventDefault();
    inspectorResizing = true;
    const move = (moveEvent: MouseEvent) => applyInspectorWidth(window.innerWidth - moveEvent.clientX);
    const stop = () => {
      inspectorResizing = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }


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
    if (hasUnsavedChanges) {
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
      syncPlanningDraft();
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
    if (hasUnsavedChanges) {
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
    if (hasUnsavedChanges) {
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
      if (selectedPage?.type === 'destination') syncDestinationDraft();
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

  function syncPlanningDraft() {
    if (!project) {
      planningStartDate = '';
      planningEndDate = '';
      planningDeparturePlace = '';
      planningReturnPlace = '';
      planningTransport = '';
      planningRouteSummary = '';
      planningTravelFocus = '';
      planningSaveState = 'idle';
      return;
    }

    const draft = journeyPlanningDraft(project.journey);
    planningStartDate = draft.startDate;
    planningEndDate = draft.endDate;
    planningDeparturePlace = draft.departurePlace;
    planningReturnPlace = draft.returnPlace;
    planningTransport = draft.transport;
    planningRouteSummary = draft.routeSummary;
    planningTravelFocus = draft.travelFocus;
    planningSaveState = 'idle';
  }

  function syncDestinationDraft() {
    const destination = destinationForPage(project, selectedPage);
    const draft = destinationDraft(destination, selectedPage?.title ?? '');
    destinationName = draft.name;
    destinationSubtitle = draft.subtitle;
    destinationIntroduction = draft.introduction;
    destinationArrival = draft.arrival;
    destinationDeparture = draft.departure;
    destinationTimezone = draft.timezone;
    destinationReasons = draft.reasons;
    destinationHighlights = draft.highlights;
    destinationPracticalInfo = draft.practicalInfo;
    destinationEditorialExtensions = draft.editorialExtensions;
    destinationLayoutVariant = draft.layoutVariant;
    destinationSaveState = 'idle';
  }

  function destinationProjectImageAbsolutePath(relativePath: string): string {
    if (!project?.projectPath || !relativePath) return '';
    return `${project.projectPath.replace(/\/$/, '')}/${relativePath}`;
  }

  function imageMimeType(path: string): string {
    return path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  }

  async function refreshDestinationImagePreview(sourcePath: string) {
    const request = ++destinationImagePreviewRequest;
    destinationImagePreviewError = '';
    if (!sourcePath) {
      if (destinationImagePreviewUrl) URL.revokeObjectURL(destinationImagePreviewUrl);
      destinationImagePreviewUrl = '';
      destinationImagePreviewSource = '';
      return;
    }
    try {
      const bytes = await invoke<number[]>('read_image_preview', { path: sourcePath });
      if (request !== destinationImagePreviewRequest) return;
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: imageMimeType(sourcePath) }));
      if (destinationImagePreviewUrl) URL.revokeObjectURL(destinationImagePreviewUrl);
      destinationImagePreviewUrl = url;
      destinationImagePreviewSource = sourcePath;
    } catch (error) {
      if (request !== destinationImagePreviewRequest) return;
      if (destinationImagePreviewUrl) URL.revokeObjectURL(destinationImagePreviewUrl);
      destinationImagePreviewUrl = '';
      destinationImagePreviewSource = sourcePath;
      destinationImagePreviewError = String(error);
    }
  }

  async function chooseDestinationImage() {
    if (!project || !journeyStage || selectedPage?.type !== 'destination') return;
    const selected = await open({
      multiple: false,
      directory: false,
      title: `Bild für ${destinationImageRoleLabel(destinationActiveImageRole)} auswählen`,
      filters: [{ name: 'Bilder', extensions: ['jpg', 'jpeg', 'png'] }]
    });
    if (!selected || Array.isArray(selected)) return;
    destinationImageState = 'saving';
    errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const selectedPageId = selectedPage.id;
      const updated = await invoke<StudioProject>('set_destination_image', {
        path: projectPath,
        stageId: journeyStage.id,
        role: destinationActiveImageRole,
        sourcePath: selected
      });
      project = { ...updated, projectPath };
      selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      destinationImagePreviewSource = '';
      destinationImageState = 'saved';
    } catch (error) {
      errorMessage = String(error);
      destinationImageState = 'error';
    }
  }

  async function removeDestinationImage() {
    if (!project || !journeyStage || selectedPage?.type !== 'destination' || !destinationActiveImagePath) return;
    destinationImageState = 'saving';
    errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const selectedPageId = selectedPage.id;
      const updated = await invoke<StudioProject>('remove_destination_image', {
        path: projectPath,
        stageId: journeyStage.id,
        role: destinationActiveImageRole
      });
      project = { ...updated, projectPath };
      selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      destinationImagePreviewSource = '';
      destinationImageState = 'saved';
    } catch (error) {
      errorMessage = String(error);
      destinationImageState = 'error';
    }
  }

  function updateDestinationReasonText(value: string) {
    destinationReasons = value.split('\n').map((entry) => entry.trim()).filter(Boolean);
    destinationSaveState = 'idle';
  }

  function addDestinationHighlight() {
    destinationHighlights = [...destinationHighlights, {
      id: `highlight-${Date.now()}-${destinationHighlights.length + 1}`,
      name: '', description: '', category: 'landmark'
    }];
  }

  function removeDestinationHighlight(id: string) {
    destinationHighlights = destinationHighlights.filter((entry) => entry.id !== id);
  }

  function updateDestinationHighlight(id: string, patch: Partial<DestinationHighlight>) {
    destinationHighlights = destinationHighlights.map((entry) => entry.id === id ? { ...entry, ...patch } : entry);
  }

  function updateDestinationHighlightCategory(id: string, value: string) {
    const categories: DestinationHighlight['category'][] = ['landmark', 'viewpoint', 'architecture', 'nature', 'culture', 'photography', 'other'];
    const category = categories.includes(value as DestinationHighlight['category']) ? value as DestinationHighlight['category'] : 'other';
    updateDestinationHighlight(id, { category });
  }

  function addDestinationPracticalInfo() {
    destinationPracticalInfo = [...destinationPracticalInfo, { id: `practical-${Date.now()}-${destinationPracticalInfo.length + 1}`, title: '', text: '' }];
  }

  function removeDestinationPracticalInfo(id: string) {
    destinationPracticalInfo = destinationPracticalInfo.filter((entry) => entry.id !== id);
  }

  function updateDestinationPracticalInfo(id: string, patch: Partial<DestinationPracticalInfo>) {
    destinationPracticalInfo = destinationPracticalInfo.map((entry) => entry.id === id ? { ...entry, ...patch } : entry);
  }

  function addDestinationEditorialExtension() {
    destinationEditorialExtensions = [...destinationEditorialExtensions, {
      id: `extension-${Date.now()}-${destinationEditorialExtensions.length + 1}`,
      kind: destinationNewExtensionKind,
      title: '',
      text: ''
    }];
  }

  function removeDestinationEditorialExtension(id: string) {
    destinationEditorialExtensions = destinationEditorialExtensions.filter((entry) => entry.id !== id);
  }

  function updateDestinationEditorialExtension(id: string, patch: Partial<DestinationEditorialExtension>) {
    destinationEditorialExtensions = destinationEditorialExtensions.map((entry) => entry.id === id ? { ...entry, ...patch } : entry);
  }

  function updateDestinationEditorialExtensionKind(id: string, value: string) {
    const kinds = EDITORIAL_EXTENSION_DEFINITIONS.map((entry) => entry.kind);
    const kind = kinds.includes(value as EditorialExtensionKind) ? value as EditorialExtensionKind : 'tip';
    updateDestinationEditorialExtension(id, { kind });
  }

  async function saveDestinationProfile(): Promise<boolean> {
    if (!project || !selectedPage?.journeyStage || selectedPage.type !== 'destination') return false;
    if (!destinationName.trim()) {
      errorMessage = 'Gib dem Ort zuerst einen Namen.';
      return false;
    }
    destinationSaveState = 'saving';
    errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const selectedPageId = selectedPage.id;
      const updated = await invoke<StudioProject>('update_destination_profile', {
        path: projectPath,
        stageId: selectedPage.journeyStage,
        name: destinationName,
        subtitle: destinationSubtitle,
        introduction: destinationIntroduction,
        arrival: destinationArrival,
        departure: destinationDeparture,
        timezone: destinationTimezone,
        reasons: destinationReasons,
        highlights: destinationHighlights,
        practicalInfo: destinationPracticalInfo,
        editorialExtensions: destinationEditorialExtensions,
        layoutVariant: destinationLayoutVariant
      });
      project = { ...updated, projectPath };
      selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      syncDestinationDraft();
      destinationSaveState = 'saved';
      return true;
    } catch (error) {
      errorMessage = String(error);
      destinationSaveState = 'error';
      return false;
    }
  }

  async function saveJourneyPlanning() {
    if (!project) return;

    planningSaveState = 'saving';
    errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const selectedPageId = selectedPage?.id ?? null;
      const updated = await invoke<StudioProject>('update_journey_planning', {
        path: projectPath,
        startDate: planningStartDate,
        endDate: planningEndDate,
        departurePlace: planningDeparturePlace,
        returnPlace: planningReturnPlace,
        transport: planningTransport,
        routeSummary: planningRouteSummary,
        travelFocus: travelFocusValues(planningTravelFocus)
      });
      project = { ...updated, projectPath };
      if (selectedPageId) {
        selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      }
      syncPlanningDraft();
      planningSaveState = 'saved';
    } catch (error) {
      errorMessage = String(error);
      planningSaveState = 'error';
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
      syncPlanningDraft();
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  function requestOpenTravelPath(path: string) {
    if (!path || project?.projectPath === path) return;

    if (hasUnsavedChanges) {
      pendingAction = { kind: 'open-travel-path', path };
      return;
    }

    void openTravelPath(path);
  }

  async function openTravelNow() {
    projectMenuOpen = false;
    errorMessage = '';
    const selected = await open({
      multiple: false,
      title: 'Northern Lines Studio Reise öffnen',
      filters: [
        { name: 'Northern Lines Reise', extensions: ['nls'] }
      ]
    });

    if (!selected || Array.isArray(selected)) return;

    await openTravelPath(selected);
  }

  function requestOpenTravel() {
    projectMenuOpen = false;
    if (hasUnsavedChanges) {
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
    syncPlanningDraft();
  }

  function requestCloseTravel() {
    projectMenuOpen = false;
    if (hasUnsavedChanges) {
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
    if (page.type === 'planning') syncPlanningDraft();
    if (page.type === 'destination') syncDestinationDraft();
  }

  function requestPageSelection(page: StudioPage) {
    if (selectedPage?.id === page.id) return;
    if (hasUnsavedChanges) {
      pendingAction = { kind: 'select-page', pageId: page.id };
      return;
    }
    selectPageNow(page);
  }

  function editStoryComponent(componentId: EditorialComponentId) {
    if (activeAuthoringComponent === componentId) return;
    if (hasUnsavedChanges) {
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
      if (selectedPage?.type === 'destination') syncDestinationDraft();
      authoringSaveState = 'saved';
      return true;
    } catch (error) {
      errorMessage = String(error);
      authoringSaveState = 'error';
      return false;
    }
  }

  function discardActiveUnsavedChanges() {
    if (destinationDirty) syncDestinationDraft();
    if (authoringDirty && activeAuthoring) {
      authoringDraft = activeAuthoring.content;
      authoringStatus = activeAuthoring.status;
      authoringSaveState = 'idle';
    }
  }

  async function saveActiveUnsavedChanges(): Promise<boolean> {
    if (destinationDirty) {
      const saved = await saveDestinationProfile();
      if (!saved) return false;
    }
    if (authoringDirty) {
      const saved = await saveAuthoring();
      if (!saved) return false;
    }
    return true;
  }

  async function continuePendingAction(saveFirst: boolean) {
    const action = pendingAction;
    if (!action) return;

    if (saveFirst) {
      const saved = await saveActiveUnsavedChanges();
      if (!saved) return;
    } else {
      discardActiveUnsavedChanges();
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
    inspectorPreferredWidth = parseStoredInspectorWidth(window.localStorage.getItem(INSPECTOR_WIDTH_STORAGE_KEY), window.innerWidth);
    inspectorWidth = inspectorPreferredWidth;
    const resize = () => {
      inspectorWidth = clampInspectorWidth(inspectorPreferredWidth, window.innerWidth);
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

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
  $: destinationCapacity = destinationContentCapacity({
    name: destinationName,
    subtitle: destinationSubtitle,
    introduction: destinationIntroduction,
    reasons: destinationReasons,
    highlights: destinationHighlights,
    practicalInfo: destinationPracticalInfo,
    editorialExtensions: destinationEditorialExtensions
  });
  $: destinationModuleLayout = destinationModuleComposition({ name: destinationName, subtitle: destinationSubtitle, introduction: destinationIntroduction, reasons: destinationReasons, highlights: destinationHighlights, practicalInfo: destinationPracticalInfo, editorialExtensions: destinationEditorialExtensions });
  $: destinationTitleLayout = destinationTitleComposition({ name: destinationName || selectedPage?.title || '', introduction: destinationIntroduction });
  $: destinationExtensionLayout = destinationExtensionComposition(destinationEditorialExtensions);
  $: destinationExtensionCapacityInfo = destinationExtensionCapacityResult({ name: destinationName, subtitle: destinationSubtitle, introduction: destinationIntroduction, reasons: destinationReasons, highlights: destinationHighlights, practicalInfo: destinationPracticalInfo, editorialExtensions: destinationEditorialExtensions }, destinationLayoutVariant);
  $: destinationExtensionOverflow = destinationExtensionCapacityInfo.state === 'overflow';
  $: destinationExtensionAlternativeLabels = destinationExtensionCapacityInfo.alternatives.map((variant) => editorialLayout?.destinationLayouts.find((layout) => layout.id === variant)?.label ?? variant);
  $: activeCompanion = editorialWorld ? requireCompanion(editorialWorld.companionId) : null;
  $: companionVisible = editorialWorld?.id === 'fjord'
    && companionVisibleForRole(fjordCompanionLayout, selectedPage?.role);
  $: statusText = projectStatus(project);
  $: planningDuration = project ? journeyDurationLabel(project.journey.startDate, project.journey.endDate) : 'Noch offen';
  $: journeyStage = journeyStageFor(project, selectedPage);
  $: selectedDestination = destinationForPage(project, selectedPage);
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
  $: destinationActiveImageRole = destinationImageRole(destinationLayoutVariant);
  $: destinationActiveImagePath = destinationImagePath(selectedDestination, destinationActiveImageRole);
  $: {
    const nextImageSource = destinationProjectImageAbsolutePath(destinationActiveImagePath);
    if (nextImageSource !== destinationImagePreviewSource) void refreshDestinationImagePreview(nextImageSource);
  }
  $: destinationDirty = selectedPage?.type === 'destination' && destinationIsDirty(selectedDestination, {
    name: destinationName,
    subtitle: destinationSubtitle,
    introduction: destinationIntroduction,
    arrival: destinationArrival,
    departure: destinationDeparture,
    timezone: destinationTimezone,
    reasons: destinationReasons,
    highlights: destinationHighlights,
    practicalInfo: destinationPracticalInfo,
    editorialExtensions: destinationEditorialExtensions,
    layoutVariant: destinationLayoutVariant
  }, selectedPage?.title ?? '');
  $: hasUnsavedChanges = authoringDirty || destinationDirty;
  $: unsavedDialogLabel = destinationDirty ? (destinationName || selectedPage?.title || 'Ortsprofil') : (activeAuthoring?.label ?? 'Story');
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
          <small>Reisewelt · {editorialWorld.name}</small>
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

  <main class="workspace" style={`--inspector-width:${inspectorWidth}px`}>
    <aside class="sidebar" aria-label="Travelbook-Navigation">
      <div class="panel-heading">
        <span>Travelbook</span>
        <strong>{project?.title ?? 'Keine Reise geöffnet'}</strong>
        {#if project?.edition}<small>Edition {project.edition}</small>{/if}
        {#if project?.journey?.title}<small>{project.journey.title}</small>{/if}
      </div>

      {#if editorialWorld}
        <section class="world-card" aria-label="Reisewelt">
          <div class="world-icon" aria-hidden="true">≈</div>
          <div>
            <small>Reisewelt</small>
            <strong>{editorialWorld.name}</strong>
            <span>Reisebegleiter · {editorialWorld.companionName}</span>
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
        <small>{editorialWorld
          ? `${editorialWorld.name} · ${selectedPage?.type === 'destination'
              ? (editorialLayout?.destinationLayouts.find((layout) => layout.id === destinationLayoutVariant)?.label ?? 'Ortsseite')
              : pageRoleLabel(selectedPage?.role)}`
          : pageRoleLabel(selectedPage?.role)}</small>
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
              {#if selectedPage?.type === 'destination'}
                <div class={`destination-preview ${destinationLayoutVariant} capacity-${destinationCapacity} title-${destinationTitleLayout}`}>
                  <div class="destination-story">
                    <div class={`destination-title-intro-composition destination-title-${destinationTitleLayout}`}>
                      <div class="destination-title-block">
                        <div class="page-rule"></div>
                        <p class="eyebrow">Reiseziel</p>
                        <h1>{destinationName || selectedPage.title}</h1>
                        {#if destinationSubtitle}<p class="destination-subtitle">{destinationSubtitle}</p>{/if}
                      </div>
                      <p class="preview-body destination-introduction">{destinationIntroduction || 'Erzähle, was diesen Ort für deine Reise besonders macht.'}</p>
                    </div>

                    <div class="destination-facts-preview">
                      <div><span>Ankunft</span><strong>{formatTravelTime(destinationArrival)}</strong></div>
                      <div><span>Abfahrt</span><strong>{formatTravelTime(destinationDeparture)}</strong></div>
                      <div><span>Zeitzone</span><strong>{destinationTimezone || 'offen'}</strong></div>
                    </div>
                  </div>

                  <div class:destination-image-present={Boolean(destinationImagePreviewUrl)} class="destination-hero-placeholder" aria-label={`Bild für ${destinationImageRoleLabel(destinationActiveImageRole)}`}>
                    {#if destinationImagePreviewUrl}
                      <img class="destination-hero-image" src={destinationImagePreviewUrl} alt={`Bild von ${destinationName || selectedPage.title}`} />
                    {:else}
                      <span class="destination-image-empty">Bild für {destinationImageRoleLabel(destinationActiveImageRole)}</span>
                    {/if}
                  </div>

                  <div class="destination-title-safe-zone" aria-hidden="true"></div>

                  <div class={`destination-modules-preview destination-modules-${destinationModuleLayout}`}>
                    <section>
                      <span>Warum dieser Ort?</span>
                      {#if destinationReasons.length}
                        <ul>{#each destinationReasons.slice(0, 4) as reason}<li>{reason}</li>{/each}</ul>
                      {:else}<small>Noch keine Gründe notiert.</small>{/if}
                    </section>
                    <section>
                      <span>Highlights</span>
                      {#if destinationHighlights.filter((entry) => entry.name.trim()).length}
                        <ul>{#each destinationHighlights.filter((entry) => entry.name.trim()).slice(0, 4) as highlight}<li><strong>{highlight.name}</strong>{#if highlight.description}<em>{highlight.description}</em>{/if}</li>{/each}</ul>
                      {:else}<small>Fotospots und Highlights warten auf deine Auswahl.</small>{/if}
                    </section>
                    {#if destinationPracticalInfo.filter((entry) => entry.title.trim() || entry.text.trim()).length}
                      <section class="destination-practical-preview">
                        <span>Praktische Infos</span>
                        <div>{#each destinationPracticalInfo.filter((entry) => entry.title.trim() || entry.text.trim()).slice(0, 3) as info}<p><strong>{info.title}</strong> {info.text}</p>{/each}</div>
                      </section>
                    {/if}
                  </div>

                  {#if destinationEditorialExtensions.filter((entry) => entry.title.trim() || entry.text.trim()).length}
                    {#if destinationExtensionOverflow}
                      <div class="destination-capacity-stop" aria-label="Inhalt passt nicht ruhig auf diese Seite">
                        <span>Mehr Raum nötig</span>
                        <strong>Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.</strong>
                        <small>Die geschützte Companion- und Footer-Zone bleibt frei.</small>
                      </div>
                    {:else}
                      <div class={`destination-extension-zones destination-extensions-${destinationExtensionLayout}`} aria-label="Redaktionelle Ergänzungen">
                        {#each destinationEditorialExtensions.filter((entry) => entry.title.trim() || entry.text.trim()) as extension (extension.id)}
                          <section class={`destination-extension-zone extension-${extension.kind}`}>
                            <span class={`editorial-signet editorial-signet-${editorialExtensionDefinition(extension.kind).signet}`} role="img" aria-label={editorialExtensionLabel(extension.kind)}></span>
                            <div>
                              {#if extension.title.trim()}<strong>{extension.title}</strong>{/if}
                              {#if extension.text.trim()}<p>{extension.text}</p>{/if}
                            </div>
                          </section>
                        {/each}
                      </div>
                    {/if}
                  {/if}
                </div>
              {:else}
                <div class="page-rule"></div>
                <p class="eyebrow">{preview.eyebrow}</p>
                <h1>{preview.heading}</h1>
                <p class="preview-body">{preview.body}</p>
              {/if}
              {#if selectedPage?.type === 'planning' && project}
                <div class="journey-planning-preview">
                  <div>
                    <span>Reisezeit</span>
                    <strong>{project.journey.startDate || project.journey.endDate ? [project.journey.startDate, project.journey.endDate].filter(Boolean).join(' – ') : 'Noch offen'}</strong>
                    <small>{planningDuration}</small>
                  </div>
                  <div>
                    <span>Unterwegs</span>
                    <strong>{[project.journey.departurePlace, project.journey.returnPlace].filter(Boolean).join(' → ') || 'Noch offen'}</strong>
                    <small>{project.journey.transport ?? 'Transport noch offen'}</small>
                  </div>
                  {#if project.journey.routeSummary}
                    <div class="planning-preview-wide">
                      <span>Deine Route</span>
                      <strong>{project.journey.routeSummary}</strong>
                    </div>
                  {/if}
                  {#if project.journey.travelFocus?.length}
                    <div class="planning-preview-wide">
                      <span>Was dir wichtig ist</span>
                      <strong>{project.journey.travelFocus.join(' · ')}</strong>
                    </div>
                  {/if}
                </div>
              {/if}
              {#if companionVisible && activeCompanion}
                <div
                  class="companion-zone companion-zone-bottom-left"
                  aria-label={`Dein Reisebegleiter: ${activeCompanion.name}`}
                >
                  <img
                    class="page-companion"
                    src={`/${activeCompanion.assetPath}`}
                    alt={activeCompanion.name}
                  />
                </div>
              {/if}

              <footer class="editorial-footer">
                <div class="travel-language-footer" aria-label={northernLinesFooter.ariaLabel}>
                  <span>{northernLinesFooter.left}</span>
                  <span class="travel-footer-dot" aria-hidden="true">•</span>
                  <span>{northernLinesFooter.centerLeft}</span>
                  <span class="travel-footer-dot" aria-hidden="true">•</span>
                  <span class="travel-footer-signet" aria-hidden="true">
                    <svg viewBox="0 0 54 18" role="presentation">
                      <path d="M2 10 C13 2, 20 4, 27 10 C34 4, 41 2, 52 10" />
                      <path d="M20 7 L27 12 L34 7" />
                    </svg>
                  </span>
                  <span>{northernLinesFooter.centerRight}</span>
                </div>
                <span class="footer-page-number">{selectedPage ? visiblePageNumber(selectedPage) : '–'}</span>
              </footer>
            </article>
          {/key}
        </div>
      </div>
    </section>

    <aside class:resizing={inspectorResizing} class="inspector" aria-label="Inspector">
      <button class="inspector-resize-handle" type="button" aria-label="Inspectorbreite ändern" title="Inspectorbreite ändern" on:mousedown={beginInspectorResize}></button>
      <div class="inspector-scroll">
      <div class="panel-heading">
        <span>Inspector</span>
        <strong>{selectedPage ? 'Seite' : 'Reise'}</strong>
      </div>

      {#if selectedPage?.type === 'planning' && project}
        <section class="inspector-card journey-planning-card" aria-label="Reiseplanung">
          <span class="inspector-label">Reiseplanung</span>
          <strong>Der Rahmen deiner Reise</strong>
          <small>Ein paar Eckdaten genügen. Studio macht daraus deine Reiseplanung.</small>

          <div class="planning-form">
            <div class="planning-field-row">
              <label>
                <span>Wann geht es los?</span>
                <input type="date" bind:value={planningStartDate} />
              </label>
              <label>
                <span>Wann kommst du zurück?</span>
                <input type="date" bind:value={planningEndDate} />
              </label>
            </div>
            <div class="planning-duration-line">
              <span>Dauer</span>
              <strong>{journeyDurationLabel(planningStartDate, planningEndDate)}</strong>
            </div>

            <div class="planning-field-row">
              <label>
                <span>Wo beginnt deine Reise?</span>
                <input bind:value={planningDeparturePlace} placeholder="Zum Beispiel: Kiel" />
              </label>
              <label>
                <span>Wo endet sie?</span>
                <input bind:value={planningReturnPlace} placeholder="Zum Beispiel: Kiel" />
              </label>
            </div>

            <label>
              <span>Wie reist du?</span>
              <input bind:value={planningTransport} placeholder="Zum Beispiel: Schiff, Bahn oder Auto" />
            </label>

            <label>
              <span>Wie verläuft deine Route?</span>
              <textarea rows="3" bind:value={planningRouteSummary} placeholder="Kiel → Bergen → Geiranger → Ålesund → Haugesund → Kiel"></textarea>
            </label>

            <label>
              <span>Was ist dir auf dieser Reise wichtig?</span>
              <input bind:value={planningTravelFocus} placeholder="Fotografie · Entdecken · Erinnerungen" />
            </label>
          </div>

          <button class="planning-save-button" on:click={saveJourneyPlanning} disabled={planningSaveState === 'saving'}>
            {planningSaveState === 'saving' ? 'Reiseplanung wird gesichert …' : 'Reiseplanung sichern'}
          </button>
          {#if planningSaveState === 'saved'}<small class="planning-save-state">Reiseplanung gesichert.</small>{/if}
          {#if planningSaveState === 'error'}<small class="planning-save-state planning-save-error">Reiseplanung konnte nicht gesichert werden.</small>{/if}
        </section>
      {/if}

      {#if selectedPage?.type === 'destination' && project && journeyStage}
        <section class="inspector-card destination-profile-card" aria-label="Ortsprofil">
          <span class="inspector-label">Ortsprofil</span>
          <strong>Was bedeutet {destinationName || journeyStage.title} für deine Reise?</strong>
          <small>Halte nur fest, was den Ort für dich besonders macht. Die Seite bleibt dabei ruhig und klar.</small>

          <div class="destination-form">
            <label><span>Reiseziel</span><input bind:value={destinationName} placeholder="Zum Beispiel: Bergen" /></label>
            <label><span>Ein Satz für diesen Ort</span><input bind:value={destinationSubtitle} placeholder="Zum Beispiel: Tor zu den Fjorden" /></label>
            <label><span>Der Ort in Kürze</span><textarea rows="4" bind:value={destinationIntroduction} placeholder="Was macht diesen Ort für deine Reise besonders?"></textarea></label>

            <div class="destination-image-picker">
              <div class="destination-image-picker-heading">
                <div><span>Bild des Ortes</span><small class="destination-image-role-status">{destinationImageRoleLabel(destinationActiveImageRole)}</small></div>
                <details class="destination-image-help">
                  <summary aria-label="Empfohlene Bildgeometrie">?</summary>
                  <div class="destination-image-help-card">
                    <strong>{destinationImageRoleLabel(destinationActiveImageRole)}</strong>
                    <span class={`image-geometry-miniature image-role-${destinationActiveImageRole}`} aria-hidden="true"><i></i></span>
                    <p>{destinationImageGeometry(destinationActiveImageRole).ratio} · {destinationImageGeometry(destinationActiveImageRole).pixels}</p>
                    <small>{destinationImageGeometry(destinationActiveImageRole).millimetres}</small>
                    <small>Bereite das Bild möglichst in dieser Geometrie vor. Studio schneidet es in Build 022 nicht frei zu.</small>
                  </div>
                </details>
              </div>
              <div class="destination-image-picker-actions" aria-label="Bildaktionen">
                <button type="button" class="destination-image-text-action" on:click={chooseDestinationImage} disabled={destinationImageState === 'saving'}>
                  {destinationActiveImagePath ? 'Bild ersetzen' : '+ Bild auswählen'}
                </button>
                {#if destinationActiveImagePath}
                  <span class="destination-image-action-separator" aria-hidden="true">·</span>
                  <button type="button" class="destination-image-remove-action" on:click={removeDestinationImage} disabled={destinationImageState === 'saving'}>Entfernen</button>
                {/if}
              </div>
              {#if destinationActiveImagePath}
                <small>Bild für {destinationImageRoleLabel(destinationActiveImageRole)} gewählt.</small>
              {:else}
                <small>Noch kein Bild gewählt.</small>
              {/if}
              {#if destinationImageState === 'saved'}<small>Bild übernommen.</small>{/if}
              {#if destinationImagePreviewError}<small class="planning-save-error">Die Bildvorschau konnte nicht geladen werden.</small>{/if}
            </div>

            <label class="destination-editorial-question">
              <span>Was möchtest du erleben?</span>
              <textarea rows="3" value={destinationReasons.join('\n')} on:input={(event) => updateDestinationReasonText(event.currentTarget.value)} placeholder="Zum Beispiel: Bryggen am Morgen&#10;Blick vom Fløyen&#10;Maritime Atmosphäre"></textarea>
              <small>Ein Gedanke pro Zeile.</small>
            </label>

            <div class="destination-section-title destination-quiet-section"><span>Reise vor Ort</span><strong>Für deinen Aufenthalt</strong></div>
            <div class="planning-field-row">
              <label><span>Ankunft</span><div class="travel-time-input"><input bind:value={destinationArrival} placeholder="08:00" /><span>Uhr</span></div></label>
              <label><span>Abfahrt</span><div class="travel-time-input"><input bind:value={destinationDeparture} placeholder="17:00" /><span>Uhr</span></div></label>
            </div>
            <label><span>Zeitzone</span><input bind:value={destinationTimezone} placeholder="MEZ / MESZ" /></label>

            <details class="destination-more">
              <summary>
                <span>Orte &amp; Motive</span>
                <small>{destinationHighlights.filter((entry) => entry.name.trim()).length || 'Noch keine'} notiert</small>
              </summary>
              <div class="destination-more-content">
                <div class="destination-list-heading"><div><strong>Was möchtest du vor Ort entdecken?</strong></div><button type="button" on:click={addDestinationHighlight}>+ Ort</button></div>
                <div class="destination-edit-list">
                  {#each destinationHighlights as highlight (highlight.id)}
                    <div class="destination-edit-item">
                      <input value={highlight.name} on:input={(event) => updateDestinationHighlight(highlight.id, { name: event.currentTarget.value })} placeholder="Ort oder Motiv" />
                      <textarea rows="2" value={highlight.description} on:input={(event) => updateDestinationHighlight(highlight.id, { description: event.currentTarget.value })} placeholder="Was macht diesen Ort besonders?"></textarea>
                      <div class="destination-item-actions">
                        <select aria-label="Art des Ortes" value={highlight.category} on:change={(event) => updateDestinationHighlightCategory(highlight.id, event.currentTarget.value)}>
                          <option value="landmark">Sehenswürdigkeit</option><option value="viewpoint">Aussicht</option><option value="architecture">Architektur</option><option value="nature">Natur</option><option value="culture">Kultur</option><option value="photography">Fotomotiv</option><option value="other">Sonstiges</option>
                        </select>
                        <button type="button" on:click={() => removeDestinationHighlight(highlight.id)}>Entfernen</button>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </details>

            <details class="destination-more">
              <summary>
                <span>Für unterwegs</span>
                <small>{destinationPracticalInfo.filter((entry) => entry.title.trim() || entry.text.trim()).length || 'Noch keine'} notiert</small>
              </summary>
              <div class="destination-more-content">
                <div class="destination-list-heading"><div><strong>Was hilft dir vor Ort?</strong></div><button type="button" on:click={addDestinationPracticalInfo}>+ Hinweis</button></div>
                <div class="destination-edit-list">
                  {#each destinationPracticalInfo as info (info.id)}
                    <div class="destination-edit-item">
                      <input value={info.title} on:input={(event) => updateDestinationPracticalInfo(info.id, { title: event.currentTarget.value })} placeholder="Zum Beispiel: Zu Fuß" />
                      <textarea rows="2" value={info.text} on:input={(event) => updateDestinationPracticalInfo(info.id, { text: event.currentTarget.value })} placeholder="Was ist unterwegs hilfreich?"></textarea>
                      <div class="destination-item-actions"><span></span><button type="button" on:click={() => removeDestinationPracticalInfo(info.id)}>Entfernen</button></div>
                    </div>
                  {/each}
                </div>
              </div>
            </details>

            <details class="destination-more destination-extensions-editor">
              <summary>
                <span>Besondere Hinweise</span>
                <small>{destinationEditorialExtensions.filter((entry) => entry.title.trim() || entry.text.trim()).length || 'Noch keine'} ergänzt</small>
              </summary>
              <div class="destination-more-content">
                <div class="destination-extension-editor-intro">
                  <strong>Nur wenn dieser Ort mehr zu erzählen hat.</strong>
                  <small>Signet und World-Farbe geben der Ergänzung ihre Bedeutung. Mehr braucht sie nicht.</small>
                </div>
                <div class="destination-extension-add-row">
                  <select aria-label="Art der redaktionellen Ergänzung" bind:value={destinationNewExtensionKind}>
                    {#each EDITORIAL_EXTENSION_DEFINITIONS as definition}<option value={definition.kind}>{definition.label}</option>{/each}
                  </select>
                  <button type="button" on:click={addDestinationEditorialExtension}>+ Ergänzung</button>
                </div>
                <div class="destination-edit-list destination-extension-edit-list">
                  {#each destinationEditorialExtensions as extension (extension.id)}
                    <div class="destination-edit-item destination-extension-edit-item">
                      <div class="destination-extension-edit-heading">
                        <span class={`editorial-signet editorial-signet-${editorialExtensionDefinition(extension.kind).signet}`} aria-hidden="true"></span>
                        <select aria-label="Art der Ergänzung" value={extension.kind} on:change={(event) => updateDestinationEditorialExtensionKind(extension.id, event.currentTarget.value)}>
                          {#each EDITORIAL_EXTENSION_DEFINITIONS as definition}<option value={definition.kind}>{definition.label}</option>{/each}
                        </select>
                        <button type="button" class="destination-extension-remove" on:click={() => removeDestinationEditorialExtension(extension.id)}>Entfernen</button>
                      </div>
                      <input value={extension.title} on:input={(event) => updateDestinationEditorialExtension(extension.id, { title: event.currentTarget.value })} placeholder="Eigener Titel (optional)" />
                      <textarea rows="2" value={extension.text} on:input={(event) => updateDestinationEditorialExtension(extension.id, { text: event.currentTarget.value })} placeholder={editorialExtensionDefinition(extension.kind).hint}></textarea>
                    </div>
                  {/each}
                </div>
              </div>
            </details>

            {#if destinationExtensionCapacityInfo.state !== 'comfortable'}
              <div class:overflow={destinationExtensionOverflow} class="destination-capacity-guidance" role="status">
                <span>{destinationExtensionOverflow ? 'Mehr Raum nötig' : 'Diese Seite wird dichter'}</span>
                <strong>{destinationExtensionOverflow ? 'Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.' : 'Studio nutzt bereits eine kompaktere Komposition.'}</strong>
                {#if destinationExtensionOverflow}
                  <small>{destinationExtensionAlternativeLabels.length ? `Prüfe ${destinationExtensionAlternativeLabels.join(' oder ')} – dort kann derselbe Inhalt mehr Raum bekommen.` : 'Auch die anderen Seitenwirkungen reichen für diesen Inhalt nicht aus. Kürze eine Ergänzung oder verteile sie später auf eine Fortsetzungsseite.'}</small>
                {/if}
              </div>
            {/if}

            <div class="destination-section-title destination-effect-title"><span>Seitenwirkung</span><strong>Wie soll sich dieser Ort öffnen?</strong></div>
            <div class="destination-layout-options" role="radiogroup" aria-label="Seitenwirkung">
              {#each editorialLayout?.destinationLayouts ?? [] as layout}
                <button type="button" class:active={destinationLayoutVariant === layout.id} aria-pressed={destinationLayoutVariant === layout.id} on:click={() => destinationLayoutVariant = layout.id}>
                  <span class={`layout-miniature ${layout.id}`} aria-hidden="true">
                    <i class="layout-miniature-image"></i>
                    <i class="layout-miniature-copy"></i>
                  </span>
                  <span class="layout-option-copy"><strong>{layout.label}</strong><small>{layout.description}</small></span>
                </button>
              {/each}
            </div>
          </div>

          <button class="planning-save-button" on:click={saveDestinationProfile} disabled={destinationSaveState === 'saving'}>
            {destinationSaveState === 'saving' ? 'Ortsprofil wird gesichert …' : 'Ortsprofil sichern'}
          </button>
          {#if destinationSaveState === 'saved'}<small class="planning-save-state">Ortsprofil gesichert.</small>{/if}
          {#if destinationSaveState === 'error'}<small class="planning-save-state planning-save-error">Ortsprofil konnte nicht gesichert werden.</small>{/if}
        </section>
      {/if}

      {#if editorialWorld && selectedPage?.type !== 'destination'}
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

      {#if editorialLayout && selectedPage?.type !== 'destination'}
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

      {#if activeCompanion && selectedPage?.type !== 'destination'}
        <section class="inspector-card companion-layout-card" aria-label="Reisebegleiter im Layout">
          <span class="inspector-label">Reisebegleiter</span>
          <div class="companion-layout-preview">
            <img src={`/${activeCompanion.assetPath}`} alt={activeCompanion.name} />
            <div>
              <strong>{activeCompanion.name}</strong>
              <small>{companionVisible ? 'Begleitet diese Seite' : 'Beginnt erst mit der Reiseplanung'}</small>
            </div>
          </div>
          <div class="companion-layout-facts">
            <span>Platz</span><strong>unten links</strong>
            <span>Pose</span><strong>Standard</strong>
            <span>Spiegelung</span><strong>aus</strong>
          </div>
        </section>
      {/if}

      {#if editorialGrammar && grammarEvaluation && selectedPage?.type !== 'destination'}
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

      {#if storyStructure && selectedPage?.type !== 'destination'}
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

      {#if selectedPage?.type !== 'destination'}
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
      {/if}
      </div>
    </aside>
  </main>

  <footer class="status-bar" aria-label="Reisestatus">
    <span>{editorialWorld ? `${editorialWorld.name} · Reisewelt` : 'Northern Lines Studio'}</span>
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
        <strong id="save-dialog-title">Änderungen an „{unsavedDialogLabel}“ speichern?</strong>
        <p id="save-dialog-description">Du hast Änderungen vorgenommen, die noch nicht gespeichert wurden.</p>
        <div class="save-dialog-actions">
          <button class="dialog-secondary" on:click={() => continuePendingAction(false)}>Verwerfen</button>
          <button class="dialog-secondary" on:click={cancelPendingAction}>Abbrechen</button>
          <button bind:this={saveDialogPrimary} class="dialog-primary" on:click={() => continuePendingAction(true)}>Speichern</button>
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
        <p id="journey-begin-description">Gib deiner Reise einen Namen und wähle die Reisewelt, die sie begleiten soll.</p>

        <label class="journey-field">
          <span>Name deiner Reise</span>
          <input bind:this={journeyTitleInput} bind:value={newJourneyTitle} placeholder="Zum Beispiel: Island im Winter" />
        </label>

        <label class="journey-field">
          <span>Reisewelt</span>
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
