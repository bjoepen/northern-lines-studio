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

  it('contains the Fjord reference grammars', () => {
    expect(requireEditorialWorld('fjord').pageGrammars).toContain('destination');
    expect(requireEditorialWorld('fjord').pageGrammars).toContain('closing');
  });

  it('does not invent unknown worlds', () => {
    expect(loadEditorialWorld('unknown')).toBeNull();
    expect(() => requireEditorialWorld('unknown')).toThrow('Unbekannte Editorial World');
  });

  it('ships only the approved Fjord reference world', () => {
    expect(availableEditorialWorlds().map((world) => world.id)).toEqual(['fjord']);
  });
});
