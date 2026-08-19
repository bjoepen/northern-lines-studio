import { describe, expect, it } from 'vitest';
import { CURATED_WORKSHOP_BRIDGE, CURATED_WORKSHOP_SOURCES, CURATED_WORKSHOP_WORLDS } from './travel-companion-workshop';

describe('Travel Companion · Fotografie-Workshop', () => {
  it('keeps exactly four curated decision worlds', () => {
    expect(CURATED_WORKSHOP_WORLDS.map((world) => world.id)).toEqual(['see', 'compose', 'expose', 'travel']);
  });

  it('stays program-neutral and curated', () => {
    const text = JSON.stringify(CURATED_WORKSHOP_WORLDS);
    expect(text).not.toMatch(/Luminar|ON1|Lightroom|Photoshop/i);
    expect(CURATED_WORKSHOP_BRIDGE).toContain('Licht und Wetter');
  });

  it('keeps research provenance', () => {
    expect(CURATED_WORKSHOP_SOURCES.some((source) => source.publisher === 'Nikon USA')).toBe(true);
    expect(CURATED_WORKSHOP_SOURCES.some((source) => source.publisher === 'Adobe')).toBe(true);
  });
});
