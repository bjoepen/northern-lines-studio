import { worldAssetManifestFor } from './world-assets';

export function curatedClosingHeroFor(worldId: string | undefined): string | null {
  return worldAssetManifestFor(worldId)?.closingHero ?? null;
}
