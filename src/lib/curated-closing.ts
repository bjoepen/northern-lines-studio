export function curatedClosingHeroFor(worldId: string | undefined): string | null {
  if (worldId === 'fjord') return '/design-library/worlds/fjord/curated-heroes/closing.png';
  if (worldId === 'baltic') return '/design-library/worlds/baltic/curated-heroes/closing.png';
  return null;
}
