export const INSPECTOR_DEFAULT_WIDTH = 320;
export const INSPECTOR_MIN_WIDTH = 320;
export const INSPECTOR_MAX_WIDTH = 440;
export const WORKSPACE_SIDEBAR_WIDTH = 264;
export const WORKSPACE_CANVAS_MIN_WIDTH = 360;
export const INSPECTOR_WIDTH_STORAGE_KEY = 'northern-lines-studio.inspector-width';

export function inspectorMaximumWidth(viewportWidth: number): number {
  const available = Math.floor(viewportWidth - WORKSPACE_SIDEBAR_WIDTH - WORKSPACE_CANVAS_MIN_WIDTH);
  return Math.max(INSPECTOR_MIN_WIDTH, Math.min(INSPECTOR_MAX_WIDTH, available));
}

export function clampInspectorWidth(width: number, viewportWidth: number): number {
  return Math.max(INSPECTOR_MIN_WIDTH, Math.min(inspectorMaximumWidth(viewportWidth), Math.round(width)));
}

export function parseStoredInspectorWidth(value: string | null, viewportWidth: number): number {
  const parsed = value === null ? Number.NaN : Number(value);
  return clampInspectorWidth(Number.isFinite(parsed) ? parsed : INSPECTOR_DEFAULT_WIDTH, viewportWidth);
}
