import { describe, expect, it } from 'vitest';
import { requireCompanion } from '../companions';
import { availableEditorialWorlds, loadEditorialWorld, requireEditorialWorld } from './index';

describe('editorial world library', () => {
  it('loads Fjord as Reference World 001', () => {
    const world = requireEditorialWorld('fjord');
    expect(world.name).toBe('Fjord');
    expect(world.status).toBe('reference');
    expect(world.referenceNumber).toBe(1);
  });

  it('references the puffin through the Companion Collection', () => {
    const world = requireEditorialWorld('fjord');
    expect(world.companionId).toBe('fjord-puffin');
    expect(requireCompanion(world.companionId).name).toBe('Papageientaucher');
  });

  it('binds Fjord to its editorial layout language', () => {
    expect(requireEditorialWorld('fjord').layoutSystemId).toBe('fjord-layout');
  });

  it('contains the shared reference grammars across registered worlds', () => {
    for (const worldId of ['fjord', 'baltic', 'mediterranean']) {
      expect(requireEditorialWorld(worldId).pageGrammars).toContain('destination');
      expect(requireEditorialWorld(worldId).pageGrammars).toContain('destination_interest');
      expect(requireEditorialWorld(worldId).pageGrammars).toContain('closing');
    }
  });

  it('does not invent unknown worlds', () => {
    expect(loadEditorialWorld('unknown')).toBeNull();
    expect(() => requireEditorialWorld('unknown')).toThrow('Unbekannte Editorial World');
  });

  it('ships Fjord, Ostsee and Mittelmeer as registered Editorial Worlds', () => {
    expect(availableEditorialWorlds().map((world) => world.id)).toEqual(['fjord', 'baltic', 'mediterranean']);
    expect(requireEditorialWorld('baltic').name).toBe('Ostsee');
    expect(requireEditorialWorld('baltic').companionId).toBe('baltic-otter');
    expect(requireEditorialWorld('mediterranean').name).toBe('Mittelmeer');
    expect(requireEditorialWorld('mediterranean').companionId).toBe('iberian-lynx');
    expect(requireCompanion('iberian-lynx').editorialWorldId).toBe('mediterranean');
  });
});
