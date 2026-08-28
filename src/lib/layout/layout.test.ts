import { describe, expect, it } from 'vitest';
import { layoutSystemForWorld, requireLayoutSystem } from './index';

describe('editorial layout systems', () => {
  it('loads the Fjord layout language', () => {
    const layout = requireLayoutSystem('fjord');
    expect(layout.name).toBe('Fjord Layout Language');
    expect(layout.footer.anchor).toBe('TRAVEL · PHOTOGRAPHY · MEMORIES');
  });

  it('keeps the destination layout vocabulary intentionally small', () => {
    for (const worldId of ['fjord', 'baltic', 'mediterranean']) {
      expect(requireLayoutSystem(worldId).destinationLayouts.map((layout) => layout.label)).toEqual([
        'Weite',
        'Bild links',
        'Bild rechts'
      ]);
    }
  });

  it('uses Weite as the destination default across registered worlds', () => {
    for (const worldId of ['fjord', 'baltic', 'mediterranean']) {
      expect(requireLayoutSystem(worldId).defaultLayoutByPageType.destination).toBe('destination-hero-banner');
    }
  });

  it('binds each world to its registered companion layout foundation', () => {
    expect(requireLayoutSystem('fjord').companionLayoutId).toBe('fjord-companion-layout');
    expect(requireLayoutSystem('baltic').companionLayoutId).toBe('baltic-companion-layout');
    expect(requireLayoutSystem('mediterranean').companionLayoutId).toBe('mediterranean-companion-layout');
  });

  it('loads Ostsee and Mittelmeer without changing the shared destination vocabulary', () => {
    expect(requireLayoutSystem('baltic').name).toBe('Ostsee Layout Language');
    expect(requireLayoutSystem('mediterranean').name).toBe('Mittelmeer Layout Language');
  });

  it('does not invent layout languages for unknown worlds', () => {
    expect(layoutSystemForWorld('unknown')).toBeNull();
  });
});
