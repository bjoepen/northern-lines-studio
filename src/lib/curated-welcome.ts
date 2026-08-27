const CURATED_WELCOME_HERO_BY_WORLD: Partial<Record<string, string>> = {
  fjord: '/design-library/worlds/fjord/curated-heroes/welcome.png',
  baltic: '/design-library/worlds/baltic/curated-heroes/welcome.png'
};

export function curatedWelcomeHeroFor(worldId: string | undefined): string | null {
  if (!worldId) return null;
  return CURATED_WELCOME_HERO_BY_WORLD[worldId] ?? null;
}
