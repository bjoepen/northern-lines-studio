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
