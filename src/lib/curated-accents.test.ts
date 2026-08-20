import { describe, expect, it } from 'vitest';
import { curatedAccentFor } from './curated-accents';

describe('curated accents', () => {
  it('maps Fjord memories accent', () => {
    expect(curatedAccentFor('fjord', 'notes')).toContain('/fjord/curated-accents/notes.png');
  });

  it('maps Ostsee memories accent', () => {
    expect(curatedAccentFor('baltic', 'notes')).toContain('/baltic/curated-accents/notes.png');
  });

  it('does not fall back across worlds', () => {
    expect(curatedAccentFor(undefined, 'notes')).toBeNull();
    expect(curatedAccentFor('unknown', 'notes')).toBeNull();
  });
});
