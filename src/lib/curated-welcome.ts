import { worldAssetManifestFor } from './world-assets';

export function curatedWelcomeHeroFor(worldId: string | undefined): string | null {
  return worldAssetManifestFor(worldId)?.welcomeHero ?? null;
}
