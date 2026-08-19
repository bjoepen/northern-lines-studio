export type CuratedAccentKey = 'contents' | 'notes';

const FJORD_CURATED_ACCENTS: Record<CuratedAccentKey, string> = {
  contents: '/design-library/worlds/fjord/curated-accents/contents.png',
  notes: '/design-library/worlds/fjord/curated-accents/notes.png'
};

const BALTIC_CURATED_ACCENTS: Record<CuratedAccentKey, string> = {
  contents: '/design-library/worlds/baltic/curated-accents/contents.png',
  notes: '/design-library/worlds/baltic/curated-accents/notes.png'
};

const CURATED_ACCENTS_BY_WORLD: Partial<Record<string, Record<CuratedAccentKey, string>>> = {
  fjord: FJORD_CURATED_ACCENTS,
  baltic: BALTIC_CURATED_ACCENTS
};

export function curatedAccentFor(
  worldId: string | undefined,
  key: CuratedAccentKey
): string | null {
  if (!worldId) return null;
  return CURATED_ACCENTS_BY_WORLD[worldId]?.[key] ?? null;
}
