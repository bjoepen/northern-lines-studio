import { describe, expect, it } from 'vitest';
import { EDITORIAL_EXTENSION_DEFINITIONS, editorialExtensionDefinition } from './index';

describe('Editorial Extension Zones', () => {
  it('defines the six approved semantic extensions', () => {
    expect(EDITORIAL_EXTENSION_DEFINITIONS.map((entry) => entry.kind)).toEqual([
      'knowledge', 'photo_spot', 'tip', 'souvenir', 'important', 'history'
    ]);
  });

  it('keeps signets semantic rather than decorative', () => {
    expect(editorialExtensionDefinition('knowledge').signet).toBe('knowledge');
    expect(editorialExtensionDefinition('photo_spot').label).toBe('Fotospot');
  });
});
