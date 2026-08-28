import { worldAssetManifestFor } from './world-assets';
import type { CuratedAccentKey } from './world-assets';

export type { CuratedAccentKey } from './world-assets';

export function curatedAccentFor(worldId: string | undefined, key: CuratedAccentKey): string | null {
  return worldAssetManifestFor(worldId)?.curatedAccents[key] ?? null;
}
