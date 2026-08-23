import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  assembleStudioDocumentPdfProof,
  BACKGROUND_PROOF_POC_001_DOCUMENT_LIFECYCLE_STEPS,
  BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS,
  backgroundProofPoc001BackgroundStandardOutputPath,
  backgroundProofPoc001BuildHostUrl,
  backgroundProofPoc001EventNames,
  backgroundProofPoc001HiddenHostViewportForMain,
  backgroundProofPoc001HostRequestIsComplete,
  backgroundProofPoc001LifecycleTimeoutError,
  backgroundProofPoc001MainWindowInvariant,
  backgroundProofPoc001OutputDirForFinalOutputPath,
  backgroundProofPoc001OutputPath,
  backgroundProofPoc001ParseHostParams,
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
  STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE,
  stagedDocumentProofPagePath,
  studioPageFadeDurationMs,
  studioDocumentProofPages
} from './pdf-proof';
import type { StudioPage, StudioProject } from './project';

function page(id: string, order: number, type: StudioPage['type'] = 'destination'): StudioPage {
  return {
    id,
    order,
    type,
    role: type === 'cover' ? 'front_matter' : 'destination',
    title: id.toUpperCase(),
    content: `${id}.md`,
    layout: 'test-layout'
  };
}

function projectWithPages(pages: StudioPage[]): StudioProject {
  return {
    format: 'northern-lines-studio-project',
    formatVersion: '0.16.0',
    projectId: 'proof-test',
    title: 'Proof Test',
    language: 'de',
    journey: {
      id: 'proof-test-journey',
      title: 'Proof Test',
      type: 'travelbook',
      stages: []
    },
    destinations: [],
    document: {
      pageFormat: 'A5',
      orientation: 'portrait'
    },
    pageManifest: pages,
    projectPath: '/tmp/proof-test.nls'
  };
}

describe('Studio PDF Proof', () => {
  it('invokes the proof command with a resolved-page request', async () => {
    const invoke = vi.fn().mockResolvedValue({
      outputPath: '/tmp/studio-proof.pdf',
      widthPt: 419.527559055,
      heightPt: 595.275590551
    });

    const result = await createStudioPdfProof({
      pageId: 'page-1',
      physicalMedium: 'A5',
      outputPath: '/tmp/studio-proof.pdf'
    }, invoke);

    expect(invoke).toHaveBeenCalledWith('create_studio_pdf_proof', {
      request: {
        pageId: 'page-1',
        physicalMedium: 'A5',
        outputPath: '/tmp/studio-proof.pdf'
      }
    });
    expect(result.widthPt).toBeCloseTo(419.527559055, 9);
  });

  it('prepares document proof staging outside the renderer boundary', async () => {
    const invoke = vi.fn().mockResolvedValue({ stagingPath: '/tmp/document-proof-1' });

    const result = await prepareStudioDocumentPdfProof({ pageCount: 3 }, invoke);

    expect(invoke).toHaveBeenCalledWith('prepare_studio_document_pdf_proof', {
      request: { pageCount: 3 }
    });
    expect(result.stagingPath).toBe('/tmp/document-proof-1');
  });

  it('assembles document proof pages in the provided Studio order', async () => {
    const invoke = vi.fn().mockResolvedValue({
      outputPath: '/tmp/travelbook.pdf',
      pageCount: 3,
      widthPt: 419.527559055,
      heightPt: 595.275590551
    });

    await assembleStudioDocumentPdfProof({
      outputPath: '/tmp/travelbook.pdf',
      stagingPath: '/tmp/document-proof',
      pages: [
        { index: 1, pageId: 'a', title: 'A', stagedPath: '/tmp/document-proof/0001.pdf' },
        { index: 2, pageId: 'b', title: 'B', stagedPath: '/tmp/document-proof/0002.pdf' },
        { index: 3, pageId: 'c', title: 'C', stagedPath: '/tmp/document-proof/0003.pdf' }
      ]
    }, invoke);

    expect(invoke).toHaveBeenCalledWith('assemble_studio_document_pdf_proof', {
      request: {
        outputPath: '/tmp/travelbook.pdf',
        stagingPath: '/tmp/document-proof',
        pages: [
          { index: 1, pageId: 'a', title: 'A', stagedPath: '/tmp/document-proof/0001.pdf' },
          { index: 2, pageId: 'b', title: 'B', stagedPath: '/tmp/document-proof/0002.pdf' },
          { index: 3, pageId: 'c', title: 'C', stagedPath: '/tmp/document-proof/0003.pdf' }
        ]
      }
    });
  });

  it('cleans document proof staging explicitly', async () => {
    const invoke = vi.fn().mockResolvedValue(undefined);

    await cleanupStudioDocumentPdfProof('/tmp/document-proof', invoke);

    expect(invoke).toHaveBeenCalledWith('cleanup_studio_document_pdf_proof', {
      stagingPath: '/tmp/document-proof'
    });
  });

  it('invokes the PDF/A export command with a standard PDF source boundary', async () => {
    const invoke = vi.fn().mockResolvedValue({
      outputPath: '/tmp/travelbook-pdfa.pdf',
      pageCount: 16,
      profile: 'PDF/A-2b'
    });

    const result = await exportStudioPdfA2b({
      sourcePath: '/tmp/travelbook-standard.pdf',
      outputPath: '/tmp/travelbook-pdfa.pdf'
    }, invoke);

    expect(invoke).toHaveBeenCalledWith('export_studio_pdfa2b', {
      request: {
        sourcePath: '/tmp/travelbook-standard.pdf',
        outputPath: '/tmp/travelbook-pdfa.pdf'
      }
    });
    expect(result.profile).toBe('PDF/A-2b');
  });

  it('uses the canonical Studio publication order instead of raw manifest insertion', () => {
    const pages = [
      { ...page('light', 8, 'knowledge'), role: 'journey_knowledge' as const },
      { ...page('bergen-photo', 13, 'destination_interest'), journeyStage: 'bergen', destinationInterestKind: 'photography' as const },
      { ...page('cover', 1, 'cover'), role: 'front_matter' as const },
      { ...page('bergen', 5, 'destination'), journeyStage: 'bergen' },
      { ...page('notes', 11, 'notes'), role: 'notes' as const },
      { ...page('planning', 4, 'planning'), role: 'journey_planning' as const }
    ];
    const project = projectWithPages(pages);
    project.journey.stages = [{ id: 'bergen', kind: 'destination', title: 'Bergen' }];

    expect(studioDocumentProofPages(project).map((entry) => entry.id)).toEqual([
      'cover',
      'planning',
      'bergen',
      'bergen-photo',
      'light',
      'notes'
    ]);
  });

  it('supports variable page counts and deterministic staged filenames', () => {
    const pages = [page('a', 1), page('b', 2), page('c', 3), page('d', 4), page('e', 5)];

    expect(studioDocumentProofPages(projectWithPages(pages))).toHaveLength(5);
    expect(stagedDocumentProofPagePath('/tmp/document-proof', 1)).toBe('/tmp/document-proof/0001.pdf');
    expect(stagedDocumentProofPagePath('/tmp/document-proof', 12)).toBe('/tmp/document-proof/0012.pdf');
  });

  it('selects only the three bounded Background Proof PoC 001 reference roles', () => {
    const pages = [
      page('cover', 1, 'cover'),
      page('bergen', 2, 'destination'),
      page('bergen-photo', 3, 'destination_interest'),
      page('workshop', 4, 'workflow'),
      page('notes', 5, 'notes')
    ];

    expect(backgroundProofPoc001ReferencePages(projectWithPages(pages)).map((entry) => ({
      referenceId: entry.referenceId,
      pageId: entry.page.id
    }))).toEqual([
      { referenceId: 'destination', pageId: 'bergen' },
      { referenceId: 'photography-workshop', pageId: 'workshop' },
      { referenceId: 'notes-memory', pageId: 'notes' }
    ]);
  });

  it('keeps Background Proof PoC 001 event names job-scoped', () => {
    expect(backgroundProofPoc001EventNames('job-42')).toEqual({
      native: 'background-proof-poc-001-native-trace',
      lifecycle: 'background-proof-poc-001-lifecycle-job-42',
      progress: 'background-proof-poc-001-progress-job-42',
      result: 'background-proof-poc-001-result-job-42'
    });
  });

  it('keeps the Plan B export cover URL scoped to a passive cover host', () => {
    const href = mainRendererExportCoverBuildUrl('tauri://localhost/index.html?stale=true#old', {
      jobId: 'job-42',
      pageCount: 16
    });
    const url = new URL(href);

    expect(url.protocol).toBe('tauri:');
    expect(url.host).toBe('localhost');
    expect(url.pathname).toBe('/index.html');
    expect(url.hash).toBe('');
    expect(url.searchParams.get('stale')).toBeNull();
    expect(url.searchParams.get('nlsMainRendererExportCover')).toBe('001');
    expect(url.searchParams.get('jobId')).toBe('job-42');
    expect(url.searchParams.get('pageCount')).toBe('16');
    expect(mainRendererExportCoverParseParams(url.search)).toEqual({
      isCover: true,
      jobId: 'job-42',
      pageCount: 16
    });
  });

  it('keeps Plan B export cover progress events job-scoped', () => {
    expect(mainRendererExportCoverEventName('job-42')).toBe('main-renderer-export-cover-progress-job-42');
    expect(mainRendererExportCoverParseParams('?nlsMainRendererExportCover=001&jobId=j&pageCount=bad')).toEqual({
      isCover: true,
      jobId: 'j',
      pageCount: 0
    });
  });

  it('builds the Background Proof PoC 001 Hidden Host URL without stale Main query state', () => {
    const href = backgroundProofPoc001BuildHostUrl('tauri://localhost/index.html?stale=true#old', {
      projectPath: '/Users/test/Norway.nls',
      outputDir: '/Users/test/Proofs',
      finalOutputPath: '/Users/test/Norway & Fjords.pdf',
      jobId: 'job-42',
      returnTo: 'main',
      mode: 'document-pdfa2b'
    });
    const url = new URL(href);

    expect(url.protocol).toBe('tauri:');
    expect(url.host).toBe('localhost');
    expect(url.pathname).toBe('/index.html');
    expect(url.hash).toBe('');
    expect(url.searchParams.get('stale')).toBeNull();
    expect(url.searchParams.get('nlsBackgroundProofPoc')).toBe('001');
    expect(url.searchParams.get('projectPath')).toBe('/Users/test/Norway.nls');
    expect(url.searchParams.get('outputDir')).toBe('/Users/test/Proofs');
    expect(url.searchParams.get('finalOutputPath')).toBe('/Users/test/Norway & Fjords.pdf');
    expect(url.searchParams.get('outputPath')).toBeNull();
    expect(url.searchParams.get('jobId')).toBe('job-42');
    expect(url.searchParams.get('returnTo')).toBe('main');
    expect(url.searchParams.get('mode')).toBe('document-pdfa2b');
  });

  it('parses Background Proof PoC 001 Hidden Host mode from query parameters', () => {
    expect(backgroundProofPoc001ParseHostParams('?nlsBackgroundProofPoc=001&projectPath=/p.nls&outputDir=/out&finalOutputPath=/final.pdf&jobId=j&returnTo=main&mode=document-pdfa2b')).toEqual({
      isHost: true,
      projectPath: '/p.nls',
      outputDir: '/out',
      finalOutputPath: '/final.pdf',
      jobId: 'j',
      returnTo: 'main',
      mode: 'document-pdfa2b'
    });
    expect(backgroundProofPoc001ParseHostParams('?projectPath=/p.nls')).toEqual({
      isHost: false,
      projectPath: '/p.nls',
      outputDir: '',
      finalOutputPath: '',
      jobId: '',
      returnTo: 'main',
      mode: 'reference-pages'
    });
  });

  it('keeps caller and Hidden Host parameter names aligned for full-document requests', () => {
    const finalOutputPath = '/Users/test/Norway & Fjords/Travelbook Final.pdf';
    const outputDir = backgroundProofPoc001OutputDirForFinalOutputPath(finalOutputPath);
    const hostUrl = backgroundProofPoc001BuildHostUrl('tauri://localhost/index.html?stale=true#old', {
      projectPath: '/Users/test/Project With Spaces.nls',
      outputDir,
      finalOutputPath,
      jobId: 'job-42',
      returnTo: 'main',
      mode: 'document-pdfa2b'
    });
    const parsed = backgroundProofPoc001ParseHostParams(new URL(hostUrl).search);

    expect(parsed).toEqual({
      isHost: true,
      projectPath: '/Users/test/Project With Spaces.nls',
      outputDir: '/Users/test/Norway & Fjords',
      finalOutputPath,
      jobId: 'job-42',
      returnTo: 'main',
      mode: 'document-pdfa2b'
    });
    expect(backgroundProofPoc001HostRequestIsComplete(parsed)).toBe(true);
  });

  it('keeps invalid Hidden Host requests invalid instead of weakening validation', () => {
    expect(backgroundProofPoc001HostRequestIsComplete(backgroundProofPoc001ParseHostParams(
      '?nlsBackgroundProofPoc=001&mode=document-pdfa2b&projectPath=/p.nls&finalOutputPath=/final.pdf&jobId=j&returnTo=main'
    ))).toBe(false);
    expect(backgroundProofPoc001HostRequestIsComplete(backgroundProofPoc001ParseHostParams(
      '?nlsBackgroundProofPoc=001&mode=document-pdfa2b&projectPath=/p.nls&outputDir=/out&jobId=j&returnTo=main'
    ))).toBe(false);
    expect(backgroundProofPoc001HostRequestIsComplete(backgroundProofPoc001ParseHostParams(
      '?nlsBackgroundProofPoc=001&mode=reference-pages&projectPath=/p.nls&outputDir=/out&jobId=j&returnTo=main'
    ))).toBe(true);
  });

  it('enumerates every required Background Proof PoC 001 lifecycle state', () => {
    expect(BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS).toEqual([
      'MAIN_POC_START',
      'MAIN_LISTENERS_READY',
      'MAIN_RENDER_ENVIRONMENT',
      'MAIN_ASSET_EVIDENCE',
      'FULL_DOCUMENT_HOST_REQUEST',
      'FULL_DOCUMENT_HOST_REQUEST_VALID',
      'HOST_CREATE_REQUEST',
      'HOST_CREATED',
      'HOST_LOAD_STARTED',
      'HOST_LOAD_FINISHED',
      'HOST_LOAD_FAILED',
      'HOST_JS_BOOTSTRAP_START',
      'HOST_LOCATION_CAPTURED',
      'HOST_MODE_PARSED',
      'HOST_RENDER_ENVIRONMENT',
      'HOST_SVELTE_MOUNT_START',
      'HOST_SVELTE_MOUNTED',
      'HOST_DOM_COMMIT_START',
      'HOST_LAYOUT_FRAME_START',
      'HOST_LAYOUT_FRAME_COMPLETE',
      'HOST_LAYOUT_FRAME_FALLBACK',
      'HOST_DOM_READY',
      'PROJECT_LOAD_START',
      'PROJECT_LOADED',
      'REFERENCE_DISCOVERY_START',
      'REFERENCE_DISCOVERY_COMPLETE',
      'HOST_READY',
      'REFERENCE_PAGE_SELECT_START',
      'REFERENCE_PAGE_SELECTED',
      'REFERENCE_PAGE_READINESS_START',
      'REFERENCE_PAGE_READY',
      'PROOF_MODE_ENTER',
      'PROOF_MODE_READY',
      'PDF_INVOKE_START',
      'RUST_COMMAND_ENTER',
      'NATIVE_WEBVIEW_RENDER_START',
      'NATIVE_WEBVIEW_RENDER_COMPLETE',
      'PAGEBOX_NORMALIZE_START',
      'PAGEBOX_NORMALIZE_COMPLETE',
      'PDF_VALIDATE_START',
      'PDF_VALIDATE_COMPLETE',
      'RUST_COMMAND_SUCCESS',
      'PDF_INVOKE_SUCCESS',
      'OUTPUT_FILE_CONFIRMED',
      'PROOF_MODE_EXIT_START',
      'PROOF_MODE_CLASS_REMOVED',
      'PROOF_MODE_EXIT',
      'POST_PROOF_TICK_START',
      'POST_PROOF_TICK_COMPLETE',
      'POST_PROOF_LAYOUT_FRAME_START',
      'POST_PROOF_LAYOUT_FRAME_COMPLETE',
      'POST_PROOF_LAYOUT_FRAME_FALLBACK',
      'POST_PROOF_STATE_STABLE',
      'REFERENCE_ITERATION_COMPLETE',
      'NEXT_REFERENCE_PAGE',
      'HOST_RESULT_EMIT',
      'MAIN_RESULT_RECEIVED',
      'HOST_CLOSE_REQUEST',
      'HOST_CLOSED',
      'COMPLETE'
    ]);
  });

  it('keeps post-proof Hidden Host transition before advancing to the next reference', () => {
    expect(BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('PROOF_MODE_EXIT')).toBeLessThan(
      BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('POST_PROOF_TICK_START')
    );
    expect(BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('POST_PROOF_LAYOUT_FRAME_FALLBACK')).toBeLessThan(
      BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('REFERENCE_ITERATION_COMPLETE')
    );
    expect(BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('REFERENCE_ITERATION_COMPLETE')).toBeLessThan(
      BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('NEXT_REFERENCE_PAGE')
    );
    expect(BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('NEXT_REFERENCE_PAGE')).toBeLessThan(
      BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS.indexOf('HOST_RESULT_EMIT')
    );
  });

  it('produces three distinct Background Proof PoC 001 output paths in reference order', () => {
    const pages = [
      page('cover', 1, 'cover'),
      page('bergen', 2, 'destination'),
      page('workshop', 3, 'workflow'),
      page('notes', 4, 'notes')
    ];
    const references = backgroundProofPoc001ReferencePages(projectWithPages(pages));
    const outputs = references.map((reference) => backgroundProofPoc001OutputPath('/tmp/background-proof/', reference.title));

    expect(references.map((reference) => reference.referenceId)).toEqual([
      'destination',
      'photography-workshop',
      'notes-memory'
    ]);
    expect(outputs).toEqual([
      '/tmp/background-proof/Destination-Background-Proof-PoC-001.pdf',
      '/tmp/background-proof/Photography Workshop-Background-Proof-PoC-001.pdf',
      '/tmp/background-proof/Notes - Memory-Background-Proof-PoC-001.pdf'
    ]);
    expect(new Set(outputs).size).toBe(3);
  });

  it('enumerates the full Background Document export lifecycle in canonical order', () => {
    expect(BACKGROUND_PROOF_POC_001_DOCUMENT_LIFECYCLE_STEPS).toEqual([
      'DOCUMENT_BACKGROUND_START',
      'PAGE_COUNT_RESOLVED',
      'PAGE_ITERATION_START',
      'PAGE_SELECTED',
      'PAGE_READY',
      'PAGE_ASSET_EVIDENCE',
      'PAGE_PROOF_START',
      'PAGE_PROOF_COMPLETE',
      'PAGE_STAGED',
      'PAGE_ITERATION_COMPLETE',
      'DOCUMENT_ASSEMBLY_START',
      'DOCUMENT_ASSEMBLY_COMPLETE',
      'STANDARD_DOCUMENT_READY',
      'PDFA_POSTPROCESS_START',
      'PDFA_POSTPROCESS_COMPLETE',
      'FINAL_OUTPUT_READY',
      'COMPLETE'
    ]);
  });

  it('uses publication order for a 16-page Background Document export source', () => {
    const pages = Array.from({ length: 16 }, (_, index) => page(`page-${String(index + 1).padStart(2, '0')}`, index + 1));
    const project = projectWithPages([...pages].reverse());

    expect(studioDocumentProofPages(project).map((entry) => entry.id)).toEqual(pages.map((entry) => entry.id));
    expect(studioDocumentProofPages(project)).toHaveLength(16);
  });

  it('keeps Background Standard PDF beside the final PDF/A output for comparison', () => {
    expect(backgroundProofPoc001BackgroundStandardOutputPath('/tmp/Norway.pdf')).toBe('/tmp/Norway-background-standard.pdf');
    expect(backgroundProofPoc001BackgroundStandardOutputPath('/tmp/Norway')).toBe('/tmp/Norway-background-standard.pdf');
    expect(backgroundProofPoc001OutputDirForFinalOutputPath('/tmp/Northern Lines/Norway.pdf')).toBe('/tmp/Northern Lines');
  });

  it('keeps the Hidden Host viewport aligned with the visible Main viewport', () => {
    expect(backgroundProofPoc001HiddenHostViewportForMain({ width: 1280, height: 820 })).toEqual({
      width: 1280,
      height: 820
    });
    expect(backgroundProofPoc001HiddenHostViewportForMain({ width: 420, height: 596 })).toEqual({
      width: 980,
      height: 700
    });
    expect(backgroundProofPoc001HiddenHostViewportForMain({ width: Number.NaN, height: 0 })).toEqual({
      width: 980,
      height: 700
    });
  });

  it('detects Background Proof PoC 001 Main Window selected-page drift', () => {
    expect(backgroundProofPoc001MainWindowInvariant('page-bergen', null, 'page-bergen')).toBe(true);
    expect(backgroundProofPoc001MainWindowInvariant('page-bergen', 'page-bergen', 'page-bergen')).toBe(true);
    expect(backgroundProofPoc001MainWindowInvariant('page-bergen', 'page-notes', 'page-bergen')).toBe(false);
    expect(backgroundProofPoc001MainWindowInvariant('page-bergen', null, 'page-notes')).toBe(false);
  });

  it('reports the last Background Proof PoC 001 lifecycle state on lost terminal result', () => {
    expect(backgroundProofPoc001LifecycleTimeoutError('HOST_LOAD_STARTED', 45000, 'hidden-host', 'bootstrap')).toBe(
      'BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT: Hidden Host lieferte kein terminales Ergebnis nach 45000 ms · last=HOST_LOAD_STARTED · component=hidden-host · operation=bootstrap'
    );
  });

  it('keeps normal page fade only outside proof capture and Hidden Host', () => {
    expect(studioPageFadeDurationMs('idle', false)).toBe(190);
    expect(studioPageFadeDurationMs('saved', false)).toBe(190);
    expect(studioPageFadeDurationMs('rendering', false)).toBe(0);
    expect(studioPageFadeDurationMs('idle', true)).toBe(0);
    expect(studioPageFadeDurationMs('preparing', true)).toBe(0);
  });

  it('restores the originally active Studio page after document proof orchestration', () => {
    const pages = [page('a', 1), page('b', 2), page('c', 3)];

    expect(restoredDocumentProofPage(pages, 'b')?.id).toBe('b');
    expect(restoredDocumentProofPage(pages, 'missing')).toBeNull();
  });

  it('rejects stale DOM identity before document proof capture', () => {
    const readiness = evaluateRenderedStudioPageReadiness({
      requestedPageId: 'b',
      selectedPageId: 'b',
      renderedPageId: 'a',
      renderedPageCount: 1,
      display: 'flex',
      visibility: 'visible',
      opacity: 1,
      filter: 'none',
      transform: 'none',
      runningAnimationCount: 0,
      expectProofMode: true
    }, 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY');

    expect(readiness).toEqual({
      ready: false,
      code: 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY',
      reason: 'dom=a count=1 requested=b'
    });
  });

  it('accepts matching selected page and rendered DOM identity', () => {
    expect(evaluateRenderedStudioPageReadiness({
      requestedPageId: 'b',
      selectedPageId: 'b',
      renderedPageId: 'b',
      renderedPageCount: 1,
      display: 'flex',
      visibility: 'visible',
      opacity: 1,
      filter: 'none',
      transform: 'none',
      runningAnimationCount: 0,
      expectProofMode: true
    })).toEqual({ ready: true });
  });

  it('requires the Svelte and browser commit steps before capture', () => {
    expect(STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE.indexOf('svelte-dom-commit')).toBeLessThan(
      STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE.indexOf('capture')
    );
    expect(STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE.indexOf('browser-layout-frame')).toBeLessThan(
      STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE.indexOf('capture')
    );
  });

  it('rejects transitional page opacity and running animations', () => {
    const opacity = evaluateRenderedStudioPageReadiness({
      requestedPageId: 'b',
      selectedPageId: 'b',
      renderedPageId: 'b',
      renderedPageCount: 1,
      display: 'flex',
      visibility: 'visible',
      opacity: 0.42,
      filter: 'none',
      transform: 'none',
      runningAnimationCount: 0,
      expectProofMode: true
    });
    const animation = evaluateRenderedStudioPageReadiness({
      requestedPageId: 'b',
      selectedPageId: 'b',
      renderedPageId: 'b',
      renderedPageCount: 1,
      display: 'flex',
      visibility: 'visible',
      opacity: 1,
      filter: 'none',
      transform: 'none',
      runningAnimationCount: 1,
      expectProofMode: true
    });

    expect(opacity).toMatchObject({ ready: false, reason: 'opacity=0.42' });
    expect(animation).toMatchObject({ ready: false, reason: 'runningAnimations=1' });
  });

  it('does not let stale page images satisfy current page readiness', () => {
    const currentPageImages = incompleteStudioPageImages([
      { complete: true, naturalWidth: 100 },
      { complete: false, naturalWidth: 0 }
    ]);
    const stalePageImages = incompleteStudioPageImages([
      { complete: true, naturalWidth: 100 }
    ]);

    expect(currentPageImages).toHaveLength(1);
    expect(stalePageImages).toHaveLength(0);
  });

  it('restores the originally active Studio page after readiness failure', () => {
    const pages = [page('original', 1), page('failed', 2)];

    expect(restoredDocumentProofPage(pages, 'original')?.id).toBe('original');
  });

  it('keeps Notes proof writing surfaces light in proof-safe CSS', () => {
    const css = fs.readFileSync(path.resolve('src/styles/book-utility-pages.css'), 'utf8');

    expect(css).toContain('--notes-surface: color-mix(in srgb, var(--world-accent, #547181) 2.5%, #fff);');
    expect(css).toContain('background-image: repeating-linear-gradient(to bottom, var(--notes-surface) 0');
    expect(css).toContain('background-image: radial-gradient(circle, var(--notes-dot) .7px, var(--notes-surface) .8px);');
    expect(css).not.toMatch(/\.notes-(?:lines|mini-lines|dot-grid)[\s\S]*?color-mix\([^;]*transparent/);
  });

  it('leaves the existing Photography Workshop proof styling untouched', () => {
    const css = fs.readFileSync(path.resolve('src/styles/travel-companion-workshop.css'), 'utf8');

    expect(css).toContain('.photography-workshop-preview');
    expect(css).toContain('.photography-workshop-flow');
  });
});
