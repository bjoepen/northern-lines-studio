import { describe, expect, it } from 'vitest';
import {
  balticCompanionLayout,
  fjordCompanionLayout,
  mediterraneanCompanionLayout,
  loadCompanionLayout,
  requireCompanionLayout
} from './layout';

describe('Companion layout registry', () => {
  it('resolves registered World companion layouts by stable layout id', () => {
    expect(loadCompanionLayout('fjord-companion-layout')).toBe(fjordCompanionLayout);
    expect(loadCompanionLayout('baltic-companion-layout')).toBe(balticCompanionLayout);
    expect(loadCompanionLayout('mediterranean-companion-layout')).toBe(mediterraneanCompanionLayout);
  });

  it('returns null for unknown layouts and fails closed when required', () => {
    expect(loadCompanionLayout('unknown')).toBeNull();
    expect(() => requireCompanionLayout('unknown')).toThrow('Unbekanntes Companion Layout');
  });
});
