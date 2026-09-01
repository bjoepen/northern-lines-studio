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
  it.each(['fjord', 'baltic', 'mediterranean'])('provides a complete finite manifest for %s', (worldId) => {
    const manifest = requireWorldAssetManifest(worldId);
    expect(Object.keys(manifest.curatedHeroes).sort()).toEqual([...expectedHeroKeys].sort());
    expect(manifest.welcomeHero).toContain(`/worlds/${worldId}/`);
    expect(manifest.closingHero).toContain(`/worlds/${worldId}/`);
    expect(manifest.curatedAccents.notes).toContain(`/worlds/${worldId}/`);
  });

  it('keeps the Mediterranean manifest inside its own World asset namespace', () => {
    const manifest = requireWorldAssetManifest('mediterranean');
    const paths = [
      ...Object.values(manifest.curatedHeroes),
      manifest.welcomeHero,
      manifest.closingHero,
      ...Object.values(manifest.curatedAccents)
    ];
    expect(paths).toHaveLength(8);
    expect(paths.every((path) => path.startsWith('/design-library/worlds/mediterranean/'))).toBe(true);
  });

  it('returns null for an unknown World instead of inventing assets', () => {
    expect(worldAssetManifestFor('unknown')).toBeNull();
  });
});
