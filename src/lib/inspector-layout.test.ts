import { describe, expect, it } from 'vitest';
import { clampInspectorWidth, inspectorMaximumWidth, parseStoredInspectorWidth } from './inspector-layout';

describe('inspector workspace sizing', () => {
  it('keeps the normal inspector between 320 and 440 px', () => {
    expect(clampInspectorWidth(100, 1280)).toBe(320);
    expect(clampInspectorWidth(390, 1280)).toBe(390);
    expect(clampInspectorWidth(900, 1280)).toBe(440);
  });

  it('protects canvas space on narrower windows', () => {
    expect(inspectorMaximumWidth(1040)).toBe(416);
    expect(clampInspectorWidth(440, 1040)).toBe(416);
  });

  it('restores a local preference without trusting invalid values', () => {
    expect(parseStoredInspectorWidth('400', 1280)).toBe(400);
    expect(parseStoredInspectorWidth('nope', 1280)).toBe(320);
  });
});
