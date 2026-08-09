import { describe, expect, it } from 'vitest';
import { companionVisibleForRole, fjordCompanionLayout } from './layout';

describe('companion layout foundation', () => {
  it('keeps the Fjord companion out of front matter', () => {
    expect(companionVisibleForRole(fjordCompanionLayout, 'front_matter')).toBe(false);
  });

  it('introduces the companion with journey planning', () => {
    expect(companionVisibleForRole(fjordCompanionLayout, 'journey_planning')).toBe(true);
  });

  it('keeps the first foundation deliberately fixed', () => {
    expect(fjordCompanionLayout.placement).toBe('bottom-left');
    expect(fjordCompanionLayout.pose).toBe('default');
    expect(fjordCompanionLayout.mirror).toBe(false);
    expect(fjordCompanionLayout.scale).toBe('small');
  });

  it('lets the companion accompany the journey after planning begins', () => {
    for (const role of ['destination', 'journey_knowledge', 'workflow', 'notes', 'closing_memory'] as const) {
      expect(companionVisibleForRole(fjordCompanionLayout, role)).toBe(true);
    }
  });
});
