import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  assembleStudioDocumentPdfProof,
  backgroundProofPoc001ReferencePages,
  cleanupStudioDocumentPdfProof,
  createStudioPdfProof,
  evaluateRenderedStudioPageReadiness,
  exportStudioPdfA2b,
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
