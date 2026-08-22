import { describe, expect, it, vi } from 'vitest';
import {
  assembleStudioDocumentPdfProof,
  cleanupStudioDocumentPdfProof,
  createStudioPdfProof,
  evaluateRenderedStudioPageReadiness,
  incompleteStudioPageImages,
  prepareStudioDocumentPdfProof,
  restoredDocumentProofPage,
  STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE,
  stagedDocumentProofPagePath,
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

  it('uses the actual Studio page manifest order without deriving from page type', () => {
    const pages = [
      page('destination-b', 20, 'destination'),
      page('cover-late', 10, 'cover'),
      page('notes-middle', 30, 'notes')
    ];

    expect(studioDocumentProofPages(projectWithPages(pages)).map((entry) => entry.id)).toEqual([
      'destination-b',
      'cover-late',
      'notes-middle'
    ]);
  });

  it('supports variable page counts and deterministic staged filenames', () => {
    const pages = [page('a', 1), page('b', 2), page('c', 3), page('d', 4), page('e', 5)];

    expect(studioDocumentProofPages(projectWithPages(pages))).toHaveLength(5);
    expect(stagedDocumentProofPagePath('/tmp/document-proof', 1)).toBe('/tmp/document-proof/0001.pdf');
    expect(stagedDocumentProofPagePath('/tmp/document-proof', 12)).toBe('/tmp/document-proof/0012.pdf');
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
});
