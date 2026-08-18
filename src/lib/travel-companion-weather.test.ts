import { describe, expect, it } from 'vitest';
import { CURATED_WEATHER_SITUATIONS, CURATED_WEATHER_SOURCES } from './travel-companion-weather';

describe('Travel Companion · Wetter', () => {
  it('ships four general, reusable weather situations', () => {
    expect(CURATED_WEATHER_SITUATIONS.map((item) => item.id)).toEqual(['rain', 'wind', 'fog', 'cloud']);
    expect(CURATED_WEATHER_SITUATIONS.every((item) => item.label && item.description && item.travel)).toBe(true);
  });

  it('keeps authoritative research provenance with the curated core', () => {
    expect(CURATED_WEATHER_SOURCES.length).toBeGreaterThanOrEqual(5);
    expect(CURATED_WEATHER_SOURCES.some((source) => source.publisher === 'Met Office')).toBe(true);
    expect(CURATED_WEATHER_SOURCES.some((source) => source.publisher.includes('NOAA'))).toBe(true);
  });
});
