import { describe, expect, it } from 'vitest';
import { journeyDurationDays, journeyDurationLabel, travelFocusValues } from './index';

describe('journey planning', () => {
  it('derives an inclusive travel duration', () => {
    expect(journeyDurationDays('2026-07-26', '2026-08-02')).toBe(8);
    expect(journeyDurationLabel('2026-07-26', '2026-08-02')).toBe('8 Tage');
  });

  it('keeps incomplete planning calm', () => {
    expect(journeyDurationLabel('2026-07-26')).toBe('Noch offen');
  });

  it('normalizes Travel Language focus values', () => {
    expect(travelFocusValues('Fotografie · Entdecken, Erinnerungen')).toEqual([
      'Fotografie',
      'Entdecken',
      'Erinnerungen'
    ]);
  });
});
