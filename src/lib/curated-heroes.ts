import { worldAssetManifestFor } from './world-assets';
import type { CuratedHeroKey } from './world-assets';

export type { CuratedHeroKey } from './world-assets';

export function curatedHeroFor(worldId: string | undefined, key: CuratedHeroKey): string | null {
  return worldAssetManifestFor(worldId)?.curatedHeroes[key] ?? null;
}
