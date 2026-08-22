import { invoke } from '@tauri-apps/api/core';

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

export function createStudioPdfProof(
  request: StudioPdfProofRequest,
  invokeCommand: typeof invoke = invoke
): Promise<StudioPdfProofResult> {
  return invokeCommand<StudioPdfProofResult>('create_studio_pdf_proof', { request });
}
