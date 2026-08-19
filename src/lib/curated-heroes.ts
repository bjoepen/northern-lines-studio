import type { DestinationInterestKind } from './project';

export type CuratedHeroKey = DestinationInterestKind | 'photography_workshop';

const FJORD_CURATED_HEROES: Record<CuratedHeroKey, string> = {
  photography: '/design-library/worlds/fjord/curated-heroes/photography.png',
  hiking_nature: '/design-library/worlds/fjord/curated-heroes/hiking-nature.png',
  culture_history: '/design-library/worlds/fjord/curated-heroes/culture-history.png',
  culinary_local: '/design-library/worlds/fjord/curated-heroes/culinary-local.png',
  photography_workshop: '/design-library/worlds/fjord/curated-heroes/photography-workshop.png'
};

const BALTIC_CURATED_HEROES: Record<CuratedHeroKey, string> = {
  photography: '/design-library/worlds/baltic/curated-heroes/photography.png',
  hiking_nature: '/design-library/worlds/baltic/curated-heroes/hiking-nature.png',
  culture_history: '/design-library/worlds/baltic/curated-heroes/culture-history.png',
  culinary_local: '/design-library/worlds/baltic/curated-heroes/culinary-local.png',
  photography_workshop: '/design-library/worlds/baltic/curated-heroes/photography-workshop.png'
};

const CURATED_HEROES_BY_WORLD: Partial<Record<string, Record<CuratedHeroKey, string>>> = {
  fjord: FJORD_CURATED_HEROES,
  baltic: BALTIC_CURATED_HEROES
};

export function curatedHeroFor(worldId: string | undefined, key: CuratedHeroKey): string | null {
  if (!worldId) return null;
  return CURATED_HEROES_BY_WORLD[worldId]?.[key] ?? null;
}
