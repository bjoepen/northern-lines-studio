import { describe, expect, it } from 'vitest';
import { requireWorldAssetManifest, worldAssetManifestFor } from './world-assets';

const expectedHeroKeys = [
  'photography',
  'hiking_nature',
  'culture_history',
  'culinary_local',
  'photography_workshop'
];

describe('World asset registry', () => {
  it.each(['fjord', 'baltic'])('provides a complete finite manifest for %s', (worldId) => {
    const manifest = requireWorldAssetManifest(worldId);
    expect(Object.keys(manifest.curatedHeroes).sort()).toEqual([...expectedHeroKeys].sort());
    expect(manifest.welcomeHero).toContain(`/worlds/${worldId}/`);
    expect(manifest.closingHero).toContain(`/worlds/${worldId}/`);
    expect(manifest.curatedAccents.notes).toContain(`/worlds/${worldId}/`);
  });

  it('returns null for an unknown World instead of inventing assets', () => {
    expect(worldAssetManifestFor('unknown')).toBeNull();
  });
});
