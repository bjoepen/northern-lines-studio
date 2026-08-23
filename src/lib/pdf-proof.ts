import { invoke } from '@tauri-apps/api/core';
import type { StudioPage, StudioProject } from './project';
import { publicationOrderedPages } from './workspace';

export type StudioPdfProofStatus = 'idle' | 'preparing' | 'rendering' | 'saved' | 'error';
export type StudioPdfProofReadinessErrorCode =
  | 'PDF_PROOF_NO_PAGE'
  | 'PDF_DOCUMENT_PROOF_PAGE_NOT_READY';

export interface StudioPdfProofRequest {
  pageId: string;
  physicalMedium: 'A5';
  outputPath: string;
}

export interface StudioPdfProofResult {
  outputPath: string;
  widthPt: number;
  heightPt: number;
}

export interface StudioDocumentProofStagingRequest {
  pageCount: number;
}

export interface StudioDocumentProofStagingResult {
  stagingPath: string;
}

export interface StudioDocumentProofPage {
  index: number;
  pageId: string;
  title: string;
  stagedPath: string;
}

export interface StudioDocumentProofRequest {
  outputPath: string;
  stagingPath: string;
  pages: StudioDocumentProofPage[];
}

export interface StudioDocumentProofResult {
  outputPath: string;
  pageCount: number;
  widthPt: number;
  heightPt: number;
}

export interface StudioPdfA2bExportRequest {
  sourcePath: string;
  outputPath: string;
}

export interface StudioPdfA2bExportResult {
  outputPath: string;
  pageCount: number;
  profile: 'PDF/A-2b';
}

export type BackgroundProofPoc001ReferenceId =
  | 'destination'
  | 'photography-workshop'
  | 'notes-memory';

export interface BackgroundProofPoc001ReferencePage {
  referenceId: BackgroundProofPoc001ReferenceId;
  title: string;
  page: StudioPage;
}

export interface BackgroundProofPoc001HostParams {
  isHost: boolean;
  projectPath: string;
  outputDir: string;
  finalOutputPath: string;
  jobId: string;
  returnTo: string;
  mode: 'reference-pages' | 'document-pdfa2b';
}

export function studioPageFadeDurationMs(
  status: StudioPdfProofStatus,
  isBackgroundProofPocHost = false
): number {
  return status === 'rendering' || isBackgroundProofPocHost ? 0 : 190;
}

function backgroundProofPoc001ProofFileTitle(value: string): string {
  return value.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'Northern-Lines-Studio';
}

export function backgroundProofPoc001OutputPath(outputDir: string, title: string): string {
  return `${outputDir.replace(/\/$/, '')}/${backgroundProofPoc001ProofFileTitle(title)}-Background-Proof-PoC-001.pdf`;
}

export function backgroundProofPoc001StandardDocumentPath(stagingPath: string): string {
  return `${stagingPath.replace(/\/$/, '')}/travelbook-standard.pdf`;
}

export function backgroundProofPoc001BackgroundStandardOutputPath(finalOutputPath: string): string {
  const normalized = finalOutputPath.trim();
  if (normalized.toLowerCase().endsWith('.pdf')) {
    return `${normalized.slice(0, -4)}-background-standard.pdf`;
  }
  return `${normalized}-background-standard.pdf`;
}

export function backgroundProofPoc001OutputDirForFinalOutputPath(finalOutputPath: string): string {
  const normalized = finalOutputPath.trim().replace(/\/+$/, '');
  const separatorIndex = normalized.lastIndexOf('/');
  return separatorIndex > 0 ? normalized.slice(0, separatorIndex) : '';
}

export interface BackgroundProofPoc001ViewportSize {
  width: number;
  height: number;
}

export const BACKGROUND_PROOF_POC_001_MIN_HOST_VIEWPORT: BackgroundProofPoc001ViewportSize = {
  width: 980,
  height: 700
};

export function backgroundProofPoc001HiddenHostViewportForMain(
  viewport: Partial<BackgroundProofPoc001ViewportSize>
): BackgroundProofPoc001ViewportSize {
  const rawWidth = viewport.width ?? 0;
  const rawHeight = viewport.height ?? 0;
  const width = Number.isFinite(rawWidth) && rawWidth > 0 ? Math.ceil(rawWidth) : 0;
  const height = Number.isFinite(rawHeight) && rawHeight > 0 ? Math.ceil(rawHeight) : 0;
  return {
    width: Math.max(width, BACKGROUND_PROOF_POC_001_MIN_HOST_VIEWPORT.width),
    height: Math.max(height, BACKGROUND_PROOF_POC_001_MIN_HOST_VIEWPORT.height)
  };
}

export const BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS = [
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
] as const;

export const BACKGROUND_PROOF_POC_001_DOCUMENT_LIFECYCLE_STEPS = [
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
] as const;

export type BackgroundProofPoc001LifecycleStep =
  | typeof BACKGROUND_PROOF_POC_001_LIFECYCLE_STEPS[number]
  | typeof BACKGROUND_PROOF_POC_001_DOCUMENT_LIFECYCLE_STEPS[number];

export interface BackgroundProofPoc001LifecycleEvent {
  jobId: string;
  step: BackgroundProofPoc001LifecycleStep;
  source: 'main' | 'hidden-host' | 'rust';
  component?: string;
  operation?: string;
  pageId?: string | null;
  referenceTitle?: string;
  detail?: string;
  timestampMs: number;
}

export interface BackgroundProofPoc001Result {
  ok: boolean;
  outputs?: string[];
  standardOutputPath?: string;
  finalOutputPath?: string;
  pageCount?: number;
  error?: string;
  lastStep?: BackgroundProofPoc001LifecycleStep;
}

export interface BackgroundProofPoc001OutputEvidence {
  exists: boolean;
  byteLength: number;
}

export function backgroundProofPoc001EventNames(jobId: string): {
  native: string;
  lifecycle: string;
  progress: string;
  result: string;
} {
  return {
    native: 'background-proof-poc-001-native-trace',
    lifecycle: `background-proof-poc-001-lifecycle-${jobId}`,
    progress: `background-proof-poc-001-progress-${jobId}`,
    result: `background-proof-poc-001-result-${jobId}`
  };
}

export function backgroundProofPoc001ParseHostParams(search: string): BackgroundProofPoc001HostParams {
  const params = new URLSearchParams(search);
  return {
    isHost: params.get('nlsBackgroundProofPoc') === '001',
    projectPath: params.get('projectPath') ?? '',
    outputDir: params.get('outputDir') ?? '',
    finalOutputPath: params.get('finalOutputPath') ?? params.get('outputPath') ?? '',
    jobId: params.get('jobId') ?? '',
    returnTo: params.get('returnTo') ?? 'main',
    mode: params.get('mode') === 'document-pdfa2b' ? 'document-pdfa2b' : 'reference-pages'
  };
}

export function backgroundProofPoc001HostRequestIsComplete(params: BackgroundProofPoc001HostParams): boolean {
  if (!params.isHost || !params.projectPath || !params.outputDir || !params.jobId || !params.returnTo) {
    return false;
  }
  if (params.mode === 'document-pdfa2b') {
    return Boolean(params.finalOutputPath);
  }
  return true;
}

export function backgroundProofPoc001BuildHostUrl(
  currentHref: string,
  params: Omit<BackgroundProofPoc001HostParams, 'isHost'>
): string {
  const hostUrl = new URL(currentHref);
  hostUrl.search = '';
  hostUrl.hash = '';
  hostUrl.searchParams.set('nlsBackgroundProofPoc', '001');
  hostUrl.searchParams.set('projectPath', params.projectPath);
  hostUrl.searchParams.set('outputDir', params.outputDir);
  if ('finalOutputPath' in params && typeof params.finalOutputPath === 'string') {
    hostUrl.searchParams.set('finalOutputPath', params.finalOutputPath);
  }
  hostUrl.searchParams.set('jobId', params.jobId);
  hostUrl.searchParams.set('returnTo', params.returnTo);
  if ('mode' in params && typeof params.mode === 'string') {
    hostUrl.searchParams.set('mode', params.mode);
  }
  return hostUrl.href;
}

export function backgroundProofPoc001SafeTraceValue(value: string, maxLength = 96): string {
  if (!value) return '';
  const shortened = value.length > maxLength ? `...${value.slice(-(maxLength - 3))}` : value;
  return shortened.replace(/[\n\r\t]/g, ' ');
}

export function backgroundProofPoc001MainWindowInvariant(
  beforePageId: string | null,
  duringPageId: string | null,
  afterPageId: string | null
): boolean {
  return beforePageId === afterPageId && (duringPageId === null || duringPageId === beforePageId);
}

export function backgroundProofPoc001LifecycleTimeoutError(
  lastStep: BackgroundProofPoc001LifecycleStep | null,
  timeoutMs: number,
  component = '',
  operation = ''
): string {
  return [
    `BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT: Hidden Host lieferte kein terminales Ergebnis nach ${timeoutMs} ms`,
    `last=${lastStep ?? 'none'}`,
    component ? `component=${component}` : '',
    operation ? `operation=${operation}` : ''
  ].filter(Boolean).join(' · ');
}

export interface RenderedStudioPageReadinessSnapshot {
  requestedPageId: string;
  selectedPageId: string | null;
  renderedPageId: string | null;
  renderedPageCount: number;
  display: string;
  visibility: string;
  opacity: number;
  filter: string;
  transform: string;
  runningAnimationCount: number;
  expectProofMode: boolean;
}

export interface RenderedStudioPageReadinessFailure {
  ready: false;
  code: StudioPdfProofReadinessErrorCode;
  reason: string;
}

export interface RenderedStudioPageReadinessSuccess {
  ready: true;
}

export type RenderedStudioPageReadinessResult =
  | RenderedStudioPageReadinessSuccess
  | RenderedStudioPageReadinessFailure;

export const STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE = [
  'select-page',
  'svelte-dom-commit',
  'browser-layout-frame',
  'rendered-page-identity',
  'fonts-ready',
  'current-page-images-ready',
  'visual-stability',
  'proof-mode',
  'svelte-dom-commit',
  'browser-layout-frame',
  'rendered-page-identity',
  'capture'
] as const;

export function createStudioPdfProof(
  request: StudioPdfProofRequest,
  invokeCommand: typeof invoke = invoke
): Promise<StudioPdfProofResult> {
  return invokeCommand<StudioPdfProofResult>('create_studio_pdf_proof', { request });
}

export function prepareStudioDocumentPdfProof(
  request: StudioDocumentProofStagingRequest,
  invokeCommand: typeof invoke = invoke
): Promise<StudioDocumentProofStagingResult> {
  return invokeCommand<StudioDocumentProofStagingResult>('prepare_studio_document_pdf_proof', { request });
}

export function assembleStudioDocumentPdfProof(
  request: StudioDocumentProofRequest,
  invokeCommand: typeof invoke = invoke
): Promise<StudioDocumentProofResult> {
  return invokeCommand<StudioDocumentProofResult>('assemble_studio_document_pdf_proof', { request });
}

export function cleanupStudioDocumentPdfProof(
  stagingPath: string,
  invokeCommand: typeof invoke = invoke
): Promise<void> {
  return invokeCommand<void>('cleanup_studio_document_pdf_proof', { stagingPath });
}

export function exportStudioPdfA2b(
  request: StudioPdfA2bExportRequest,
  invokeCommand: typeof invoke = invoke
): Promise<StudioPdfA2bExportResult> {
  return invokeCommand<StudioPdfA2bExportResult>('export_studio_pdfa2b', { request });
}

export function studioDocumentProofPages(project: StudioProject | null): StudioPage[] {
  if (!project) return [];
  return publicationOrderedPages(
    project.pageManifest,
    project.journey?.stages.map((stage) => stage.id) ?? []
  );
}

export function backgroundProofPoc001ReferencePages(project: StudioProject): BackgroundProofPoc001ReferencePage[] {
  const pages = studioDocumentProofPages(project);
  const destination = pages.find((page) => page.type === 'destination') ?? null;
  const photographyWorkshop = pages.find((page) => page.type === 'workflow') ?? null;
  const notesMemory = pages.find((page) => page.type === 'notes') ?? null;

  return [
    destination ? { referenceId: 'destination', title: 'Destination', page: destination } : null,
    photographyWorkshop ? { referenceId: 'photography-workshop', title: 'Photography Workshop', page: photographyWorkshop } : null,
    notesMemory ? { referenceId: 'notes-memory', title: 'Notes / Memory', page: notesMemory } : null
  ].filter((entry): entry is BackgroundProofPoc001ReferencePage => entry !== null);
}

export function stagedDocumentProofPagePath(stagingPath: string, index: number): string {
  return `${stagingPath}/${String(index).padStart(4, '0')}.pdf`;
}

export function restoredDocumentProofPage(
  pages: StudioPage[],
  originalPageId: string | null
): StudioPage | null {
  if (!originalPageId) return null;
  return pages.find((page) => page.id === originalPageId) ?? null;
}

export function evaluateRenderedStudioPageReadiness(
  snapshot: RenderedStudioPageReadinessSnapshot,
  code: StudioPdfProofReadinessErrorCode = 'PDF_PROOF_NO_PAGE'
): RenderedStudioPageReadinessResult {
  if (snapshot.selectedPageId !== snapshot.requestedPageId) {
    return {
      ready: false,
      code,
      reason: `selected=${snapshot.selectedPageId ?? 'none'} requested=${snapshot.requestedPageId}`
    };
  }
  if (snapshot.renderedPageId !== snapshot.requestedPageId || snapshot.renderedPageCount !== 1) {
    return {
      ready: false,
      code,
      reason: `dom=${snapshot.renderedPageId ?? 'none'} count=${snapshot.renderedPageCount} requested=${snapshot.requestedPageId}`
    };
  }
  if (snapshot.display === 'none' || snapshot.visibility !== 'visible') {
    return {
      ready: false,
      code,
      reason: `display=${snapshot.display} visibility=${snapshot.visibility}`
    };
  }
  if (Math.abs(snapshot.opacity - 1) > 0.001) {
    return {
      ready: false,
      code,
      reason: `opacity=${snapshot.opacity}`
    };
  }
  if (snapshot.filter !== 'none') {
    return {
      ready: false,
      code,
      reason: `filter=${snapshot.filter}`
    };
  }
  if (snapshot.runningAnimationCount > 0) {
    return {
      ready: false,
      code,
      reason: `runningAnimations=${snapshot.runningAnimationCount}`
    };
  }
  if (snapshot.expectProofMode && snapshot.transform !== 'none') {
    return {
      ready: false,
      code,
      reason: `proofTransform=${snapshot.transform}`
    };
  }
  return { ready: true };
}

export function incompleteStudioPageImages<T extends { complete: boolean; naturalWidth: number }>(
  images: T[]
): T[] {
  return images.filter((image) => !image.complete || image.naturalWidth <= 0);
}
