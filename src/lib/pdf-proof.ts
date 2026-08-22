import { invoke } from '@tauri-apps/api/core';
import type { StudioPage, StudioProject } from './project';

export type StudioPdfProofStatus = 'idle' | 'preparing' | 'rendering' | 'saved' | 'error';

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

export function studioDocumentProofPages(project: StudioProject | null): StudioPage[] {
  return project?.pageManifest ?? [];
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
