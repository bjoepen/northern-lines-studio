import { describe, expect, it } from 'vitest';
import { curatedAccentFor } from './curated-accents';

describe('curated accents', () => {
  it('maps Fjord accents', () => {
    expect(curatedAccentFor('fjord', 'contents')).toContain('/fjord/curated-accents/contents.png');
    expect(curatedAccentFor('fjord', 'notes')).toContain('/fjord/curated-accents/notes.png');
  });

  it('maps Ostsee accents', () => {
    expect(curatedAccentFor('baltic', 'contents')).toContain('/baltic/curated-accents/contents.png');
    expect(curatedAccentFor('baltic', 'notes')).toContain('/baltic/curated-accents/notes.png');
  });

  it('does not fall back across worlds', () => {
    expect(curatedAccentFor(undefined, 'contents')).toBeNull();
    expect(curatedAccentFor('unknown', 'notes')).toBeNull();
  });
});
