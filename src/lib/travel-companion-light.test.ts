import { describe, expect, it } from 'vitest';
import { CURATED_LIGHT_GUIDANCE, CURATED_LIGHT_PHASES, CURATED_LIGHT_SOURCES } from './travel-companion-light';

describe('Travel Companion · Licht', () => {
  it('ships a small curated core instead of destination-specific copies', () => {
    expect(CURATED_LIGHT_PHASES.map((phase) => phase.id)).toEqual(['golden', 'blue', 'civil', 'cloud']);
    expect(CURATED_LIGHT_PHASES.every((phase) => phase.label && phase.description && phase.photography)).toBe(true);
    expect(CURATED_LIGHT_GUIDANCE).toHaveLength(3);
  });

  it('keeps research provenance with the curated knowledge', () => {
    expect(CURATED_LIGHT_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(CURATED_LIGHT_SOURCES.some((source) => source.publisher.includes('NOAA'))).toBe(true);
    expect(CURATED_LIGHT_SOURCES.some((source) => source.publisher.includes('Met Office'))).toBe(true);
    expect(CURATED_LIGHT_SOURCES.some((source) => source.publisher.includes('timeanddate'))).toBe(true);
  });
});
