import { describe, expect, it } from 'vitest';
import { computePreviewScale, PREVIEW_MAX_SCALE } from './preview';

describe('responsive A5 preview', () => {
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
    expect(computePreviewScale(300, 420)).toBeGreaterThanOrEqual(0.55);
  });
});
