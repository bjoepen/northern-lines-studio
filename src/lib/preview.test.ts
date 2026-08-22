import { describe, expect, it } from 'vitest';
import { computePreviewScale, PREVIEW_A5_EXTENSION, PREVIEW_BASE_HEIGHT, PREVIEW_BASE_WIDTH, PREVIEW_GOLDEN_HEIGHT, PREVIEW_MAX_SCALE } from './preview';

describe('responsive A5 preview', () => {

  it('uses an exact DIN A5 logical page ratio while preserving the 594-unit golden composition', () => {
    expect(PREVIEW_BASE_WIDTH).toBe(420);
    expect(PREVIEW_GOLDEN_HEIGHT).toBe(594);
    expect(PREVIEW_BASE_HEIGHT).toBeCloseTo(420 * 210 / 148, 12);
    expect(PREVIEW_BASE_WIDTH / PREVIEW_BASE_HEIGHT).toBeCloseTo(148 / 210, 12);
    expect(PREVIEW_A5_EXTENSION).toBeCloseTo((420 * 210 / 148) - 594, 12);
  });
  it('preserves proportional scaling by returning one uniform scale', () => {
    expect(computePreviewScale(900, 900)).toBeGreaterThan(1);
  });

  it('is constrained by the smaller available axis', () => {
    const wide = computePreviewScale(1400, 650);
    const tall = computePreviewScale(650, 1400);
    expect(wide).not.toBe(tall);
  });

  it('never exceeds the calm maximum preview scale', () => {
    expect(computePreviewScale(4000, 4000)).toBe(PREVIEW_MAX_SCALE);
  });

  it('remains usable in a compact workspace', () => {
    expect(computePreviewScale(300, 420)).toBeGreaterThanOrEqual(0.50);
  });

  it('uses the additional space of a maximized editorial desk without becoming oversized', () => {
    const scale = computePreviewScale(1200, 800);
    expect(scale).toBeGreaterThan(1.2);
    expect(scale).toBeLessThanOrEqual(PREVIEW_MAX_SCALE);
  });
});
