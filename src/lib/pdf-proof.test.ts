import { describe, expect, it, vi } from 'vitest';
import { createStudioPdfProof } from './pdf-proof';

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
});
