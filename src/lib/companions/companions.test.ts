import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { availableCompanions, companionsForWorld, requireCompanion } from './index';
import { availableEditorialWorlds } from '../worlds';

const repoRoot = process.cwd();

describe('companion collection', () => {
  it('uses unique companion ids', () => {
    const ids = availableCompanions().map((companion) => companion.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every active Editorial World exactly one registered companion', () => {
    for (const world of availableEditorialWorlds()) {
      const assigned = companionsForWorld(world.id).filter((companion) => companion.status === 'active');
      expect(assigned).toHaveLength(1);
      expect(assigned[0].id).toBe(world.companionId);
    }
  });

  it('keeps all registry assets in the Design Library', () => {
    for (const companion of availableCompanions()) {
      expect(companion.assetPath.startsWith('design-library/companions/')).toBe(true);
      expect(existsSync(join(repoRoot, companion.assetPath))).toBe(true);
    }
  });

  it('keeps metadata aligned with the registry', () => {
    for (const companion of availableCompanions().filter((item) => item.status !== 'candidate')) {
      const folder = companion.assetPath.split('/').slice(0, -1).join('/');
      const metadataPath = join(repoRoot, folder, 'metadata.json');
      expect(existsSync(metadataPath)).toBe(true);
      const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as { id: string; world: string };
      expect(metadata.id).toBe(companion.id);
      expect(metadata.world).toBe(companion.editorialWorldId);
    }
  });

  it('preserves planned companions without shipping their Editorial Worlds', () => {
    expect(requireCompanion('arctic-walrus').status).toBe('planned');
    expect(requireCompanion('britain-red-grouse').status).toBe('planned');
    expect(requireCompanion('candidate-squirrel').editorialWorldId).toBeNull();
  });

  it('records that the Canary source still needs transparency cleanup', () => {
    expect(requireCompanion('canary-gecko').alphaTransparencyReady).toBe(false);
  });
});
