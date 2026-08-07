export const PREVIEW_BASE_WIDTH = 420;
export const PREVIEW_BASE_HEIGHT = 594;
export const PREVIEW_MAX_SCALE = 1.35;
export const PREVIEW_MIN_SCALE = 0.55;
export const PREVIEW_PADDING = 24;

export function computePreviewScale(
  containerWidth: number,
  containerHeight: number,
  baseWidth = PREVIEW_BASE_WIDTH,
  baseHeight = PREVIEW_BASE_HEIGHT,
  padding = PREVIEW_PADDING,
  maxScale = PREVIEW_MAX_SCALE,
  minScale = PREVIEW_MIN_SCALE
): number {
  if (containerWidth <= 0 || containerHeight <= 0) return 1;

  const usableWidth = Math.max(0, containerWidth - padding * 2);
  const usableHeight = Math.max(0, containerHeight - padding * 2);
  const scale = Math.min(usableWidth / baseWidth, usableHeight / baseHeight, maxScale);

  return Math.max(minScale, scale);
}
