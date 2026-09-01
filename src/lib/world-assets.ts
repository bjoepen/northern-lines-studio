import type { DestinationInterestKind } from './project';

export type CuratedHeroKey = DestinationInterestKind | 'photography_workshop';
export type CuratedAccentKey = 'notes';

export interface WorldAssetManifest {
  curatedHeroes: Readonly<Record<CuratedHeroKey, string>>;
  welcomeHero: string;
  closingHero: string;
  curatedAccents: Readonly<Record<CuratedAccentKey, string>>;
}

const fjordAssets: WorldAssetManifest = {
  curatedHeroes: {
    photography: '/design-library/worlds/fjord/curated-heroes/photography.png',
    hiking_nature: '/design-library/worlds/fjord/curated-heroes/hiking-nature.png',
    culture_history: '/design-library/worlds/fjord/curated-heroes/culture-history.png',
    culinary_local: '/design-library/worlds/fjord/curated-heroes/culinary-local.png',
    photography_workshop: '/design-library/worlds/fjord/curated-heroes/photography-workshop.png'
  },
  welcomeHero: '/design-library/worlds/fjord/curated-heroes/welcome.png',
  closingHero: '/design-library/worlds/fjord/curated-heroes/closing.png',
  curatedAccents: {
    notes: '/design-library/worlds/fjord/curated-accents/notes.png'
  }
};

const balticAssets: WorldAssetManifest = {
  curatedHeroes: {
    photography: '/design-library/worlds/baltic/curated-heroes/photography.png',
    hiking_nature: '/design-library/worlds/baltic/curated-heroes/hiking-nature.png',
    culture_history: '/design-library/worlds/baltic/curated-heroes/culture-history.png',
    culinary_local: '/design-library/worlds/baltic/curated-heroes/culinary-local.png',
    photography_workshop: '/design-library/worlds/baltic/curated-heroes/photography-workshop.png'
  },
  welcomeHero: '/design-library/worlds/baltic/curated-heroes/welcome.png',
  closingHero: '/design-library/worlds/baltic/curated-heroes/closing.png',
  curatedAccents: {
    notes: '/design-library/worlds/baltic/curated-accents/notes.png'
  }
};

const mediterraneanAssets: WorldAssetManifest = {
  curatedHeroes: {
    photography: '/design-library/worlds/mediterranean/curated-heroes/photography.png',
    hiking_nature: '/design-library/worlds/mediterranean/curated-heroes/hiking-nature.png',
    culture_history: '/design-library/worlds/mediterranean/curated-heroes/culture-history.png',
    culinary_local: '/design-library/worlds/mediterranean/curated-heroes/culinary-local.png',
    photography_workshop: '/design-library/worlds/mediterranean/curated-heroes/photography-workshop.png'
  },
  welcomeHero: '/design-library/worlds/mediterranean/curated-heroes/welcome.png',
  closingHero: '/design-library/worlds/mediterranean/curated-heroes/closing.png',
  curatedAccents: {
    notes: '/design-library/worlds/mediterranean/curated-accents/notes.png'
  }
};

const worldAssetRegistry: ReadonlyMap<string, WorldAssetManifest> = new Map([
  ['fjord', fjordAssets],
  ['baltic', balticAssets],
  ['mediterranean', mediterraneanAssets]
]);

export function worldAssetManifestFor(worldId: string | undefined): WorldAssetManifest | null {
  if (!worldId) return null;
  return worldAssetRegistry.get(worldId) ?? null;
}

export function requireWorldAssetManifest(worldId: string): WorldAssetManifest {
  const manifest = worldAssetManifestFor(worldId);
  if (!manifest) throw new Error(`Keine kuratierten World Assets für Editorial World '${worldId}'.`);
  return manifest;
}
