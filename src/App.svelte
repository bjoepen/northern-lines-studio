<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import type { BackgroundThrottlingPolicy } from '@tauri-apps/api/window';
  import { WebviewWindow, getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
  import { open, save } from '@tauri-apps/plugin-dialog';
  import type { DestinationEditorialExtension, DestinationHighlight, DestinationInterestEntry, DestinationInterestKind, DestinationLayoutVariantId, DestinationPracticalInfo, EditorialExtensionKind, JourneyStage, StudioPage, StudioProject } from './lib/project';
  import { journeyStageFor, previewFor } from './lib/project';
  import { computePreviewScale, PREVIEW_BASE_HEIGHT, PREVIEW_BASE_WIDTH } from './lib/preview';
  import { editorialWorldFor, groupPages, pageRoleLabel, projectStatus, travelbookPageNumber } from './lib/workspace';
  import { availableEditorialWorlds, requireEditorialWorld } from './lib/worlds';
  import { layoutSystemForWorld } from './lib/layout';
  import { destinationContentCapacity, destinationExtensionCapacityResult, destinationExtensionComposition, destinationModuleComposition, destinationTitleComposition } from './lib/layout/capacity';
  import { northernLinesFooter } from './lib/travel-language/footer';
  import { requireCompanion } from './lib/companions';
  import { companionVisibleForRole, fjordCompanionLayout, balticCompanionLayout } from './lib/companions/layout';
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
  import { DESTINATION_INTEREST_DEFINITIONS, destinationInterestDefinition, destinationInterestKindsForStage, destinationInterestLabel } from './lib/destination-interests';
  import { emptyInterestEntry, interestEntryContentLength, interestEntrySchema, interestPageLayoutState } from './lib/destination-interests/entries';
  import { clampInspectorWidth, INSPECTOR_DEFAULT_WIDTH, INSPECTOR_WIDTH_STORAGE_KEY, parseStoredInspectorWidth } from './lib/inspector-layout';
  import { CURATED_LIGHT_PHASES } from './lib/travel-companion-light';
  import { CURATED_WEATHER_SITUATIONS } from './lib/travel-companion-weather';
  import { CURATED_WORKSHOP_BRIDGE, CURATED_WORKSHOP_WORLDS } from './lib/travel-companion-workshop';
  import { curatedHeroFor } from './lib/curated-heroes';
  import { curatedAccentFor } from './lib/curated-accents';
  import {
    backgroundProofPoc001BuildHostUrl,
    backgroundProofPoc001EventNames,
    backgroundProofPoc001BackgroundStandardOutputPath,
    backgroundProofPoc001HiddenHostViewportForMain,
    backgroundProofPoc001HostRequestIsComplete,
    backgroundProofPoc001LifecycleTimeoutError,
    backgroundProofPoc001MainWindowInvariant,
    backgroundProofPoc001OutputDirForFinalOutputPath,
    backgroundProofPoc001OutputPath,
    backgroundProofPoc001ParseHostParams,
    backgroundProofPoc001SafeTraceValue,
    assembleStudioDocumentPdfProof,
    backgroundProofPoc001ReferencePages,
    cleanupStudioDocumentPdfProof,
    createStudioPdfProof,
    evaluateRenderedStudioPageReadiness,
    exportStudioPdfA2b,
    incompleteStudioPageImages,
    mainRendererExportCoverBuildUrl,
    mainRendererExportCoverEventName,
    mainRendererExportCoverParseParams,
    prepareStudioDocumentPdfProof,
    restoredDocumentProofPage,
    stagedDocumentProofPagePath,
    studioPageFadeDurationMs,
    studioDocumentProofPages,
    type BackgroundProofPoc001LifecycleEvent,
    type BackgroundProofPoc001LifecycleStep,
    type MainRendererExportCoverProgress,
    type BackgroundProofPoc001OutputEvidence,
    type BackgroundProofPoc001Result,
    type StudioDocumentProofPage,
    type StudioPdfProofReadinessErrorCode,
    type StudioPdfProofStatus
  } from './lib/pdf-proof';

  type TravelbookExportProfile = 'standard' | 'pdfa2b';

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
  let pdfProofStatus: StudioPdfProofStatus = 'idle';
  let backgroundProofPocStatus: 'idle' | 'running' | 'saved' | 'error' = 'idle';
  let backgroundProofPocMessage = '';
  let worldChangeState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let previewStage: HTMLDivElement | null = null;
  let previewScale = 1;
  let activeAuthoringComponent: EditorialComponentId | null = null;
  let authoringDraft = '';
  let authoringStatus: AuthoringStatus = 'empty';
  let authoringSaveState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let projectMenuOpen = false;
  let outputMenuOpen = false;
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
  let interestEntryDraft: DestinationInterestEntry | null = null;
  let interestEntryOriginalSignature = '';
  let interestEntrySaveState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let inspectorWidth = INSPECTOR_DEFAULT_WIDTH;
  let inspectorPreferredWidth = INSPECTOR_DEFAULT_WIDTH;
  let inspectorResizing = false;
  const journeyWorlds = availableEditorialWorlds();
  const backgroundProofPocHostParams = backgroundProofPoc001ParseHostParams(window.location.search);
  const isBackgroundProofPocHost = backgroundProofPocHostParams.isHost;
  const backgroundProofPocProjectPath = backgroundProofPocHostParams.projectPath;
  const backgroundProofPocOutputDir = backgroundProofPocHostParams.outputDir;
  const backgroundProofPocFinalOutputPath = backgroundProofPocHostParams.finalOutputPath;
  const backgroundProofPocJobId = backgroundProofPocHostParams.jobId;
  const backgroundProofPocReturnTo = backgroundProofPocHostParams.returnTo;
  const backgroundProofPocMode = backgroundProofPocHostParams.mode;
  const backgroundProofPocNoThrottling = 'disabled' as BackgroundThrottlingPolicy;
  const mainRendererExportCoverParams = mainRendererExportCoverParseParams(window.location.search);
  const isMainRendererExportCoverHost = mainRendererExportCoverParams.isCover;
  const mainRendererExportCoverJobId = mainRendererExportCoverParams.jobId;
  let mainRendererExportCoverProgress: MainRendererExportCoverProgress = {
    currentPage: 0,
    pageCount: mainRendererExportCoverParams.pageCount
  };
  const BACKGROUND_PROOF_POC_001_WATCHDOG_MS = 45_000;

  function displayPageTitle(page: StudioPage | null | undefined): string {
    if (!page) return 'Keine Seite ausgewählt';
    return page.type === 'workflow' ? 'Fotografie-Workshop' : page.title;
  }

  function proofFileTitle(value: string): string {
    return value.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'Northern-Lines-Studio';
  }

  function proofReadinessMessage(code: StudioPdfProofReadinessErrorCode, pageTitle: string | undefined, reason: string): string {
    const label = pageTitle ? `${pageTitle}: ` : '';
    return `${code}: ${label}Die Studio-Seite ist noch nicht vollständig bereit (${reason}).`;
  }

  function renderedStudioPages(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.a5-page'));
  }

  function currentRenderedStudioPage(pageId: string): HTMLElement | null {
    return renderedStudioPages().find((page) => page.dataset.studioPageId === pageId) ?? null;
  }

  function backgroundProofPoc001Number(value: number | undefined): string {
    const raw = value ?? Number.NaN;
    return Number.isFinite(raw) ? String(Math.round(raw * 1000) / 1000) : 'unavailable';
  }

  function backgroundProofPoc001ViewportTraceDetail(label: string, requested?: { width: number; height: number }): string {
    const visualViewport = window.visualViewport;
    const documentElement = document.documentElement;
    return [
      `label=${backgroundProofPoc001SafeTraceValue(label)}`,
      `inner=${window.innerWidth}x${window.innerHeight}`,
      `client=${documentElement.clientWidth}x${documentElement.clientHeight}`,
      `dpr=${backgroundProofPoc001Number(window.devicePixelRatio)}`,
      `screen=${window.screen.width}x${window.screen.height}`,
      `avail=${window.screen.availWidth}x${window.screen.availHeight}`,
      `visual=${visualViewport ? `${backgroundProofPoc001Number(visualViewport.width)}x${backgroundProofPoc001Number(visualViewport.height)}@${backgroundProofPoc001Number(visualViewport.scale)}` : 'unavailable'}`,
      `visibility=${document.visibilityState}`,
      requested ? `requested=${requested.width}x${requested.height}` : ''
    ].filter(Boolean).join(' ');
  }

  function backgroundProofPoc001ImageTraceDetail(label: string, selector: string): string | null {
    const image = document.querySelector<HTMLImageElement>(selector);
    if (!image) return null;
    const rect = image.getBoundingClientRect();
    const style = window.getComputedStyle(image);
    return [
      label,
      `selector=${selector}`,
      `src=${backgroundProofPoc001SafeTraceValue(image.getAttribute('src') ?? image.src, 72)}`,
      `currentSrc=${backgroundProofPoc001SafeTraceValue(image.currentSrc || 'none', 72)}`,
      `natural=${image.naturalWidth}x${image.naturalHeight}`,
      `client=${image.clientWidth}x${image.clientHeight}`,
      `rect=${backgroundProofPoc001Number(rect.width)}x${backgroundProofPoc001Number(rect.height)}`,
      `css=${style.width}x${style.height}`,
      `objectFit=${style.objectFit}`,
      `imageRendering=${style.imageRendering}`,
      `complete=${image.complete}`,
      `srcset=${image.getAttribute('srcset') ? 'present' : 'none'}`,
      `sizes=${image.getAttribute('sizes') ? 'present' : 'none'}`
    ].join(' ');
  }

  function backgroundProofPoc001AssetTraceDetail(): string {
    const entries = [
      backgroundProofPoc001ImageTraceDetail('companion', '.page-companion'),
      backgroundProofPoc001ImageTraceDetail('destinationHero', '.destination-hero-image'),
      backgroundProofPoc001ImageTraceDetail('curatedHero', '.curated-world-hero'),
      backgroundProofPoc001ImageTraceDetail('notesAccent', '.curated-world-accent')
    ].filter((entry): entry is string => Boolean(entry));
    return entries.length > 0 ? entries.join(' | ') : 'images=none';
  }

  async function waitForBrowserLayoutFrame(options: {
    allowHiddenHostFallback?: boolean;
    onTrace?: (step: BackgroundProofPoc001LifecycleStep, detail?: string) => Promise<void>;
    layoutFrameStartStep?: BackgroundProofPoc001LifecycleStep;
    layoutFrameCompleteStep?: BackgroundProofPoc001LifecycleStep;
    layoutFrameFallbackStep?: BackgroundProofPoc001LifecycleStep;
  } = {}) {
    if (typeof requestAnimationFrame !== 'function') return;
    const startStep = options.layoutFrameStartStep ?? 'HOST_LAYOUT_FRAME_START';
    const completeStep = options.layoutFrameCompleteStep ?? 'HOST_LAYOUT_FRAME_COMPLETE';
    const fallbackStep = options.layoutFrameFallbackStep ?? 'HOST_LAYOUT_FRAME_FALLBACK';
    await options.onTrace?.(startStep, `visibility=${document.visibilityState}`);
    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        void options.onTrace?.(completeStep);
        resolve();
      };
      requestAnimationFrame(() => finish());
      if (options.allowHiddenHostFallback && document.visibilityState === 'hidden') {
        const startWatchdog = window.setTimeout.bind(window);
        startWatchdog(() => {
          if (settled) return;
          settled = true;
          void options.onTrace?.(fallbackStep, 'requestAnimationFrame did not fire while Hidden Host was hidden');
          resolve();
        }, 250);
      }
    });
  }

  async function waitForStudioDomCommit(options: {
    allowHiddenHostFallback?: boolean;
    onTrace?: (step: BackgroundProofPoc001LifecycleStep, detail?: string) => Promise<void>;
    domCommitStartStep?: BackgroundProofPoc001LifecycleStep;
    domCommitCompleteStep?: BackgroundProofPoc001LifecycleStep;
    layoutFrameStartStep?: BackgroundProofPoc001LifecycleStep;
    layoutFrameCompleteStep?: BackgroundProofPoc001LifecycleStep;
    layoutFrameFallbackStep?: BackgroundProofPoc001LifecycleStep;
  } = {}) {
    await options.onTrace?.(options.domCommitStartStep ?? 'HOST_DOM_COMMIT_START');
    await tick();
    if (options.domCommitCompleteStep) {
      await options.onTrace?.(options.domCommitCompleteStep);
    }
    await waitForBrowserLayoutFrame(options);
  }

  function runningPageAnimationCount(page: HTMLElement): number {
    const animations = typeof page.getAnimations === 'function'
      ? page.getAnimations({ subtree: true })
      : [];
    return animations.filter((animation) => animation.playState === 'running').length;
  }

  function assertResolvedStudioPage(
    pageId: string,
    options: {
      code?: StudioPdfProofReadinessErrorCode;
      pageTitle?: string;
      expectProofMode?: boolean;
    } = {}
  ): HTMLElement {
    const code = options.code ?? 'PDF_PROOF_NO_PAGE';
    const pages = renderedStudioPages();
    const page = currentRenderedStudioPage(pageId);
    const computed = page ? getComputedStyle(page) : null;
    const readiness = evaluateRenderedStudioPageReadiness({
      requestedPageId: pageId,
      selectedPageId: selectedPage?.id ?? null,
      renderedPageId: page?.dataset.studioPageId ?? pages[0]?.dataset.studioPageId ?? null,
      renderedPageCount: pages.length,
      display: computed?.display ?? 'none',
      visibility: computed?.visibility ?? 'hidden',
      opacity: computed ? Number.parseFloat(computed.opacity || '0') : 0,
      filter: computed?.filter ?? 'none',
      transform: computed?.transform ?? 'none',
      runningAnimationCount: page ? runningPageAnimationCount(page) : 0,
      expectProofMode: options.expectProofMode ?? false
    }, code);
    if (!readiness.ready) {
      throw new Error(proofReadinessMessage(readiness.code, options.pageTitle, readiness.reason));
    }
    if (!page) {
      throw new Error(proofReadinessMessage(code, options.pageTitle, 'dom=none'));
    }
    return page;
  }

  async function waitForResolvedStudioPage(
    pageId: string,
    options: {
      code?: StudioPdfProofReadinessErrorCode;
      pageTitle?: string;
      expectProofMode?: boolean;
      allowHiddenHostFallback?: boolean;
      onTrace?: (step: BackgroundProofPoc001LifecycleStep, detail?: string) => Promise<void>;
    } = {}
  ) {
    await waitForStudioDomCommit({
      allowHiddenHostFallback: options.allowHiddenHostFallback,
      onTrace: options.onTrace
    });
    let page = assertResolvedStudioPage(pageId, options);
    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      await fontsReady;
      await waitForStudioDomCommit({
        allowHiddenHostFallback: options.allowHiddenHostFallback,
        onTrace: options.onTrace
      });
      page = assertResolvedStudioPage(pageId, options);
    }
    const images = Array.from(page.querySelectorAll<HTMLImageElement>('img'));
    const failedImages = images.filter((image) => image.complete && image.naturalWidth <= 0);
    if (failedImages.length > 0) {
      throw new Error('PDF_PROOF_ASSET_NOT_READY: Ein Bild ist noch nicht verfügbar.');
    }
    const pendingImages = images.filter((image) => !image.complete);
    if (pendingImages.length > 0) {
      await Promise.all(pendingImages.map((image) => new Promise<void>((resolve, reject) => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => reject(new Error('PDF_PROOF_ASSET_NOT_READY: Ein Bild ist noch nicht verfügbar.')), { once: true });
      })));
      await waitForStudioDomCommit({
        allowHiddenHostFallback: options.allowHiddenHostFallback,
        onTrace: options.onTrace
      });
      page = assertResolvedStudioPage(pageId, options);
      if (incompleteStudioPageImages(Array.from(page.querySelectorAll<HTMLImageElement>('img'))).length > 0) {
        throw new Error('PDF_PROOF_ASSET_NOT_READY: Ein Bild ist noch nicht verfügbar.');
      }
    }
  }

  async function createPdfProofForCurrentPage() {
    if (!selectedPage) {
      errorMessage = 'PDF_PROOF_NO_PAGE: Es ist keine Studio-Seite ausgewählt.';
      return;
    }
    if (!document.querySelector('.a5-page')) {
      errorMessage = 'PDF_PROOF_NO_PAGE: Die Studio-Seite ist noch nicht bereit.';
      return;
    }

    pdfProofStatus = 'preparing';
    errorMessage = '';
    await tick();

    try {
      await waitForResolvedStudioPage(selectedPage.id);

      const outputPath = await save({
        title: 'PDF-Proof speichern',
        defaultPath: `${proofFileTitle(displayPageTitle(selectedPage))}-Proof.pdf`,
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
      });
      if (!outputPath) {
        pdfProofStatus = 'idle';
        return;
      }

      pdfProofStatus = 'rendering';
      document.body.classList.add('pdf-proof-rendering');
      await waitForResolvedStudioPage(selectedPage.id, { expectProofMode: true });
      await createStudioPdfProof({
        pageId: selectedPage.id,
        physicalMedium: 'A5',
        outputPath
      });
      pdfProofStatus = 'saved';
    } catch (error) {
      pdfProofStatus = 'error';
      errorMessage = String(error);
    } finally {
      document.body.classList.remove('pdf-proof-rendering');
    }
  }

  async function createTravelbookPdf(profile: TravelbookExportProfile = 'standard') {
    if (!project) {
      errorMessage = 'PDF_DOCUMENT_PROOF_NO_PAGES: Es ist kein Travelbook geöffnet.';
      return;
    }
    const pages = studioDocumentProofPages(project);
    if (pages.length === 0) {
      errorMessage = 'PDF_DOCUMENT_PROOF_NO_PAGES: Dieses Travelbook hat noch keine Seiten.';
      return;
    }
    if (hasUnsavedChanges) {
      errorMessage = 'PDF_DOCUMENT_PROOF_PAGE_FAILED: Bitte speichere die aktuelle Bearbeitung, bevor das ganze Travelbook exportiert wird.';
      return;
    }

    const originalPageId = selectedPage?.id ?? null;
    const projectTitle = project.title;
    let stagingPath = '';
    let temporaryStandardPath = '';
    let exportCover: WebviewWindow | null = null;
    const exportCoverJobId = `plan-b-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
    const exportCoverProgressEvent = mainRendererExportCoverEventName(exportCoverJobId);
    pdfProofStatus = 'preparing';
    errorMessage = '';
    await tick();

    try {
      const outputPath = await save({
        title: profile === 'pdfa2b' ? 'Travelbook als PDF/A-2b speichern' : 'Travelbook als PDF speichern',
        defaultPath: profile === 'pdfa2b'
          ? `${proofFileTitle(projectTitle)}-Travelbook-PDFA-2b.pdf`
          : `${proofFileTitle(projectTitle)}-Travelbook.pdf`,
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
      });
      if (!outputPath) {
        pdfProofStatus = 'idle';
        return;
      }

      if (profile === 'pdfa2b') {
        const coverUrl = mainRendererExportCoverBuildUrl(window.location.href, {
          jobId: exportCoverJobId,
          pageCount: pages.length
        });
        const coverWidth = Math.max(Math.ceil(window.outerWidth || window.innerWidth), 980);
        const coverHeight = Math.max(Math.ceil(window.outerHeight || window.innerHeight), 700);
        exportCover = new WebviewWindow(`main-renderer-export-cover-${exportCoverJobId}`, {
          url: coverUrl,
          title: 'Northern Lines Studio · Travelbook Export',
          width: coverWidth,
          height: coverHeight,
          x: Number.isFinite(window.screenX) ? Math.round(window.screenX) : undefined,
          y: Number.isFinite(window.screenY) ? Math.round(window.screenY) : undefined,
          resizable: false,
          decorations: false,
          visible: true,
          focus: true,
          skipTaskbar: true,
          alwaysOnTop: true,
          parent: getCurrentWebviewWindow().label,
          backgroundThrottling: backgroundProofPocNoThrottling
        });
        await new Promise<void>((resolve, reject) => {
          void exportCover?.once('tauri://created', () => resolve());
          void exportCover?.once<string>('tauri://error', (event) => reject(new Error(String(event.payload))));
        });
      }

      const staging = await prepareStudioDocumentPdfProof({ pageCount: pages.length });
      stagingPath = staging.stagingPath;
      const stagedPages: StudioDocumentProofPage[] = [];

      pdfProofStatus = 'rendering';
      for (const [position, page] of pages.entries()) {
        const index = position + 1;
        if (exportCover) {
          await getCurrentWebviewWindow().emitTo(exportCover.label, exportCoverProgressEvent, {
            currentPage: index,
            pageCount: pages.length
          } satisfies MainRendererExportCoverProgress);
        }
        selectPageNow(page);
        await waitForResolvedStudioPage(page.id, {
          code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
          pageTitle: displayPageTitle(page)
        });
        document.body.classList.add('pdf-proof-rendering');
        await waitForResolvedStudioPage(page.id, {
          code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
          pageTitle: displayPageTitle(page),
          expectProofMode: true
        });
        const stagedPath = stagedDocumentProofPagePath(stagingPath, index);
        await createStudioPdfProof({
          pageId: page.id,
          physicalMedium: 'A5',
          outputPath: stagedPath
        });
        stagedPages.push({
          index,
          pageId: page.id,
          title: displayPageTitle(page),
          stagedPath
        });
        document.body.classList.remove('pdf-proof-rendering');
        await waitForStudioDomCommit();
      }

      temporaryStandardPath = profile === 'pdfa2b'
        ? `${stagingPath}/travelbook-standard.pdf`
        : outputPath;
      await assembleStudioDocumentPdfProof({
        outputPath: temporaryStandardPath,
        stagingPath,
        pages: stagedPages
      });
      if (profile === 'pdfa2b') {
        await exportStudioPdfA2b({
          sourcePath: temporaryStandardPath,
          outputPath
        });
      }
      pdfProofStatus = 'saved';
    } catch (error) {
      pdfProofStatus = 'error';
      errorMessage = String(error);
    } finally {
      document.body.classList.remove('pdf-proof-rendering');
      if (originalPageId && project) {
        const originalPage = restoredDocumentProofPage(studioDocumentProofPages(project), originalPageId);
        if (originalPage) selectPageNow(originalPage);
      }
      if (exportCover) {
        try {
          await exportCover.close();
        } catch {
          // The export cover may already be gone after a window lifecycle failure.
        }
      }
      if (stagingPath) {
        try {
          await cleanupStudioDocumentPdfProof(stagingPath);
        } catch {
          // Staging cleanup is best-effort after the proof result has been reported.
        }
      }
    }
  }

  async function createPdfProofForTravelbook() {
    await createTravelbookPdf('standard');
  }

  async function createFinalTravelbookPdf() {
    outputMenuOpen = false;
    await createTravelbookPdf('pdfa2b');
  }

  async function createDevelopmentPdf() {
    outputMenuOpen = false;
    await createPdfProofForTravelbook();
  }

  async function createBackgroundProofPoc001(mode: 'reference-pages' | 'document-pdfa2b' = 'reference-pages') {
    if (!project?.projectPath) {
      errorMessage = 'BACKGROUND_PROOF_POC_001_NO_PROJECT: Es ist kein gespeichertes Travelbook geöffnet.';
      return;
    }
    if (hasUnsavedChanges) {
      errorMessage = 'BACKGROUND_PROOF_POC_001_UNSAVED_CHANGES: Bitte sichere die aktuelle Bearbeitung, bevor der Background Proof PoC läuft.';
      return;
    }

    let outputDir = '';
    let finalOutputPath = '';
    if (mode === 'document-pdfa2b') {
      const selectedOutputPath = await save({
        title: 'Travelbook als PDF exportieren',
        defaultPath: `${proofFileTitle(project.title)}.pdf`,
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
      });
      if (!selectedOutputPath) return;
      finalOutputPath = selectedOutputPath;
      outputDir = backgroundProofPoc001OutputDirForFinalOutputPath(finalOutputPath);
      if (!outputDir) {
        errorMessage = 'BACKGROUND_PROOF_POC_001_INVALID_OUTPUT: Der Zielpfad muss in einem Ordner liegen.';
        return;
      }
    } else {
      const selectedOutputDir = await open({
        directory: true,
        multiple: false,
        title: 'Zielordner für Background Proof PoC 001'
      });
      if (!selectedOutputDir || Array.isArray(selectedOutputDir)) return;
      outputDir = selectedOutputDir;
    }

    const currentWebview = getCurrentWebviewWindow();
    const mainLabel = currentWebview.label;
    const jobId = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
    const events = backgroundProofPoc001EventNames(jobId);
    const beforePageId = selectedPage?.id ?? null;
    let duringPageId: string | null = null;
    let lastLifecycleStep: BackgroundProofPoc001LifecycleStep | null = null;
    let lastLifecycleComponent = 'main';
    let lastLifecycleOperation = 'start';
    let hiddenHost: WebviewWindow | null = null;
    let watchdogTimer: number | null = null;
    const unlisteners: Array<() => void> = [];
    let resolveResult: (result: BackgroundProofPoc001Result) => void = () => {};
    const resultPromise = new Promise<BackgroundProofPoc001Result>((resolve) => {
      resolveResult = resolve;
    });

    const recordLifecycle = (
      step: BackgroundProofPoc001LifecycleStep,
      source: 'main' | 'hidden-host' = 'main',
      detail = '',
      updateStatusMessage = true
    ) => {
      lastLifecycleStep = step;
      lastLifecycleComponent = source;
      lastLifecycleOperation = detail;
      console.info('[Background Proof PoC 001]', { jobId, step, source, detail });
      if (!updateStatusMessage) return;
      backgroundProofPocMessage = [
        `Main selectedPage before: ${beforePageId ?? 'none'}`,
        `Lifecycle: ${step}`,
        detail
      ].filter(Boolean).join(' · ');
    };

    backgroundProofPocStatus = 'running';
    backgroundProofPocMessage = `Main selectedPage before: ${beforePageId ?? 'none'}`;
    errorMessage = '';

    try {
      recordLifecycle('MAIN_POC_START', 'main', `main=${mainLabel}`);
      const hostUrl = backgroundProofPoc001BuildHostUrl(window.location.href, {
        projectPath: project.projectPath,
        outputDir,
        finalOutputPath,
        jobId,
        returnTo: mainLabel,
        mode
      });
      const hiddenHostViewport = backgroundProofPoc001HiddenHostViewportForMain({
        width: window.innerWidth,
        height: window.innerHeight
      });
      recordLifecycle('MAIN_RENDER_ENVIRONMENT', 'main', backgroundProofPoc001ViewportTraceDetail(mainLabel, hiddenHostViewport));
      recordLifecycle('MAIN_ASSET_EVIDENCE', 'main', backgroundProofPoc001AssetTraceDetail());
      if (mode === 'document-pdfa2b') {
        const backgroundStandardPath = backgroundProofPoc001BackgroundStandardOutputPath(finalOutputPath);
        recordLifecycle('FULL_DOCUMENT_HOST_REQUEST', 'main', [
          `mode=${mode}`,
          `projectPath=${project.projectPath ? 'present' : 'missing'}`,
          `outputDir=${outputDir ? 'present' : 'missing'}`,
          `jobId=${jobId ? 'present' : 'missing'}`,
          `returnTo=${mainLabel}`,
          `finalOutputPath=${finalOutputPath ? 'present' : 'missing'}`,
          `backgroundStandardPath=${backgroundStandardPath ? 'present' : 'missing'}`
        ].join(' '));
        recordLifecycle('FULL_DOCUMENT_HOST_REQUEST_VALID', 'main', `mode=${mode} outputDir=derived`);
      }

      const unlistenResult = await listen<BackgroundProofPoc001Result>(events.result, (event) => {
        recordLifecycle('MAIN_RESULT_RECEIVED');
        resolveResult(event.payload);
      });
      unlisteners.push(unlistenResult);

      const unlistenLifecycle = await listen<BackgroundProofPoc001LifecycleEvent>(events.lifecycle, (event) => {
        lastLifecycleStep = event.payload.step;
        lastLifecycleComponent = event.payload.component ?? event.payload.source;
        lastLifecycleOperation = event.payload.operation ?? event.payload.detail ?? '';
        console.info('[Background Proof PoC 001]', event.payload);
        backgroundProofPocMessage = [
          `Main selectedPage before: ${beforePageId ?? 'none'}`,
          `Lifecycle: ${event.payload.step}`,
          event.payload.referenceTitle ? `Hidden: ${event.payload.referenceTitle}` : '',
          event.payload.detail ?? ''
        ].filter(Boolean).join(' · ');
      });
      unlisteners.push(unlistenLifecycle);

      const unlistenProgress = await listen<{ referenceTitle: string }>(events.progress, (event) => {
        duringPageId = selectedPage?.id ?? null;
        backgroundProofPocMessage = `Main selectedPage before: ${beforePageId ?? 'none'} · during: ${duringPageId ?? 'none'} · Hidden: ${event.payload.referenceTitle}`;
      });
      unlisteners.push(unlistenProgress);

      recordLifecycle('MAIN_LISTENERS_READY', 'main', `result=${events.result}`);
      recordLifecycle('HOST_CREATE_REQUEST', 'main', `url=${backgroundProofPoc001SafeTraceValue(hostUrl)} target=${mainLabel}`);
      hiddenHost = new WebviewWindow(`background-proof-poc-001-${jobId}`, {
        url: hostUrl,
        title: 'Northern Lines Studio Background Proof PoC 001',
        width: hiddenHostViewport.width,
        height: hiddenHostViewport.height,
        resizable: false,
        decorations: false,
        visible: false,
        focus: false,
        skipTaskbar: true,
        backgroundThrottling: backgroundProofPocNoThrottling
      });
      await new Promise<void>((resolve, reject) => {
        void hiddenHost?.once('tauri://created', () => resolve());
        void hiddenHost?.once<string>('tauri://error', (event) => {
          recordLifecycle('HOST_LOAD_FAILED', 'main', String(event.payload));
          reject(new Error(String(event.payload)));
        });
      });
      recordLifecycle('HOST_CREATED', 'main', hiddenHost.label);

      const watchdogPromise = new Promise<never>((_, reject) => {
        const startWatchdog = window.setTimeout.bind(window);
        watchdogTimer = startWatchdog(() => {
          reject(new Error(backgroundProofPoc001LifecycleTimeoutError(
            lastLifecycleStep,
            BACKGROUND_PROOF_POC_001_WATCHDOG_MS,
            lastLifecycleComponent,
            lastLifecycleOperation
          )));
        }, BACKGROUND_PROOF_POC_001_WATCHDOG_MS);
      });
      const result = await Promise.race([resultPromise, watchdogPromise]);
      const afterPageId = selectedPage?.id ?? null;
      const invariant = backgroundProofPoc001MainWindowInvariant(beforePageId, duringPageId, afterPageId);
      if (!result.ok) {
        throw new Error(result.error ?? 'BACKGROUND_PROOF_POC_001_FAILED: Hidden Host meldete keinen Erfolg.');
      }
      if (!invariant) {
        throw new Error(`BACKGROUND_PROOF_POC_001_MAIN_INVARIANT_FAILED: before=${beforePageId ?? 'none'} during=${duringPageId ?? 'none'} after=${afterPageId ?? 'none'}`);
      }
      backgroundProofPocStatus = 'saved';
      backgroundProofPocMessage = [
        `Main selectedPage before/during/after: ${beforePageId ?? 'none'}`,
        result.pageCount ? `pages=${result.pageCount}` : '',
        result.standardOutputPath ? `standard=${result.standardOutputPath}` : '',
        result.finalOutputPath ? `final=${result.finalOutputPath}` : '',
        ...(result.outputs ?? [])
      ].filter(Boolean).join(' · ');
    } catch (error) {
      backgroundProofPocStatus = 'error';
      errorMessage = String(error);
    } finally {
      if (watchdogTimer !== null) window.clearTimeout(watchdogTimer);
      for (const unlisten of unlisteners) unlisten();
      if (hiddenHost) {
        try {
          recordLifecycle('HOST_CLOSE_REQUEST', 'main', hiddenHost.label, backgroundProofPocStatus === 'running');
          await hiddenHost.close();
          recordLifecycle('HOST_CLOSED', 'main', hiddenHost.label, false);
          recordLifecycle('COMPLETE', 'main', hiddenHost.label, false);
        } catch {
          // The Hidden Host may already be gone after a failed PoC run.
        }
      }
    }
  }

  async function runBackgroundProofPoc001Host() {
    const currentWebview = getCurrentWebviewWindow();
    async function emitBackgroundProofReturnEvent<T>(
      eventName: string,
      payload: T
    ): Promise<void> {
      const relayed = await invoke<boolean>('production_relay_event', {
        eventName,
        payload
      });
      if (relayed) return;
      await emitBackgroundProofReturnEvent(eventName, payload);
    }

    const events = backgroundProofPoc001EventNames(backgroundProofPocJobId);
    const outputs: string[] = [];
    let lastStep: BackgroundProofPoc001LifecycleStep | null = null;

    const emitLifecycle = async (
      step: BackgroundProofPoc001LifecycleStep,
      payload: Partial<BackgroundProofPoc001LifecycleEvent> = {}
    ) => {
      lastStep = step;
      const event: BackgroundProofPoc001LifecycleEvent = {
        jobId: backgroundProofPocJobId,
        step,
        source: 'hidden-host',
        component: 'hidden-host',
        timestampMs: Date.now(),
        ...payload
      };
      console.info('[Background Proof PoC 001]', event);
      await emitBackgroundProofReturnEvent(events.lifecycle, event);
    };

    try {
      await emitLifecycle('HOST_JS_BOOTSTRAP_START', {
        operation: 'module-loaded',
        detail: `label=${currentWebview.label}`
      });
      await emitLifecycle('HOST_LOCATION_CAPTURED', {
        operation: 'window.location',
        detail: [
          `href=${backgroundProofPoc001SafeTraceValue(window.location.href)}`,
          `pathname=${backgroundProofPoc001SafeTraceValue(window.location.pathname)}`,
          `search=${backgroundProofPoc001SafeTraceValue(window.location.search)}`
        ].join(' ')
      });
      await emitLifecycle('HOST_MODE_PARSED', {
        operation: 'url-params',
        detail: [
          `nlsBackgroundProofPoc=001`,
          `mode=${backgroundProofPocMode}`,
          `projectPath=${backgroundProofPoc001SafeTraceValue(backgroundProofPocProjectPath)}`,
          `outputDir=${backgroundProofPoc001SafeTraceValue(backgroundProofPocOutputDir)}`,
          `finalOutputPath=${backgroundProofPocFinalOutputPath ? 'present' : 'missing'}`,
          `backgroundStandardPath=${backgroundProofPocMode === 'document-pdfa2b' && backgroundProofPocFinalOutputPath ? 'derived' : 'missing'}`,
          `jobId=${backgroundProofPoc001SafeTraceValue(backgroundProofPocJobId)}`,
          `returnTo=${backgroundProofPoc001SafeTraceValue(backgroundProofPocReturnTo)}`
        ].join(' ')
      });
      await emitLifecycle('HOST_RENDER_ENVIRONMENT', {
        operation: 'hidden-host-viewport',
        detail: backgroundProofPoc001ViewportTraceDetail(currentWebview.label)
      });
      if (!backgroundProofPoc001HostRequestIsComplete(backgroundProofPocHostParams)) {
        throw new Error('BACKGROUND_PROOF_POC_001_INVALID_HOST_REQUEST: Hidden Host wurde ohne vollständige PoC-Parameter gestartet.');
      }
      await emitLifecycle('HOST_SVELTE_MOUNT_START', {
        operation: 'onMount'
      });
      await emitLifecycle('HOST_SVELTE_MOUNTED', {
        operation: 'onMount',
        detail: `app=${document.getElementById('app') ? 'present' : 'missing'}`
      });
      await emitLifecycle('HOST_LOAD_STARTED', {
        operation: 'bootstrap',
        detail: `returnTo=${backgroundProofPocReturnTo}`
      });
      await emitLifecycle('HOST_LOAD_FINISHED', {
        operation: 'bootstrap-handshake'
      });
      await waitForStudioDomCommit({
        allowHiddenHostFallback: true,
        onTrace: (step, detail) => emitLifecycle(step, {
          operation: 'hidden-host-dom-commit',
          detail
        })
      });
      await emitLifecycle('HOST_DOM_READY');
      await emitLifecycle('PROJECT_LOAD_START', {
        operation: 'load_nls_project',
        detail: backgroundProofPoc001SafeTraceValue(backgroundProofPocProjectPath)
      });
      await openTravelPath(backgroundProofPocProjectPath);
      if (!project) {
        throw new Error('BACKGROUND_PROOF_POC_001_LOAD_FAILED: Hidden Host konnte das gespeicherte Travelbook nicht laden.');
      }
      await emitLifecycle('PROJECT_LOADED', {
        operation: 'load_nls_project',
        detail: `pages=${project.pageManifest.length} world=${project.editorialWorldId ?? 'none'} path=${backgroundProofPoc001SafeTraceValue(project.projectPath ?? backgroundProofPocProjectPath)}`
      });

      if (backgroundProofPocMode === 'document-pdfa2b') {
        if (!backgroundProofPocFinalOutputPath) {
          throw new Error('BACKGROUND_PROOF_POC_001_INVALID_OUTPUT: Hidden Host wurde ohne finalen PDF-Zielpfad gestartet.');
        }

        let stagingPath = '';
        try {
          await emitLifecycle('DOCUMENT_BACKGROUND_START', {
            operation: 'background-document',
            detail: `final=${backgroundProofPoc001SafeTraceValue(backgroundProofPocFinalOutputPath)}`
          });
          const pages = studioDocumentProofPages(project);
          if (pages.length === 0) {
            throw new Error('PDF_DOCUMENT_PROOF_NO_PAGES: Dieses Travelbook hat noch keine Seiten.');
          }
          await emitLifecycle('PAGE_COUNT_RESOLVED', {
            operation: 'canonical-publication-order',
            detail: `pages=${pages.length} order=${pages.map((page) => page.id).join(',')}`
          });

          const staging = await prepareStudioDocumentPdfProof({ pageCount: pages.length });
          stagingPath = staging.stagingPath;
          const stagedPages: StudioDocumentProofPage[] = [];

          for (const [position, page] of pages.entries()) {
            const index = position + 1;
            const title = displayPageTitle(page);
            const stagedPath = stagedDocumentProofPagePath(stagingPath, index);

            await emitLifecycle('PAGE_ITERATION_START', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'background-document-loop',
              detail: `index=${index}/${pages.length} type=${page.type} role=${page.role ?? 'none'} title=${title}`
            });
            selectPageNow(page);
            await emitLifecycle('PAGE_SELECTED', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'background-document-loop',
              detail: `index=${index}/${pages.length}`
            });
            await waitForResolvedStudioPage(page.id, {
              code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
              pageTitle: title,
              allowHiddenHostFallback: true,
              onTrace: (step, detail) => emitLifecycle(step, {
                pageId: page.id,
                referenceTitle: title,
                operation: 'background-document-readiness',
                detail: [`index=${index}/${pages.length}`, detail].filter(Boolean).join(' ')
              })
            });
            await emitLifecycle('PAGE_READY', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'background-document-readiness',
              detail: `index=${index}/${pages.length}`
            });
            await emitLifecycle('PAGE_ASSET_EVIDENCE', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'background-document-assets',
              detail: [`index=${index}/${pages.length}`, backgroundProofPoc001AssetTraceDetail()].join(' ')
            });
            await emitBackgroundProofReturnEvent(events.progress, {
              referenceTitle: title,
              pageId: page.id
            });

            document.body.classList.add('pdf-proof-rendering');
            await waitForResolvedStudioPage(page.id, {
              code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
              pageTitle: title,
              expectProofMode: true,
              allowHiddenHostFallback: true,
              onTrace: (step, detail) => emitLifecycle(step, {
                pageId: page.id,
                referenceTitle: title,
                operation: 'background-document-proof-readiness',
                detail: [`index=${index}/${pages.length}`, detail].filter(Boolean).join(' ')
              })
            });
            await emitLifecycle('PAGE_PROOF_START', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'createStudioPdfProof',
              detail: `index=${index}/${pages.length} staged=${backgroundProofPoc001SafeTraceValue(stagedPath)}`
            });
            await createStudioPdfProof({
              pageId: page.id,
              physicalMedium: 'A5',
              outputPath: stagedPath
            });
            await emitLifecycle('PAGE_PROOF_COMPLETE', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'createStudioPdfProof',
              detail: `index=${index}/${pages.length}`
            });
            const evidence = await invoke<BackgroundProofPoc001OutputEvidence>('background_proof_poc_output_file_evidence', {
              path: stagedPath
            });
            if (!evidence.exists || evidence.byteLength <= 0) {
              throw new Error(`BACKGROUND_PROOF_POC_001_OUTPUT_FILE_MISSING: ${title}`);
            }
            stagedPages.push({
              index,
              pageId: page.id,
              title,
              stagedPath
            });
            await emitLifecycle('PAGE_STAGED', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'staged-page',
              detail: `index=${index}/${pages.length} bytes=${evidence.byteLength}`
            });
            document.body.classList.remove('pdf-proof-rendering');
            await waitForStudioDomCommit({
              allowHiddenHostFallback: true,
              domCommitStartStep: 'POST_PROOF_TICK_START',
              domCommitCompleteStep: 'POST_PROOF_TICK_COMPLETE',
              layoutFrameStartStep: 'POST_PROOF_LAYOUT_FRAME_START',
              layoutFrameCompleteStep: 'POST_PROOF_LAYOUT_FRAME_COMPLETE',
              layoutFrameFallbackStep: 'POST_PROOF_LAYOUT_FRAME_FALLBACK',
              onTrace: (step, detail) => emitLifecycle(step, {
                pageId: page.id,
                referenceTitle: title,
                operation: 'background-document-post-proof',
                detail: [`index=${index}/${pages.length}`, detail].filter(Boolean).join(' ')
              })
            });
            await emitLifecycle('PAGE_ITERATION_COMPLETE', {
              pageId: page.id,
              referenceTitle: title,
              operation: 'background-document-loop',
              detail: `index=${index}/${pages.length}`
            });
          }

          const standardOutputPath = backgroundProofPoc001BackgroundStandardOutputPath(backgroundProofPocFinalOutputPath);
          await emitLifecycle('DOCUMENT_ASSEMBLY_START', {
            operation: 'assembleStudioDocumentPdfProof',
            detail: `pages=${stagedPages.length} output=${backgroundProofPoc001SafeTraceValue(standardOutputPath)}`
          });
          await assembleStudioDocumentPdfProof({
            outputPath: standardOutputPath,
            stagingPath,
            pages: stagedPages
          });
          await emitLifecycle('DOCUMENT_ASSEMBLY_COMPLETE', {
            operation: 'assembleStudioDocumentPdfProof',
            detail: `pages=${stagedPages.length}`
          });
          const standardEvidence = await invoke<BackgroundProofPoc001OutputEvidence>('background_proof_poc_output_file_evidence', {
            path: standardOutputPath
          });
          if (!standardEvidence.exists || standardEvidence.byteLength <= 0) {
            throw new Error('BACKGROUND_PROOF_POC_001_STANDARD_DOCUMENT_MISSING: Background Standard PDF wurde nicht erzeugt.');
          }
          await emitLifecycle('STANDARD_DOCUMENT_READY', {
            operation: 'output-file-evidence',
            detail: `bytes=${standardEvidence.byteLength} path=${backgroundProofPoc001SafeTraceValue(standardOutputPath)}`
          });

          await emitLifecycle('PDFA_POSTPROCESS_START', {
            operation: 'exportStudioPdfA2b',
            detail: `source=${backgroundProofPoc001SafeTraceValue(standardOutputPath)} final=${backgroundProofPoc001SafeTraceValue(backgroundProofPocFinalOutputPath)}`
          });
          await exportStudioPdfA2b({
            sourcePath: standardOutputPath,
            outputPath: backgroundProofPocFinalOutputPath
          });
          await emitLifecycle('PDFA_POSTPROCESS_COMPLETE', {
            operation: 'exportStudioPdfA2b',
            detail: `profile=PDF/A-2b`
          });
          const finalEvidence = await invoke<BackgroundProofPoc001OutputEvidence>('background_proof_poc_output_file_evidence', {
            path: backgroundProofPocFinalOutputPath
          });
          if (!finalEvidence.exists || finalEvidence.byteLength <= 0) {
            throw new Error('BACKGROUND_PROOF_POC_001_FINAL_OUTPUT_MISSING: Finale PDF-Datei wurde nicht erzeugt.');
          }
          await emitLifecycle('FINAL_OUTPUT_READY', {
            operation: 'output-file-evidence',
            detail: `pages=${stagedPages.length} bytes=${finalEvidence.byteLength} path=${backgroundProofPoc001SafeTraceValue(backgroundProofPocFinalOutputPath)}`
          });
          await emitLifecycle('HOST_RESULT_EMIT', {
            detail: 'success'
          });
          await emitBackgroundProofReturnEvent(events.result, {
            ok: true,
            outputs: [backgroundProofPocFinalOutputPath],
            standardOutputPath,
            finalOutputPath: backgroundProofPocFinalOutputPath,
            pageCount: stagedPages.length,
            lastStep
          });
          return;
        } finally {
          document.body.classList.remove('pdf-proof-rendering');
          if (stagingPath) {
            try {
              await cleanupStudioDocumentPdfProof(stagingPath);
            } catch {
              // Staging cleanup is best-effort after the background result has been reported.
            }
          }
        }
      }

      await emitLifecycle('REFERENCE_DISCOVERY_START', {
        operation: 'reference-pages'
      });
      const references = backgroundProofPoc001ReferencePages(project);
      if (references.length !== 3) {
        throw new Error(`BACKGROUND_PROOF_POC_001_REFERENCE_PAGES_MISSING: Erwartet wurden Destination, Photography Workshop und Notes / Memory; gefunden wurden ${references.length}.`);
      }
      await emitLifecycle('REFERENCE_DISCOVERY_COMPLETE', {
        operation: 'reference-pages',
        detail: references.map((reference) => [
          reference.title,
          reference.page.id,
          reference.page.type,
          reference.page.role ?? 'none'
        ].join(':')).join(' | ')
      });
      await emitLifecycle('HOST_READY', {
        detail: references.map((reference) => reference.title).join(', ')
      });

      for (const [referenceIndex, reference] of references.entries()) {
        const iteration = referenceIndex + 1;
        const nextIteration = iteration + 1;
        const page = project.pageManifest.find((entry) => entry.id === reference.page.id);
        if (!page) {
          throw new Error(`BACKGROUND_PROOF_POC_001_REFERENCE_PAGE_MISSING: ${reference.title}`);
        }

        await emitLifecycle('REFERENCE_PAGE_SELECT_START', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'reference-loop',
          detail: `index=${iteration}/3 role=${reference.referenceId} type=${page.type} role=${page.role ?? 'none'} title=${reference.title}`
        });
        selectPageNow(page);
        await emitLifecycle('REFERENCE_PAGE_SELECTED', {
          pageId: page.id,
          referenceTitle: reference.title
        });
        await emitLifecycle('REFERENCE_PAGE_READINESS_START', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'resolved-page-readiness'
        });
        await waitForResolvedStudioPage(page.id, {
          code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
          pageTitle: reference.title,
          allowHiddenHostFallback: true,
          onTrace: (step, detail) => emitLifecycle(step, {
            pageId: page.id,
            referenceTitle: reference.title,
            operation: 'resolved-page-readiness',
            detail
          })
        });
        await emitLifecycle('REFERENCE_PAGE_READY', {
          pageId: page.id,
          referenceTitle: reference.title
        });
        await emitLifecycle('PAGE_ASSET_EVIDENCE', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'reference-page-assets',
          detail: backgroundProofPoc001AssetTraceDetail()
        });
        await emitBackgroundProofReturnEvent(events.progress, {
          referenceTitle: reference.title,
          pageId: page.id
        });

        await emitLifecycle('PROOF_MODE_ENTER', {
          pageId: page.id,
          referenceTitle: reference.title
        });
        document.body.classList.add('pdf-proof-rendering');
        await emitLifecycle('REFERENCE_PAGE_READINESS_START', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'proof-mode-readiness'
        });
        await waitForResolvedStudioPage(page.id, {
          code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
          pageTitle: reference.title,
          expectProofMode: true,
          allowHiddenHostFallback: true,
          onTrace: (step, detail) => emitLifecycle(step, {
            pageId: page.id,
            referenceTitle: reference.title,
            operation: 'proof-mode-readiness',
            detail
          })
        });
        await emitLifecycle('PROOF_MODE_READY', {
          pageId: page.id,
          referenceTitle: reference.title
        });

        const outputPath = backgroundProofPoc001OutputPath(backgroundProofPocOutputDir, reference.title);
        await emitLifecycle('PDF_INVOKE_START', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'createStudioPdfProof',
          detail: backgroundProofPoc001SafeTraceValue(outputPath)
        });
        await createStudioPdfProof({
          pageId: page.id,
          physicalMedium: 'A5',
          outputPath
        });
        await emitLifecycle('PDF_INVOKE_SUCCESS', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'createStudioPdfProof',
          detail: backgroundProofPoc001SafeTraceValue(outputPath)
        });
        const evidence = await invoke<BackgroundProofPoc001OutputEvidence>('background_proof_poc_output_file_evidence', {
          path: outputPath
        });
        if (!evidence.exists || evidence.byteLength <= 0) {
          throw new Error(`BACKGROUND_PROOF_POC_001_OUTPUT_FILE_MISSING: ${reference.title}`);
        }
        await emitLifecycle('OUTPUT_FILE_CONFIRMED', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'output-file-evidence',
          detail: `index=${iteration}/3 bytes=${evidence.byteLength} path=${backgroundProofPoc001SafeTraceValue(outputPath)}`
        });
        outputs.push(outputPath);
        await emitLifecycle('PROOF_MODE_EXIT_START', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'post-proof',
          detail: `index=${iteration}/3`
        });
        document.body.classList.remove('pdf-proof-rendering');
        await emitLifecycle('PROOF_MODE_CLASS_REMOVED', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'post-proof',
          detail: `index=${iteration}/3`
        });
        await emitLifecycle('PROOF_MODE_EXIT', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'post-proof',
          detail: `index=${iteration}/3`
        });
        await waitForStudioDomCommit({
          allowHiddenHostFallback: true,
          domCommitStartStep: 'POST_PROOF_TICK_START',
          domCommitCompleteStep: 'POST_PROOF_TICK_COMPLETE',
          layoutFrameStartStep: 'POST_PROOF_LAYOUT_FRAME_START',
          layoutFrameCompleteStep: 'POST_PROOF_LAYOUT_FRAME_COMPLETE',
          layoutFrameFallbackStep: 'POST_PROOF_LAYOUT_FRAME_FALLBACK',
          onTrace: (step, detail) => emitLifecycle(step, {
            pageId: page.id,
            referenceTitle: reference.title,
            operation: 'post-proof-dom-commit',
            detail: [`index=${iteration}/3`, detail].filter(Boolean).join(' ')
          })
        });
        await emitLifecycle('POST_PROOF_STATE_STABLE', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'post-proof-dom-commit',
          detail: `index=${iteration}/3`
        });
        await emitLifecycle('REFERENCE_ITERATION_COMPLETE', {
          pageId: page.id,
          referenceTitle: reference.title,
          operation: 'reference-loop',
          detail: `index=${iteration}/3 output=${backgroundProofPoc001SafeTraceValue(outputPath)}`
        });
        if (reference !== references[references.length - 1]) {
          await emitLifecycle('NEXT_REFERENCE_PAGE', {
            pageId: page.id,
            referenceTitle: reference.title,
            operation: 'reference-loop',
            detail: `completed=${iteration}/3 next=${nextIteration}/3`
          });
        }
      }

      await emitLifecycle('HOST_RESULT_EMIT', {
        detail: 'success'
      });
      await emitBackgroundProofReturnEvent(events.result, { ok: true, outputs, lastStep });
    } catch (error) {
      try {
        await emitLifecycle('HOST_RESULT_EMIT', {
          detail: String(error)
        });
        await emitBackgroundProofReturnEvent(events.result, {
          ok: false,
          error: String(error),
          lastStep
        });
      } catch (emitError) {
        console.error('[Background Proof PoC 001] result emit failed', emitError);
      }
    } finally {
      document.body.classList.remove('pdf-proof-rendering');
    }
  }

  interface ProductionJobBootstrap {
    jobId: string;
    projectPath: string;
    outputDir: string;
    viewportWidth: number;
    viewportHeight: number;
  }

  type ProductionHostEvent =
    | { schemaVersion: '1.0'; event: 'host-started' | 'host-ready' | 'complete'; jobId: string }
    | { schemaVersion: '1.0'; event: 'page-started'; jobId: string; index: number; total: number }
    | { schemaVersion: '1.0'; event: 'page-rendered'; jobId: string; index: number; total: number; path: string }
    | { schemaVersion: '1.0'; event: 'error'; jobId: string; code: string; message: string; pageId?: string | null };

  function productionLifecycleIndex(detail: string | undefined): number | null {
    const match = detail?.match(/\bindex=(\d+)\/3\b/);
    if (!match) return null;
    const index = Number(match[1]);
    return Number.isInteger(index) && index >= 1 && index <= 3 ? index : null;
  }

  function productionErrorCode(error: unknown): string {
    const message = String(error).replace(/^Error:\s*/, '');
    const match = message.match(/^([A-Z0-9_]+):/);
    return match?.[1] ?? 'STUDIO_PRODUCTION_HOST_FAILED';
  }

  async function writeProductionHostEvent(event: ProductionHostEvent): Promise<void> {
    await invoke('production_host_event', { event });
  }

  async function productionDiagnosticTrace(step: string, detail = ''): Promise<void> {
    try {
      await invoke('production_diagnostic_trace', {
        step,
        detail: detail || null
      });
    } catch {
      // Diagnostics must never influence the production flow.
    }
  }

  async function runProductionJobController(job: ProductionJobBootstrap): Promise<void> {
    const currentWebview = getCurrentWebviewWindow();
    await productionDiagnosticTrace('controller-start', `label=${currentWebview.label}`);
    const events = backgroundProofPoc001EventNames(job.jobId);
    const total = 3;
    let hiddenHost: WebviewWindow | null = null;
    let productionCover: WebviewWindow | null = null;
    let finished = false;
    let hostReadyReported = false;
    let eventQueue = Promise.resolve();
    const unlisteners: Array<() => void> = [];

    const queueEvent = (event: ProductionHostEvent): Promise<void> => {
      eventQueue = eventQueue.then(() => writeProductionHostEvent(event));
      return eventQueue;
    };

    const cleanup = async () => {
      for (const unlisten of unlisteners.splice(0)) unlisten();
      if (productionCover) {
        try {
          await productionCover.close();
        } catch {
          // The production cover may already be gone after a lifecycle failure.
        }
      }
      if (hiddenHost) {
        try {
          await hiddenHost.close();
        } catch {
          // The production Hidden Host may already have closed.
        }
        hiddenHost = null;
      }
    };

    const finish = async (exitCode: number) => {
      await eventQueue;
      await cleanup();
      await invoke('finish_production_job', { exitCode });
    };

    const fail = async (error: unknown, pageId: string | null = null) => {
      if (finished) return;
      finished = true;
      const message = String(error).replace(/^Error:\s*/, '');
      await queueEvent({
        schemaVersion: '1.0',
        event: 'error',
        jobId: job.jobId,
        code: productionErrorCode(error),
        message,
        pageId
      });
      await finish(1);
    };

    try {
      await queueEvent({
        schemaVersion: '1.0',
        event: 'host-started',
        jobId: job.jobId
      });

      await productionDiagnosticTrace('controller-register-lifecycle-listener');
      const unlistenLifecycle = await listen<BackgroundProofPoc001LifecycleEvent>(
        events.lifecycle,
        (event) => {
          const lifecycle = event.payload;
          if (lifecycle.jobId !== job.jobId || finished) return;

          if (lifecycle.step === 'HOST_READY' && !hostReadyReported) {
            hostReadyReported = true;
            void queueEvent({
              schemaVersion: '1.0',
              event: 'host-ready',
              jobId: job.jobId
            });
            return;
          }

          if (lifecycle.step === 'REFERENCE_PAGE_SELECT_START') {
            const index = productionLifecycleIndex(lifecycle.detail);
            if (index !== null) {
              void queueEvent({
                schemaVersion: '1.0',
                event: 'page-started',
                jobId: job.jobId,
                index,
                total
              });
              if (productionCover) {
                void invoke('production_cover_progress_direct', {
                  coverLabel: productionCover.label,
                  currentPage: index,
                  pageCount: total
                });
              }
            }
            return;
          }

          if (lifecycle.step === 'OUTPUT_FILE_CONFIRMED') {
            const index = productionLifecycleIndex(lifecycle.detail);
            if (index !== null && lifecycle.referenceTitle) {
              void queueEvent({
                schemaVersion: '1.0',
                event: 'page-rendered',
                jobId: job.jobId,
                index,
                total,
                path: backgroundProofPoc001OutputPath(job.outputDir, lifecycle.referenceTitle)
              });
            }
          }
        }
      );
      unlisteners.push(unlistenLifecycle);
      await productionDiagnosticTrace('controller-lifecycle-listener-ready');

      await productionDiagnosticTrace('controller-register-result-listener');
      const unlistenResult = await listen<BackgroundProofPoc001Result>(
        events.result,
        (event) => {
          void (async () => {
            if (finished) return;
            const result = event.payload;
            if (!result.ok) {
              await fail(result.error ?? 'STUDIO_PRODUCTION_HOST_FAILED: Hidden Host meldete keinen Erfolg.');
              return;
            }
            finished = true;
            await eventQueue;
            await queueEvent({
              schemaVersion: '1.0',
              event: 'complete',
              jobId: job.jobId
            });
            await finish(0);
          })();
        }
      );
      unlisteners.push(unlistenResult);
      await productionDiagnosticTrace('controller-result-listener-ready');

      const hostUrl = backgroundProofPoc001BuildHostUrl(window.location.href, {
        projectPath: job.projectPath,
        outputDir: job.outputDir,
        finalOutputPath: '',
        jobId: job.jobId,
        returnTo: currentWebview.label,
        mode: 'reference-pages'
      });

      await productionDiagnosticTrace(
        'hidden-window-create-request',
        `viewport=${job.viewportWidth}x${job.viewportHeight} returnTo=${currentWebview.label}`
      );
      hiddenHost = new WebviewWindow(`production-proof-${job.jobId}`, {
        url: hostUrl,
        title: 'Northern Lines Studio Production Host',
        width: job.viewportWidth,
        height: job.viewportHeight,
        x: 40,
        y: 40,
        resizable: false,
        decorations: false,
        visible: true,
        focus: false,
        skipTaskbar: true,
        backgroundThrottling: backgroundProofPocNoThrottling
      });

      await productionDiagnosticTrace('hidden-window-await-created');
      await new Promise<void>((resolve, reject) => {
        void hiddenHost?.once('tauri://created', () => {
          void productionDiagnosticTrace('hidden-window-created');
          resolve();
        });
        void hiddenHost?.once<string>('tauri://error', (event) => {
          void productionDiagnosticTrace('hidden-window-error', String(event.payload));
          reject(new Error(String(event.payload)));
        });
      });
      const productionCoverUrl = mainRendererExportCoverBuildUrl(window.location.href, {
        jobId: job.jobId,
        pageCount: 3
      });
      productionCover = new WebviewWindow(`production-cover-${job.jobId}`, {
        url: productionCoverUrl,
        title: 'Northern Lines Studio · Travelbook Export',
        width: job.viewportWidth,
        height: job.viewportHeight,
        x: 40,
        y: 40,
        resizable: false,
        decorations: false,
        visible: true,
        focus: true,
        skipTaskbar: true,
        backgroundThrottling: backgroundProofPocNoThrottling
      });
      await new Promise<void>((resolve, reject) => {
        void productionCover?.once('tauri://created', () => resolve());
        void productionCover?.once<string>('tauri://error', (event) => reject(new Error(String(event.payload))));
      });
      if (!hiddenHost || !productionCover) {
        throw new Error('PRODUCTION_NATIVE_STACK_FAILED: Production windows are incomplete.');
      }
      await invoke('attach_production_cover_native', {
        renderLabel: hiddenHost.label,
        coverLabel: productionCover.label
      });
      await productionDiagnosticTrace(
        'production-native-window-stack-attached',
        `render=${hiddenHost.label} cover=${productionCover.label}`
      );
      await invoke('production_cover_progress_direct', {
        coverLabel: productionCover.label,
        currentPage: 0,
        pageCount: total
      });

      await productionDiagnosticTrace('production-cover-ready-host-first');

    } catch (error) {
      await fail(error);
    }
  }

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


  async function addDestinationInterest(kind: DestinationInterestKind) {
    if (!project || !journeyStage || destinationDirty) return;
    isLoading = true;
    errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const updated = await invoke<StudioProject>('add_destination_interest', { path: projectPath, stageId: journeyStage.id, kind });
      project = { ...updated, projectPath };
      const created = project.pageManifest.find((page) => page.type === 'destination_interest' && page.journeyStage === journeyStage?.id && page.destinationInterestKind === kind) ?? null;
      if (created) selectPageNow(created);
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
  }

  async function removeSelectedDestinationInterest() {
    if (!project || selectedPage?.type !== 'destination_interest') return;
    const stageId = selectedPage.journeyStage;
    isLoading = true;
    errorMessage = '';
    try {
      const projectPath = project.projectPath;
      const updated = await invoke<StudioProject>('remove_destination_interest', { path: projectPath, pageId: selectedPage.id });
      project = { ...updated, projectPath };
      const destinationPage = project.pageManifest.find((page) => page.type === 'destination' && page.journeyStage === stageId) ?? project.pageManifest[0] ?? null;
      if (destinationPage) selectPageNow(destinationPage);
    } catch (error) {
      errorMessage = String(error);
    } finally {
      isLoading = false;
    }
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

  async function changeEditorialWorld(nextWorldId: string) {
    if (!project || project.editorialWorldId === nextWorldId) return;
    if (hasUnsavedChanges) {
      errorMessage = 'Sichere zuerst deine offenen Änderungen, bevor du die Reisewelt wechselst.';
      return;
    }
    worldChangeState = 'saving';
    errorMessage = '';
    try {
      requireEditorialWorld(nextWorldId);
      const projectPath = project.projectPath;
      const selectedPageId = selectedPage?.id ?? null;
      const updated = await invoke<StudioProject>('update_editorial_world', {
        path: projectPath,
        editorialWorldId: nextWorldId
      });
      project = { ...updated, projectPath };
      if (selectedPageId) selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? selectedPage;
      syncPlanningDraft();
      if (selectedPage?.type === 'destination') syncDestinationDraft();
      worldChangeState = 'saved';
    } catch (error) {
      errorMessage = String(error);
      worldChangeState = 'error';
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
    cancelInterestEntry();
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

  function destinationInterestIntroduction(kind: string | undefined, place: string): string {
    switch (kind) {
      case 'photography':
        return `Motive, Licht und Fotospots für deinen Blick auf ${place}.`;
      case 'hiking_nature':
        return `Routen, Naturziele und praktische Orientierung für deine Zeit draußen in ${place}.`;
      case 'culture_history':
        return `Orte und Geschichten, die ${place} bis heute prägen.`;
      case 'culinary_local':
        return `Aromen, Märkte und lokale Besonderheiten, die ${place} ihren eigenen Geschmack geben.`;
      default:
        return `Eine persönliche Vertiefung für deine Zeit in ${place}.`;
    }
  }

  function editStoryComponent(componentId: EditorialComponentId) {
    if (activeAuthoringComponent === componentId) return;
    if (interestEntryDraft && !interestEntryDirty) cancelInterestEntry();
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

  function closeAuthoringPanel() {
    if (authoringDirty) return;
    activeAuthoringComponent = null;
    authoringDraft = '';
    authoringStatus = 'empty';
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

  function interestEntrySignature(entry: DestinationInterestEntry | null): string {
    return entry ? JSON.stringify(entry) : '';
  }

  function beginInterestEntry(entry?: DestinationInterestEntry) {
    if (!selectedPage?.destinationInterestKind || !selectedInterestEntrySchema) return;
    if (authoringDirty || destinationDirty || interestEntryDirty) return;
    const next = entry
      ? { ...entry, fields: { ...entry.fields } }
      : emptyInterestEntry(selectedPage.destinationInterestKind, `${selectedPage.id}-${selectedInterestEntrySchema.entryKind}-${Date.now()}`);
    activeAuthoringComponent = null;
    authoringDraft = '';
    authoringStatus = 'empty';
    interestEntryDraft = next;
    interestEntryOriginalSignature = entry ? interestEntrySignature(next) : '';
    interestEntrySaveState = 'idle';
  }

  function cancelInterestEntry() {
    interestEntryDraft = null;
    interestEntryOriginalSignature = '';
    interestEntrySaveState = 'idle';
  }

  function updateInterestEntryTitle(event: Event) {
    if (!interestEntryDraft) return;
    interestEntryDraft = { ...interestEntryDraft, title: (event.currentTarget as HTMLInputElement).value };
  }

  function updateInterestEntryField(fieldId: string, event: Event) {
    if (!interestEntryDraft) return;
    interestEntryDraft = {
      ...interestEntryDraft,
      fields: { ...interestEntryDraft.fields, [fieldId]: (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value }
    };
  }

  async function saveInterestEntry(): Promise<boolean> {
    if (!project || !selectedPage || !interestEntryDraft || !selectedInterestEntrySchema) return false;
    if (!interestEntryDraft.title.trim()) {
      errorMessage = `${selectedInterestEntrySchema.singularLabel} braucht einen Namen.`;
      return false;
    }
    interestEntrySaveState = 'saving';
    const draft = interestEntryDraft;
    try {
      const selectedPageId = selectedPage.id;
      const entries = selectedInterestEntries.some((entry) => entry.id === draft.id)
        ? selectedInterestEntries.map((entry) => entry.id === draft.id ? draft : entry)
        : [...selectedInterestEntries, draft];
      const projectPath = project.projectPath;
      const savedProject = await invoke<StudioProject>('save_interest_entries', {
        path: projectPath,
        pageId: selectedPageId,
        entries
      });
      project = { ...savedProject, projectPath };
      selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? null;
      interestEntrySaveState = 'saved';
      cancelInterestEntry();
      return true;
    } catch (error) {
      errorMessage = String(error);
      interestEntrySaveState = 'error';
      return false;
    }
  }

  async function removeInterestEntry(entryId: string) {
    if (!project || !selectedPage || interestEntryDirty) return;
    try {
      const selectedPageId = selectedPage.id;
      const projectPath = project.projectPath;
      const entries = selectedInterestEntries.filter((entry) => entry.id !== entryId);
      const savedProject = await invoke<StudioProject>('save_interest_entries', { path: projectPath, pageId: selectedPageId, entries });
      project = { ...savedProject, projectPath };
      selectedPage = project.pageManifest.find((page) => page.id === selectedPageId) ?? null;
    } catch (error) {
      errorMessage = String(error);
    }
  }

  function discardActiveUnsavedChanges() {
    if (interestEntryDirty) cancelInterestEntry();
    if (destinationDirty) syncDestinationDraft();
    if (authoringDirty && activeAuthoring) {
      authoringDraft = activeAuthoring.content;
      authoringStatus = activeAuthoring.status;
      authoringSaveState = 'idle';
    }
  }

  async function saveActiveUnsavedChanges(): Promise<boolean> {
    if (interestEntryDirty) {
      const saved = await saveInterestEntry();
      if (!saved) return false;
    }
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
    if (isBackgroundProofPocHost || isMainRendererExportCoverHost) return;

    inspectorPreferredWidth = parseStoredInspectorWidth(window.localStorage.getItem(INSPECTOR_WIDTH_STORAGE_KEY), window.innerWidth);
    inspectorWidth = inspectorPreferredWidth;
    const resize = () => {
      inspectorWidth = clampInspectorWidth(inspectorPreferredWidth, window.innerWidth);
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

  onMount(() => {
    if (isBackgroundProofPocHost || isMainRendererExportCoverHost) return;

    if (!previewStage) return;
    const observer = new ResizeObserver(updatePreviewScale);
    observer.observe(previewStage);
    updatePreviewScale();
    return () => observer.disconnect();
  });

  onMount(() => {
    if (isMainRendererExportCoverHost) {
      let unlistenProgress: (() => void) | undefined;
      let disposed = false;

      const applyCoverProgress = (progress: MainRendererExportCoverProgress) => {
        if (
          !disposed &&
          progress &&
          Number.isFinite(progress.currentPage) &&
          Number.isFinite(progress.pageCount)
        ) {
          mainRendererExportCoverProgress = progress;
        }
      };

      const handleProductionCoverProgress = (event: Event) => {
        applyCoverProgress((event as CustomEvent<MainRendererExportCoverProgress>).detail);
      };

      window.addEventListener('nls-production-cover-progress', handleProductionCoverProgress);

      void (async () => {
        unlistenProgress = await listen<MainRendererExportCoverProgress>(
          mainRendererExportCoverEventName(mainRendererExportCoverJobId),
          (event) => applyCoverProgress(event.payload)
        );
      })();

      return () => {
        disposed = true;
        unlistenProgress?.();
        window.removeEventListener('nls-production-cover-progress', handleProductionCoverProgress);
      };
    }

    if (isBackgroundProofPocHost) {
      void runBackgroundProofPoc001Host();
      return;
    }

    let unlistenOpen: (() => void) | undefined;
    let disposed = false;

    void (async () => {
      const productionJob = await invoke<ProductionJobBootstrap | null>('production_job_bootstrap');
      if (disposed) return;
      if (productionJob) {
        await runProductionJobController(productionJob);
        return;
      }

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
  $: activeCompanionLayout = editorialWorld?.id === 'baltic' ? balticCompanionLayout : fjordCompanionLayout;
  $: companionVisible = Boolean(editorialWorld)
    && companionVisibleForRole(activeCompanionLayout, selectedPage?.role);
  $: statusText = projectStatus(project);
  $: planningDuration = project ? journeyDurationLabel(project.journey.startDate, project.journey.endDate) : 'Noch offen';
  $: journeyStage = journeyStageFor(project, selectedPage);
  $: destinationInterest = selectedPage?.type === 'destination_interest' ? destinationInterestDefinition(selectedPage.destinationInterestKind) : null;
  $: selectedInterestEntries = selectedPage?.type === 'destination_interest' ? (selectedPage.interestEntries ?? []) : [];
  $: selectedInterestEntrySchema = selectedPage?.type === 'destination_interest' ? interestEntrySchema(selectedPage.destinationInterestKind) : null;
  $: interestEntriesContentLength = selectedInterestEntries.reduce((sum, entry) => sum + interestEntryContentLength(entry), 0)
    + (selectedPage?.authoring?.introduction?.content?.trim().length ?? 0);
  $: interestHasPlaceReference = selectedInterestEntries.some((entry) => Boolean(entry.fields.placeReference?.trim()));
  $: interestLayoutState = interestPageLayoutState(
    selectedPage?.type === 'destination_interest' ? selectedPage.destinationInterestKind : undefined,
    selectedInterestEntries,
    selectedPage?.authoring?.introduction?.content?.trim().length ?? 0
  );
  $: interestComposition = interestLayoutState.composition;
  // Interest Pages alone may use exactly one bounded compact density step.
  // If that fixed step is insufficient, capacity becomes overflow instead of
  // shrinking typography or entering the Companion/Footer safe zones.
  $: interestDensity = interestLayoutState.density;
  $: interestOverflow = interestLayoutState.overflow;
  $: interestEntryDirty = interestEntryDraft !== null && JSON.stringify(interestEntryDraft) !== interestEntryOriginalSignature;
  $: structuredInterestPage = selectedPage?.type === 'destination_interest' && ['photography', 'hiking_nature', 'culture_history', 'culinary_local'].includes(selectedPage.destinationInterestKind ?? '');
  $: structuredLegacyIds = selectedPage?.destinationInterestKind === 'photography'
    ? new Set<EditorialComponentId>(['photo_spots', 'photo_light', 'photo_motifs', 'photo_guidance', 'photo_focal_lengths', 'photo_place_reference'])
    : selectedPage?.destinationInterestKind === 'hiking_nature'
      ? new Set<EditorialComponentId>(['hike_routes', 'hike_start_points', 'hike_durations', 'hike_difficulties', 'hike_highlights', 'hike_guidance', 'hike_place_reference'])
      : new Set<EditorialComponentId>();
  $: destinationInterestKinds = project && journeyStage ? destinationInterestKindsForStage(project.pageManifest, journeyStage.id) : [];
  $: selectedDestination = destinationForPage(project, selectedPage);
  $: journeyRouteCount = project?.journey?.stages.length ?? 0;
  $: journeyRoutePosition = journeyStage ? routePosition(journeyStage.id) : 0;
  $: editorialGrammar = grammarForPage(selectedPage);
  $: grammarEvaluation = evaluateGrammar(selectedPage, editorialGrammar);
  $: storyStructure = buildStoryStructure(selectedPage, editorialGrammar);
  $: storyPresent = presentStoryComponents(storyStructure);
  $: storyAvailable = availableStoryComponents(storyStructure);
  $: storyMissing = missingStoryComponents(storyStructure);
  $: visibleStoryPresent = storyPresent.filter((component) => !structuredLegacyIds.has(component.type));
  $: visibleStoryAvailable = storyAvailable.filter((component) => !structuredLegacyIds.has(component.type));
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
  $: hasUnsavedChanges = authoringDirty || destinationDirty || interestEntryDirty;
  $: unsavedDialogLabel = interestEntryDirty
    ? (selectedInterestEntrySchema?.singularLabel ?? 'Vertiefung')
    : destinationDirty
      ? (destinationName || selectedPage?.title || 'Ortsprofil')
      : (activeAuthoring?.label ?? 'Story');
  $: previewWidth = PREVIEW_BASE_WIDTH * previewScale;
  $: previewHeight = PREVIEW_BASE_HEIGHT * previewScale;
  $: selectedJourneyWorld = journeyWorlds.find((world) => world.id === newJourneyWorldId) ?? journeyWorlds[0] ?? null;
  $: selectedJourneyCompanion = loadCompanion(selectedJourneyWorld?.companionId);
  $: if (pendingAction) { void focusSaveDialog(); }
</script>

<svelte:head>
  <title>{project ? `${project.title} – Northern Lines Studio` : 'Northern Lines Studio'}</title>
</svelte:head>

{#if isMainRendererExportCoverHost}
  <main class="export-cover-shell" aria-label="Travelbook Export">
    <section class="export-cover-panel" aria-live="polite">
      <span class="export-cover-mark">NL</span>
      <div>
        <p>Travelbook wird exportiert …</p>
        <strong>
          Seite {Math.min(mainRendererExportCoverProgress.currentPage || 1, mainRendererExportCoverProgress.pageCount || 1)}
          von {mainRendererExportCoverProgress.pageCount || 1}
        </strong>
        <progress
          aria-label="Exportfortschritt"
          value={Math.min(mainRendererExportCoverProgress.currentPage || 1, mainRendererExportCoverProgress.pageCount || 1)}
          max={mainRendererExportCoverProgress.pageCount || 1}
          style="display:block;width:min(420px,60vw);margin-top:14px;"
        ></progress>
      </div>
    </section>
  </main>
{:else}
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

    <div class="toolbar-zone toolbar-zone-end toolbar-actions">
      {#if project}
        <div class="travel-menu-wrap">
          <button
            class="primary-action"
            on:click={() => {
              outputMenuOpen = !outputMenuOpen;
              projectMenuOpen = false;
            }}
            disabled={isLoading || pdfProofStatus === 'preparing' || pdfProofStatus === 'rendering' || backgroundProofPocStatus === 'running'}
            aria-expanded={outputMenuOpen}
          >
            <span>Ausgabe</span>
            <span class="menu-chevron" aria-hidden="true">⌄</span>
          </button>
          {#if outputMenuOpen}
            <div class="travel-menu" aria-label="Ausgabeaktionen">
              <button on:click={() => void createFinalTravelbookPdf()}>PDF exportieren</button>
              <button on:click={() => void createDevelopmentPdf()}>Entwicklungs-PDF</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if project}
        <div class="travel-menu-wrap">
          <button
            class="primary-action"
            on:click={() => {
              projectMenuOpen = !projectMenuOpen;
              outputMenuOpen = false;
            }}
            disabled={isLoading}
            aria-expanded={projectMenuOpen}
          >
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
        </div>
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
          <div class="world-card-copy">
            <small>Reisewelt</small>
            <strong>{editorialWorld.name}</strong>
            <span>Reisebegleiter · {editorialWorld.companionName}</span>
            <label class="world-switch">
              <span>Welt wechseln</span>
              <select
                value={project?.editorialWorldId ?? editorialWorld.id}
                disabled={worldChangeState === 'saving'}
                on:change={(event) => void changeEditorialWorld(event.currentTarget.value)}
              >
                {#each journeyWorlds as world}
                  <option value={world.id}>{world.name}</option>
                {/each}
              </select>
            </label>
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
                  class:interest-page-nav={page.type === 'destination_interest'}
                  on:click={() => requestPageSelection(page)}
                >
                  <span class="page-order">{String(visiblePageNumber(page)).padStart(2, '0')}</span>
                  <span>
                    <strong>{displayPageTitle(page)}</strong>
                    <small>{page.type === 'destination_interest' ? 'Vertiefung' : pageRoleLabel(page.role)}</small>
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
          <strong>{displayPageTitle(selectedPage)}</strong>
        </div>
        <div class="canvas-header-actions">
          <small>{editorialWorld
            ? `${editorialWorld.name} · ${selectedPage?.type === 'destination'
                ? (editorialLayout?.destinationLayouts.find((layout) => layout.id === destinationLayoutVariant)?.label ?? 'Ortsseite')
                : selectedPage?.type === 'destination_interest'
                  ? (destinationInterest?.label ?? 'Vertiefung')
                  : pageRoleLabel(selectedPage?.role)}`
            : pageRoleLabel(selectedPage?.role)}</small>
        </div>
      </div>

      <div class="preview-stage" bind:this={previewStage}>
        <div class="page-scale-frame" style={`width:${previewWidth}px;height:${previewHeight}px`}>
          {#key selectedPage?.id ?? 'empty-editorial-desk'}
            <article
              class="a5-page"
              data-studio-page-id={selectedPage?.id ?? ''}
              class:cover-page={selectedPage?.type === 'cover'}
              class:fjord-page={editorialWorld?.id === 'fjord'}
              class:baltic-page={editorialWorld?.id === 'baltic'}
              class:destination-page={selectedPage?.type === 'destination'}
              class:destination-interest-page={selectedPage?.type === 'destination_interest'}
              class:photography-interest-page={selectedPage?.type === 'destination_interest' && selectedPage.destinationInterestKind === 'photography'}
              class:hiking-nature-interest-page={selectedPage?.type === 'destination_interest' && selectedPage.destinationInterestKind === 'hiking_nature'}
              class:culture-history-interest-page={selectedPage?.type === 'destination_interest' && selectedPage.destinationInterestKind === 'culture_history'}
              class:culinary-local-interest-page={selectedPage?.type === 'destination_interest' && selectedPage.destinationInterestKind === 'culinary_local'}
              class:light-companion-page={selectedPage?.type === 'knowledge' && selectedPage.knowledgeType === 'photography_light'}
              class:weather-companion-page={selectedPage?.type === 'knowledge' && selectedPage.knowledgeType === 'travel_weather'}
              class:photography-workshop-page={selectedPage?.type === 'workflow'}
              class:contents-page={selectedPage?.type === 'contents'}
              class:notes-page={selectedPage?.type === 'notes'}
              style={`transform:scale(${previewScale});--world-paper:${editorialLayout?.paperTone ?? '#ffffff'};--world-ink:${editorialLayout?.inkTone ?? '#172a34'};--world-accent:${editorialLayout?.accentTone ?? '#547181'};--world-quiet:${editorialLayout?.quietTone ?? '#75868e'};--world-heading-family:${editorialLayout?.headingFamily ?? 'Georgia, serif'};--world-body-family:${editorialLayout?.bodyFamily ?? 'Georgia, serif'}`}
              in:fade={{ duration: studioPageFadeDurationMs(pdfProofStatus, isBackgroundProofPocHost) }}
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
              {:else if selectedPage?.type === 'destination_interest' && destinationInterest && journeyStage}
                {#if selectedPage.destinationInterestKind === 'photography'}
                  <div class="destination-interest-preview photography-place-experience" class:interest-density-tight={interestDensity === 'tight'}>
                    <div class="page-rule photography-page-rule"></div>
                    <p class="eyebrow">{destinationInterest.label}</p>
                    <div class="curated-hero-flow">
                      {#if curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind)}
                        <img class="curated-world-hero" src={curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind) ?? ''} alt="" aria-hidden="true" />
                      {/if}
                      <h1>{journeyStage.title}</h1>
                      <p class="preview-body destination-interest-introduction">{selectedPage.authoring?.introduction?.content || destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)}</p>
                    </div>

                    {#if interestOverflow}
                      <div class="destination-capacity-stop photography-capacity-stop" aria-label="Inhalt passt nicht ruhig auf diese Seite">
                        <span>Mehr Raum nötig</span>
                        <strong>Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.</strong>
                        <small>Studio verkleinert nicht weiter. Kürze einen Eintrag oder verteile die Vertiefung später auf eine weitere Seite. Companion und Footer bleiben geschützt.</small>
                      </div>
                    {:else}
                      <section class="interest-entry-section photography-spots" aria-label="Fotospots">
                        <span class="photography-section-label">Fotospots</span>
                        <div class={`interest-entry-grid interest-entry-${interestComposition}`}>
                          {#if selectedInterestEntries.length}
                            {#each selectedInterestEntries as entry, index (entry.id)}
                              <article class="interest-entry-card photography-entry-card">
                                <div class="interest-entry-heading">
                                  <span class="interest-entry-number">{String(index + 1).padStart(2, '0')}</span>
                                  <div>
                                    <strong>{entry.title}</strong>
                                    {#if entry.fields.description}<small>{entry.fields.description}</small>{/if}
                                  </div>
                                  <span class:missing={!entry.fields.focalLength} class="photography-spot-focal">{entry.fields.focalLength || 'Brennweite offen'}</span>
                                </div>
                                {#if entry.fields.light || entry.fields.motifs || entry.fields.guidance}
                                  <div class="interest-entry-details photography-entry-details">
                                    {#if entry.fields.light}<p><span>Licht / beste Zeit</span>{entry.fields.light}</p>{/if}
                                    {#if entry.fields.motifs}<p><span>Motive</span>{entry.fields.motifs}</p>{/if}
                                    {#if entry.fields.guidance}<p class="interest-entry-wide"><span>Fotografischer Hinweis</span>{entry.fields.guidance}</p>{/if}
                                  </div>
                                {/if}
                                {#if entry.fields.placeReference}<p class="interest-entry-place"><span>Ort & Karte</span>{entry.fields.placeReference}</p>{/if}
                              </article>
                            {/each}
                          {:else}
                            <small class="photography-empty">Noch kein Fotospot angelegt.</small>
                          {/if}
                        </div>
                      </section>
                      {#if (selectedPage.authoring?.photo_light?.content && !selectedInterestEntries.some((entry) => entry.fields.light))
                        || (selectedPage.authoring?.photo_motifs?.content && !selectedInterestEntries.some((entry) => entry.fields.motifs))
                        || (selectedPage.authoring?.photo_guidance?.content && !selectedInterestEntries.some((entry) => entry.fields.guidance))}
                        <div class="photography-experience-grid interest-legacy-shared" aria-label="Bestehende übergreifende Fotografie-Notizen">
                          {#if selectedPage.authoring?.photo_light?.content && !selectedInterestEntries.some((entry) => entry.fields.light)}<section><span>Licht & Tageszeit</span><p>{selectedPage.authoring.photo_light.content}</p></section>{/if}
                          {#if selectedPage.authoring?.photo_motifs?.content && !selectedInterestEntries.some((entry) => entry.fields.motifs)}<section><span>Motive</span><p>{selectedPage.authoring.photo_motifs.content}</p></section>{/if}
                          {#if selectedPage.authoring?.photo_guidance?.content && !selectedInterestEntries.some((entry) => entry.fields.guidance)}<section><span>Fotografischer Hinweis</span><p>{selectedPage.authoring.photo_guidance.content}</p></section>{/if}
                        </div>
                      {/if}
                      {#if selectedPage.authoring?.photo_place_reference?.content && !interestHasPlaceReference}
                        <div class="photography-place-reference interest-legacy-shared"><span>Ort & Karte</span><strong>{selectedPage.authoring.photo_place_reference.content}</strong></div>
                      {/if}
                    {/if}
                  </div>
                {:else if selectedPage.destinationInterestKind === 'hiking_nature'}
                  <div class="destination-interest-preview hiking-nature-experience" class:interest-density-tight={interestDensity === 'tight'}>
                    <div class="page-rule hiking-page-rule"></div>
                    <p class="eyebrow">{destinationInterest.label}</p>
                    <div class="curated-hero-flow">
                      {#if curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind)}
                        <img class="curated-world-hero" src={curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind) ?? ''} alt="" aria-hidden="true" />
                      {/if}
                      <h1>{journeyStage.title}</h1>
                      <p class="preview-body destination-interest-introduction">{selectedPage.authoring?.introduction?.content || destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)}</p>
                    </div>

                    {#if interestOverflow}
                      <div class="destination-capacity-stop hiking-capacity-stop" aria-label="Inhalt passt nicht ruhig auf diese Seite">
                        <span>Mehr Raum nötig</span>
                        <strong>Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.</strong>
                        <small>Studio verkleinert nicht weiter. Kürze eine Route oder verteile die Vertiefung später auf eine weitere Seite. Companion und Footer bleiben geschützt.</small>
                      </div>
                    {:else}
                      <section class="interest-entry-section hiking-routes" aria-label="Routen und Touren">
                        <span class="hiking-section-label">Routen & Touren</span>
                        <div class={`interest-entry-grid interest-entry-${interestComposition}`}>
                          {#if selectedInterestEntries.length}
                            {#each selectedInterestEntries as entry, index (entry.id)}
                              <article class="interest-entry-card hiking-entry-card">
                                <div class="interest-entry-heading">
                                  <span class="interest-entry-number">{String(index + 1).padStart(2, '0')}</span>
                                  <div>
                                    <strong>{entry.title}</strong>
                                    {#if entry.fields.description}<small>{entry.fields.description}</small>{/if}
                                  </div>
                                </div>
                                <div class="hiking-route-meta">
                                  <span>{entry.fields.startPoint || 'Start offen'}</span>
                                  <span>{entry.fields.duration || 'Dauer offen'}</span>
                                  <span>{entry.fields.difficulty || 'Schwierigkeit offen'}</span>
                                </div>
                                {#if entry.fields.highlights || entry.fields.guidance}
                                  <div class="interest-entry-details hiking-route-details">
                                    {#if entry.fields.highlights}<p><span>Aussicht & Naturziele</span>{entry.fields.highlights}</p>{/if}
                                    {#if entry.fields.guidance}<p><span>Hinweise zur Strecke</span>{entry.fields.guidance}</p>{/if}
                                  </div>
                                {/if}
                                {#if entry.fields.placeReference}<p class="interest-entry-place"><span>Ort & Karte</span>{entry.fields.placeReference}</p>{/if}
                              </article>
                            {/each}
                          {:else}
                            <small class="hiking-empty">Noch keine Route angelegt.</small>
                          {/if}
                        </div>
                      </section>
                      {#if selectedPage.authoring?.hike_place_reference?.content && !interestHasPlaceReference}
                        <div class="hiking-place-reference interest-legacy-shared"><span>Ort & Karte</span><strong>{selectedPage.authoring.hike_place_reference.content}</strong></div>
                      {/if}
                    {/if}
                  </div>
                {:else if selectedPage.destinationInterestKind === 'culture_history'}
                  <div class="destination-interest-preview culture-history-experience" class:interest-density-tight={interestDensity === 'tight'}>
                    <div class="page-rule culture-history-page-rule"></div>
                    <p class="eyebrow">{destinationInterest.label}</p>
                    <div class="curated-hero-flow">
                      {#if curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind)}
                        <img class="curated-world-hero" src={curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind) ?? ''} alt="" aria-hidden="true" />
                      {/if}
                      <h1>{journeyStage.title}</h1>
                      <p class="preview-body destination-interest-introduction">{selectedPage.authoring?.introduction?.content || destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)}</p>
                    </div>
                    {#if interestOverflow}
                      <div class="destination-capacity-stop culture-history-capacity-stop" aria-label="Inhalt passt nicht ruhig auf diese Seite">
                        <strong>Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.</strong>
                        <small>Kürze einzelne Stationen oder verteile die Vertiefung auf weitere Seiten.</small>
                      </div>
                    {:else}
                      <section class="interest-entry-section culture-history-places" aria-label="Kulturelle Orte und Stationen">
                        <span class="culture-history-section-label">Orte & Stationen</span>
                        <div class={`interest-entry-grid interest-entry-${interestComposition}`}>
                          {#if selectedInterestEntries.length}
                            {#each selectedInterestEntries as entry, index (entry.id)}
                              <article class="interest-entry-card culture-history-entry-card">
                                <div class="interest-entry-heading">
                                  <span class="interest-entry-number">{String(index + 1).padStart(2, '0')}</span>
                                  <div>
                                    <strong>{entry.title}</strong>
                                    {#if entry.fields.category}<small>{entry.fields.category}</small>{/if}
                                  </div>
                                </div>
                                {#if entry.fields.why || entry.fields.guidance || entry.fields.timeReference}
                                  <div class="interest-entry-details culture-history-entry-details">
                                    {#if entry.fields.why}<p class="interest-entry-wide"><span>Einordnung & Bedeutung</span>{entry.fields.why}</p>{/if}
                                    {#if entry.fields.guidance}<p><span>Besuchshinweis</span>{entry.fields.guidance}</p>{/if}
                                    {#if entry.fields.timeReference}<p><span>Zeitbezug</span>{entry.fields.timeReference}</p>{/if}
                                  </div>
                                {/if}
                                {#if entry.fields.placeReference}<p class="interest-entry-place"><span>Ort & Karte</span>{entry.fields.placeReference}</p>{/if}
                              </article>
                            {/each}
                          {:else}
                            <small class="culture-history-empty">Noch keine Station angelegt.</small>
                          {/if}
                        </div>
                      </section>
                    {/if}
                  </div>
                {:else if selectedPage.destinationInterestKind === 'culinary_local'}
                  <div class="destination-interest-preview culinary-local-experience" class:interest-density-tight={interestDensity === 'tight'}>
                    <div class="page-rule culinary-local-page-rule"></div>
                    <p class="eyebrow">{destinationInterest.label}</p>
                    <div class="curated-hero-flow">
                      {#if curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind)}
                        <img class="curated-world-hero" src={curatedHeroFor(editorialWorld?.id, selectedPage.destinationInterestKind) ?? ''} alt="" aria-hidden="true" />
                      {/if}
                      <h1>{journeyStage.title}</h1>
                      <p class="preview-body destination-interest-introduction">{selectedPage.authoring?.introduction?.content || destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)}</p>
                    </div>
                    {#if interestOverflow}
                      <div class="destination-capacity-stop culinary-local-capacity-stop" aria-label="Inhalt passt nicht ruhig auf diese Seite">
                        <strong>Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.</strong>
                        <small>Kürze einzelne Empfehlungen oder verteile die Vertiefung auf weitere Seiten.</small>
                      </div>
                    {:else}
                      <section class="interest-entry-section culinary-local-recommendations" aria-label="Kulinarische und lokale Empfehlungen">
                        <span class="culinary-local-section-label">Empfehlungen</span>
                        <div class={`interest-entry-grid interest-entry-${interestComposition}`}>
                          {#if selectedInterestEntries.length}
                            {#each selectedInterestEntries as entry, index (entry.id)}
                              <article class="interest-entry-card culinary-local-entry-card">
                                <div class="interest-entry-heading">
                                  <span class="interest-entry-number">{String(index + 1).padStart(2, '0')}</span>
                                  <div>
                                    <strong>{entry.title}</strong>
                                    {#if entry.fields.category}<small>{entry.fields.category}</small>{/if}
                                  </div>
                                </div>
                                {#if entry.fields.why || entry.fields.try || entry.fields.guidance || entry.fields.timePrice}
                                  <div class="interest-entry-details culinary-local-entry-details">
                                    {#if entry.fields.why}<p class="interest-entry-wide"><span>Warum lohnt es sich?</span>{entry.fields.why}</p>{/if}
                                    {#if entry.fields.try}<p><span>Probieren & entdecken</span>{entry.fields.try}</p>{/if}
                                    {#if entry.fields.guidance}<p><span>Gut zu wissen</span>{entry.fields.guidance}</p>{/if}
                                    {#if entry.fields.timePrice}<p class="interest-entry-wide culinary-time-price"><span>Zeit / Preis</span>{entry.fields.timePrice}</p>{/if}
                                  </div>
                                {/if}
                                {#if entry.fields.placeReference}<p class="interest-entry-place"><span>Ort & Karte</span>{entry.fields.placeReference}</p>{/if}
                              </article>
                            {/each}
                          {:else}
                            <small class="culinary-local-empty">Noch keine Empfehlung angelegt.</small>
                          {/if}
                        </div>
                      </section>
                    {/if}
                  </div>
                {:else}
                  <div class="destination-interest-preview">
                    <div class="page-rule"></div>
                    <p class="eyebrow">{destinationInterest.label}</p>
                    <h1>{journeyStage.title}</h1>
                    <p class="preview-body destination-interest-introduction">{selectedPage.authoring?.introduction?.content || destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)}</p>
                  </div>
                {/if}
              {:else if selectedPage?.type === 'knowledge' && selectedPage.knowledgeType === 'photography_light'}
                <div class="light-companion-preview">
                  <h1>Licht</h1>
                  <p class="light-companion-deck">Natürliches Licht verändert Stimmung, Farbe und Tiefe eines Motivs. Diese Seite bleibt bewusst allgemein: Sie begleitet jedes Travelbook mit kuratiertem Wissen, statt dieselben Grundlagen für jede Reise neu zu erzählen.</p>

                  <div class="light-phase-grid" aria-label="Kuratiertes Wissen zu Lichtphasen">
                    {#each CURATED_LIGHT_PHASES as phase (phase.id)}
                      <section class="light-phase-card">
                        <header><strong>{phase.label}</strong><small>{phase.orientation}</small></header>
                        <p>{phase.description}</p>
                        <p>{phase.photography}</p>
                      </section>
                    {/each}
                  </div>

                  {#if selectedPage.authoring?.introduction?.content?.trim()}
                    <section class="light-companion-journey-note" aria-label="Für diese Reise">
                      <span>Für diese Reise</span>
                      <p>{selectedPage.authoring.introduction.content}</p>
                    </section>
                  {/if}
                </div>
              {:else if selectedPage?.type === 'knowledge' && selectedPage.knowledgeType === 'travel_weather'}
                <div class="weather-companion-preview">
                  <h1>Wetter</h1>
                  <p class="weather-companion-deck">Wetter verändert Tempo, Sicht und Aufenthalt draußen. Diese Seite bündelt allgemeine Orientierung zu Regen, Wind, Nebel und Wolken – ohne eine konkrete Reise vorwegzunehmen.</p>

                  <div class="weather-situation-grid" aria-label="Kuratiertes Wissen zu Wettersituationen">
                    {#each CURATED_WEATHER_SITUATIONS as situation (situation.id)}
                      <section class="weather-situation-card">
                        <header><strong>{situation.label}</strong><small>{situation.orientation}</small></header>
                        <p>{situation.description}</p>
                        <p>{situation.travel}</p>
                      </section>
                    {/each}
                  </div>

                  {#if selectedPage.authoring?.introduction?.content?.trim()}
                    <section class="weather-companion-journey-note" aria-label="Für diese Reise">
                      <span>Für diese Reise</span>
                      <p>{selectedPage.authoring.introduction.content}</p>
                    </section>
                  {/if}
                </div>
              {:else if selectedPage?.type === 'workflow'}
                <div class="photography-workshop-preview">
                  <div class="curated-hero-flow curated-hero-flow-workshop">
                    {#if curatedHeroFor(editorialWorld?.id, 'photography_workshop')}
                      <img class="curated-world-hero" src={curatedHeroFor(editorialWorld?.id, 'photography_workshop') ?? ''} alt="" aria-hidden="true" />
                    {/if}
                    <h1>Fotografie-Workshop</h1>
                    <p class="photography-workshop-deck">Vier Fragen für bewusstere Bilder unterwegs. Der Workshop vermittelt keine festen Rezepte und schreibt keine Software vor – er ordnet Entscheidungen vom ersten Blick bis zur kurzen Kontrolle nach der Aufnahme.</p>
                  </div>

                  <div class="photography-workshop-flow" aria-label="Vier kuratierte Themenwelten des Fotografie-Workshops">
                    {#each CURATED_WORKSHOP_WORLDS as world, index (world.id)}
                      <section class="photography-workshop-card">
                        <header>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <div><strong>{world.label}</strong><small>{world.question}</small></div>
                        </header>
                        <p class="photography-workshop-orientation">{world.orientation}</p>
                        <p>{world.description}</p>
                        <p class="photography-workshop-practice">{world.practice}</p>
                      </section>
                    {/each}
                  </div>

                  <p class="photography-workshop-bridge"><span>Licht & Wetter</span>{CURATED_WORKSHOP_BRIDGE}</p>
                </div>
              {:else if selectedPage?.type === 'contents' && project}
                <div class="contents-preview">
                  <header class="contents-head">
                    <div>
                      <h1>Orientierung</h1>
                      <p class="contents-deck">Deine Reise auf einen Blick. Ruhig geordnet, damit du schnell findest, was dich unterwegs begleitet.</p>
                    </div>
                  </header>

                  <div class="contents-list" aria-label="Orientierung">
                    {#each sections as section}
                      {@const tocPages = section.pages.filter((page) => page.type !== 'cover' && page.type !== 'contents')}
                      {#if tocPages.length}
                        <section class="contents-group">
                          <span class="contents-group-label">{section.label}</span>
                          <div>
                            {#each tocPages as page}
                              <div class="contents-row">
                                <span class="contents-order">{String(visiblePageNumber(page)).padStart(2, '0')}</span>
                                <strong>{displayPageTitle(page)}</strong>
                                <span class="contents-leader" aria-hidden="true"></span>
                                <span class="contents-page-number">{visiblePageNumber(page)}</span>
                              </div>
                            {/each}
                          </div>
                        </section>
                      {/if}
                    {/each}
                  </div>
                </div>
              {:else if selectedPage?.type === 'notes'}
                <div class="notes-preview">
                  <header class="notes-head">
                    <div>
                      <h1>Erinnerungen</h1>
                      <p class="notes-deck">Ideen, Eindrücke und kleine Beobachtungen. Genug Struktur für Orientierung – und genug Freiheit für das, was unterwegs entsteht.</p>
                    </div>
                    {#if curatedAccentFor(editorialWorld?.id, 'notes')}
                      <img class="curated-world-accent notes-accent" src={curatedAccentFor(editorialWorld?.id, 'notes') ?? ''} alt="" aria-hidden="true" />
                    {/if}
                  </header>

                  <div class="notes-layout" aria-label="Erinnerungsbereiche">
                    <section class="notes-main" aria-label="Freie Notizen">
                      <span>Freie Erinnerungen</span>
                      <div class="notes-lines" aria-hidden="true"></div>
                    </section>
                    <aside class="notes-side">
                      <section><span>Schnellnotiz</span><div class="notes-mini-lines" aria-hidden="true"></div></section>
                      <section><span>Ideen</span><div class="notes-mini-lines" aria-hidden="true"></div></section>
                      <section class="notes-sketch"><span>Skizze</span><div class="notes-dot-grid" aria-hidden="true"></div></section>
                    </aside>
                  </div>
                </div>
              {:else if selectedPage?.type === 'cover' && project}
                <div class="curated-cover-preview" aria-label={`Cover · ${editorialWorld?.name ?? 'Northern Lines'}`}>
                  <p class="curated-cover-kicker">Northern Lines · {editorialWorld?.name ?? 'Reisewelt'}</p>
                  <h1 class="curated-cover-title">{project.journey.title || project.title}</h1>
                  <p class="curated-cover-book-label">Reisebuch</p>
                  <p class="curated-cover-tagline">Deine Reise. Deine Bilder. Deine Erinnerungen.</p>
                  <div class="curated-cover-date" aria-label="Reisezeitraum">
                    <span>Reisezeitraum</span>
                    <strong>{project.journey.startDate || project.journey.endDate
                      ? [project.journey.startDate, project.journey.endDate].filter((date): date is string => Boolean(date)).map((date) => date.split('-').reverse().join('.')).join(' – ')
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
              <span>Warum dieser Ort?</span>
              <textarea rows="3" value={destinationReasons.join('\n')} on:input={(event) => updateDestinationReasonText(event.currentTarget.value)} placeholder="Zum Beispiel: Bryggen am Morgen&#10;Blick vom Fløyen&#10;Maritime Atmosphäre"></textarea>
              <small>Ein Gedanke pro Zeile.</small>
            </label>

            <div class="destination-interest-selector">
              <div class="destination-interest-selector-heading">
                <span>Deine Interessen</span>
                <strong>Was möchtest du in {destinationName || journeyStage.title} erleben?</strong>
                <small>Wähle nur, was für diese Reise Bedeutung hat. Mehrere Vertiefungen dürfen zusammengehören.</small>
              </div>
              <div class="destination-interest-options">
                {#each DESTINATION_INTEREST_DEFINITIONS as interest}
                  <button
                    type="button"
                    class:active={destinationInterestKinds.includes(interest.kind)}
                    disabled={destinationInterestKinds.includes(interest.kind) || destinationDirty || isLoading}
                    on:click={() => void addDestinationInterest(interest.kind)}
                  >
                    <strong>{interest.questionLabel}</strong>
                    <small>{destinationInterestKinds.includes(interest.kind) ? 'Hinzugefügt' : '+ Interesse'}</small>
                  </button>
                {/each}
              </div>
              {#if destinationDirty}<small class="destination-interest-save-hint">Sichere zuerst dein Ortsprofil, bevor du eine Vertiefung hinzufügst.</small>{/if}
            </div>

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

      {#if selectedPage?.type === 'destination_interest' && destinationInterest && journeyStage}
        <section class="inspector-card destination-interest-card" aria-label="Thematische Vertiefung">
          <span class="inspector-label">Deine Vertiefung</span>
          <strong>{destinationInterest.label}</strong>
          <small>{journeyStage.title} · {destinationInterest.description}</small>
          <div class="interest-introduction-authoring">
            <div class="interest-introduction-heading">
              <span>Einleitung</span>
              {#if activeAuthoringComponent !== 'introduction'}
                <button type="button" class="interest-introduction-edit" on:click={() => editStoryComponent('introduction')} disabled={interestEntryDirty || destinationDirty}>Bearbeiten</button>
              {/if}
            </div>
            {#if activeAuthoringComponent === 'introduction'}
              <textarea bind:value={authoringDraft} rows="3" placeholder={destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)} aria-label="Einleitung dieser Vertiefung"></textarea>
              <div class="interest-introduction-actions">
                <button type="button" class="authoring-save" on:click={saveAuthoring} disabled={authoringSaveState === 'saving'}>{authoringSaveState === 'saving' ? 'Sichern …' : 'Einleitung sichern'}</button>
              </div>
              <small class:saveOk={authoringSaveState === 'saved'} class:saveDirty={authoringDirty}>{authoringDirty ? '● Nicht gesichert' : authoringSaveState === 'saved' ? 'Gespeichert' : 'Bereit zum Bearbeiten'}</small>
            {:else}
              <p>{selectedPage.authoring?.introduction?.content || destinationInterestIntroduction(selectedPage.destinationInterestKind, journeyStage.title)}</p>
            {/if}
          </div>
          <button type="button" class="destination-interest-remove" on:click={() => void removeSelectedDestinationInterest()} disabled={isLoading || authoringDirty || interestEntryDirty}>Vertiefung entfernen</button>
          {#if authoringDirty || interestEntryDirty}<small>Sichere oder verwirf deine Änderungen, bevor du die Vertiefung entfernst.</small>{/if}
        </section>
      {/if}

      {#if selectedPage?.type === 'destination_interest' && selectedInterestEntrySchema}
        <section class="inspector-card interest-entry-authoring-card" aria-label="Einträge dieser Vertiefung">
          <span class="inspector-label">Inhalte</span>
          <strong>{selectedInterestEntrySchema.singularLabel}</strong>
          <small>Füge einen konkreten Eintrag hinzu. Studio hält zusammengehörige Angaben zusammen und entscheidet selbst über eine oder zwei Boxen.</small>

          <div class="interest-entry-authoring-list">
            {#each selectedInterestEntries as entry, index (entry.id)}
              <div class="interest-entry-authoring-row">
                <button type="button" on:click={() => beginInterestEntry(entry)} disabled={interestEntryDirty || authoringDirty || destinationDirty}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{entry.title}</strong>
                </button>
                <button type="button" class="interest-entry-remove" on:click={() => void removeInterestEntry(entry.id)} disabled={interestEntryDirty || authoringDirty || destinationDirty}>Entfernen</button>
              </div>
            {/each}
          </div>

          {#if interestEntryDraft}
            <div class="interest-entry-editor">
              <div class="authoring-heading">
                <span>{selectedInterestEntries.some((entry) => entry.id === interestEntryDraft?.id) ? 'Bearbeiten' : 'Neu'}</span>
                <strong>{selectedInterestEntrySchema.singularLabel}</strong>
              </div>
              <label>
                <span>{selectedInterestEntrySchema.titleLabel}</span>
                <input value={interestEntryDraft.title} on:input={updateInterestEntryTitle} placeholder={selectedInterestEntrySchema.titlePlaceholder} />
              </label>
              {#each selectedInterestEntrySchema.fields as field}
                <label>
                  <span>{field.label}</span>
                  {#if field.multiline}
                    <textarea rows="3" value={interestEntryDraft.fields[field.id] ?? ''} on:input={(event) => updateInterestEntryField(field.id, event)} placeholder={field.placeholder}></textarea>
                  {:else}
                    <input value={interestEntryDraft.fields[field.id] ?? ''} on:input={(event) => updateInterestEntryField(field.id, event)} placeholder={field.placeholder} />
                  {/if}
                </label>
              {/each}
              <div class="interest-entry-editor-actions">
                <button type="button" class="interest-entry-back" on:click={cancelInterestEntry}>Zurück</button>
                <button type="button" class="authoring-save" on:click={() => void saveInterestEntry()} disabled={interestEntrySaveState === 'saving'}>{interestEntrySaveState === 'saving' ? 'Sichern …' : 'Eintrag sichern'}</button>
              </div>
              {#if interestEntryDirty}<small class="saveDirty">● Nicht gesichert</small>{/if}
            </div>
          {:else}
            <button type="button" class="interest-entry-add" on:click={() => beginInterestEntry()} disabled={authoringDirty || destinationDirty}>{`+ ${selectedInterestEntrySchema.addLabel}`}</button>
          {/if}
        </section>
      {/if}

      {#if selectedPage?.type === 'knowledge' && selectedPage.knowledgeType === 'photography_light'}
        <section class="inspector-card travel-companion-inspector light-companion-inspector" aria-label="Reisebegleitung Licht">
          <span class="inspector-label">Reisebegleitung</span>
          <div class="travel-companion-inspector-title">Licht</div>
          <small>Der kuratierte Kern ist Teil von Northern Lines und wird wiederverwendet. Ergänze nur, was für diese konkrete Reise wichtig ist.</small>
          <div class="travel-companion-curated-facts">
            <span>Kernwissen</span><strong>kuratiert</strong>
            <span>Lichtphasen</span><strong>{CURATED_LIGHT_PHASES.length} vorhanden</strong>
            <span>Reisebezug</span><strong>optional</strong>
          </div>
          <div class="light-companion-inspector-note">
            <span class="inspector-label">Für diese Reise</span>
            {#if activeAuthoringComponent === 'introduction'}
              <textarea bind:value={authoringDraft} rows="3" placeholder="Zum Beispiel: Im norwegischen Sommer bleiben die Übergänge lange weich." aria-label="Reisehinweis zu Licht"></textarea>
              <div class="interest-introduction-actions">
                <button type="button" class="interest-entry-back" on:click={closeAuthoringPanel} disabled={authoringDirty}>Zurück</button>
                <button type="button" class="authoring-save" on:click={saveAuthoring} disabled={authoringSaveState === 'saving'}>{authoringSaveState === 'saving' ? 'Sichern …' : 'Hinweis sichern'}</button>
              </div>
              {#if authoringDirty}<small class="authoring-context-hint">Sichere deinen Hinweis, bevor du zurückgehst.</small>{/if}
              <small class:saveOk={authoringSaveState === 'saved'} class:saveDirty={authoringDirty}>{authoringDirty ? '● Nicht gesichert' : authoringSaveState === 'saved' ? 'Gespeichert' : 'Bereit zum Bearbeiten'}</small>
            {:else}
              {#if selectedPage.authoring?.introduction?.content?.trim()}<p>{selectedPage.authoring.introduction.content}</p>{/if}
              <button type="button" class="interest-introduction-edit" on:click={() => editStoryComponent('introduction')}>{selectedPage.authoring?.introduction?.content?.trim() ? 'Hinweis bearbeiten' : '+ Reisehinweis ergänzen'}</button>
            {/if}
          </div>
        </section>
      {/if}

      {#if selectedPage?.type === 'knowledge' && selectedPage.knowledgeType === 'travel_weather'}
        <section class="inspector-card travel-companion-inspector weather-companion-inspector" aria-label="Reisebegleitung Wetter">
          <span class="inspector-label">Reisebegleitung</span>
          <div class="travel-companion-inspector-title">Wetter</div>
          <small>Der kuratierte Kern ist Teil von Northern Lines und wird wiederverwendet. Ergänze nur, was für diese konkrete Reise wichtig ist.</small>
          <div class="travel-companion-curated-facts">
            <span>Kernwissen</span><strong>kuratiert</strong>
            <span>Wettersituationen</span><strong>{CURATED_WEATHER_SITUATIONS.length} vorhanden</strong>
            <span>Reisebezug</span><strong>optional</strong>
          </div>
          <div class="weather-companion-inspector-note">
            <span class="inspector-label">Für diese Reise</span>
            {#if activeAuthoringComponent === 'introduction'}
              <textarea bind:value={authoringDraft} rows="3" placeholder="Zum Beispiel: Vor längeren Etappen an der Küste noch einmal Wind, Sicht und Niederschlag prüfen." aria-label="Reisehinweis zu Wetter"></textarea>
              <div class="interest-introduction-actions">
                <button type="button" class="interest-entry-back" on:click={closeAuthoringPanel} disabled={authoringDirty}>Zurück</button>
                <button type="button" class="authoring-save" on:click={saveAuthoring} disabled={authoringSaveState === 'saving'}>{authoringSaveState === 'saving' ? 'Sichern …' : 'Hinweis sichern'}</button>
              </div>
              {#if authoringDirty}<small class="authoring-context-hint">Sichere deinen Hinweis, bevor du zurückgehst.</small>{/if}
              <small class:saveOk={authoringSaveState === 'saved'} class:saveDirty={authoringDirty}>{authoringDirty ? '● Nicht gesichert' : authoringSaveState === 'saved' ? 'Gespeichert' : 'Bereit zum Bearbeiten'}</small>
            {:else}
              {#if selectedPage.authoring?.introduction?.content?.trim()}<p>{selectedPage.authoring.introduction.content}</p>{/if}
              <button type="button" class="interest-introduction-edit" on:click={() => editStoryComponent('introduction')}>{selectedPage.authoring?.introduction?.content?.trim() ? 'Hinweis bearbeiten' : '+ Reisehinweis ergänzen'}</button>
            {/if}
          </div>
        </section>
      {/if}

      {#if selectedPage?.type === 'workflow'}
        <section class="inspector-card travel-companion-inspector photography-workshop-inspector" aria-label="Fotografie-Workshop">
          <span class="inspector-label">Fotografie</span>
          <div class="travel-companion-inspector-title">Fotografie-Workshop</div>
          <small>Vollständig kuratierte Northern-Lines-Praxis. Keine Softwarevorgabe, kein reisespezifisches Authoring und keine festen Einstellungsrezepte.</small>
          <div class="travel-companion-curated-facts">
            <span>Kernwissen</span><strong>kuratiert</strong>
            <span>Themenwelten</span><strong>{CURATED_WORKSHOP_WORLDS.length} vorhanden</strong>
            <span>Reisebezug</span><strong>nicht vorgesehen</strong>
          </div>
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

      {#if storyStructure && selectedPage?.type !== 'destination' && !structuredInterestPage && selectedPage?.type !== 'workflow' && !(selectedPage?.type === 'knowledge' && (selectedPage.knowledgeType === 'photography_light' || selectedPage.knowledgeType === 'travel_weather'))}
        <section class="inspector-card story-card" aria-label="Story Components">
          <span class="inspector-label">Story</span>
          <strong>Deine Geschichte</strong>
          <small>Wähle den Teil der Geschichte, an dem du gerade arbeiten möchtest.</small>

          <div class="story-component-list">
            {#each visibleStoryPresent as component}
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
              {#if activeAuthoring.componentId === 'photo_focal_lengths'}
                <small class="authoring-context-hint">Eine Brennweite pro Zeile. Die Reihenfolge entspricht direkt deiner Fotospot-Liste.</small>
              {/if}
              {#if ['hike_start_points', 'hike_durations', 'hike_difficulties'].includes(activeAuthoring.componentId)}
                <small class="authoring-context-hint">Ein Eintrag pro Zeile. Die Reihenfolge entspricht direkt deiner Liste „Routen & Touren“.</small>
              {/if}
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
            <span>{structuredInterestPage ? 'Vertiefung' : 'Story Fortschritt'}</span>
            <strong>{structuredInterestPage ? `${selectedInterestEntries.length} ${selectedInterestEntrySchema?.singularLabel ?? 'Einträge'} angelegt` : `${authoredCount} von ${storyPresent.length} Story-Elementen authoriert · ${authoringProgress}%`}</strong>
          </div>

          {#if visibleStoryAvailable.length > 0}
            <div class="story-optional">
              <span>Optional möglich</span>
              <strong>{visibleStoryAvailable.map((component) => component.label).join(' · ')}</strong>
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
        <dt>Seitentyp</dt><dd>{selectedPage?.type === 'destination_interest' ? 'Thematische Vertiefung' : (selectedPage?.type ?? '–')}</dd>
        {#if selectedPage?.destinationInterestKind}<dt>Interesse</dt><dd>{destinationInterestLabel(selectedPage.destinationInterestKind)}</dd>{/if}
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
{/if}
