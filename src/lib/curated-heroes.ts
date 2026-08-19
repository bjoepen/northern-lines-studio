import type { DestinationInterestKind } from './project';

export type CuratedHeroKey = DestinationInterestKind | 'photography_workshop';

const FJORD_CURATED_HEROES: Record<CuratedHeroKey, string> = {
  photography: '/design-library/worlds/fjord/curated-heroes/photography.png',
  hiking_nature: '/design-library/worlds/fjord/curated-heroes/hiking-nature.png',
  culture_history: '/design-library/worlds/fjord/curated-heroes/culture-history.png',
  culinary_local: '/design-library/worlds/fjord/curated-heroes/culinary-local.png',
  photography_workshop: '/design-library/worlds/fjord/curated-heroes/photography-workshop.png'
};

export function curatedHeroFor(worldId: string | undefined, key: CuratedHeroKey): string | null {
  return worldId === 'fjord' ? FJORD_CURATED_HEROES[key] : null;
}
