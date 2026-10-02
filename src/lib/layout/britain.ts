import type { EditorialLayoutSystem } from './types';

export const britainLayoutSystem: EditorialLayoutSystem = {
  id: 'britain-layout', worldId: 'britain', name: 'British Isles Layout Language',
  paperTone: '#ffffff', inkTone: '#41464a', accentTone: '#586452', quietTone: '#a59f94',
  headingFamily: 'Baskerville, "Iowan Old Style", Georgia, serif',
  bodyFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif',
  accentFamily: '"Snell Roundhand", "Apple Chancery", cursive',
  footer: { anchor: 'TRAVEL · PHOTOGRAPHY · MEMORIES', worldLabel: 'British Isles' },
  companionLayoutId: 'britain-companion-layout',
  destinationLayouts: [
    { id: 'destination-hero-banner', label: 'Weite', description: 'Der Ort öffnet sich über eine ruhige, wettergeprägte Weite.', emphasis: 'wide' },
    { id: 'destination-hero-left', label: 'Bild links', description: 'Das Bild führt in den Ort.', emphasis: 'image-first' },
    { id: 'destination-hero-right', label: 'Bild rechts', description: 'Die Geschichte führt, das Bild begleitet.', emphasis: 'story-first' }
  ],
  defaultLayoutByPageType: { cover:'cover', welcome:'welcome', contents:'contents', planning:'planning', destination:'destination-hero-banner', knowledge:'knowledge', workflow:'workflow', notes:'notes', closing:'closing' }
};
