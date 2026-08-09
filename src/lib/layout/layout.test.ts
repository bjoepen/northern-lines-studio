import { describe, expect, it } from 'vitest';
import { layoutSystemForWorld, requireLayoutSystem } from './index';

describe('editorial layout systems', () => {
  it('loads the Fjord layout language', () => {
    const layout = requireLayoutSystem('fjord');
    expect(layout.name).toBe('Fjord Layout Language');
    expect(layout.footer.anchor).toBe('TRAVEL · PHOTOGRAPHY · MEMORIES');
  });

  it('keeps the destination layout vocabulary intentionally small', () => {
    expect(requireLayoutSystem('fjord').destinationLayouts.map((layout) => layout.label)).toEqual([
      'Weite',
      'Bild links',
      'Bild rechts'
    ]);
  });

  it('uses Weite as the Fjord destination default', () => {
    expect(requireLayoutSystem('fjord').defaultLayoutByPageType.destination).toBe('destination-hero-banner');
  });

  it('binds Fjord to its fixed companion layout foundation', () => {
    expect(requireLayoutSystem('fjord').companionLayoutId).toBe('fjord-companion-layout');
  });

  it('does not invent layout languages for unknown worlds', () => {
    expect(layoutSystemForWorld('unknown')).toBeNull();
  });
});
