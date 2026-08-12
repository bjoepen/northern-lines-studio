import type { EditorialLayoutSystem } from './types';

export const balticLayoutSystem: EditorialLayoutSystem = {
  id: 'baltic-layout',
  worldId: 'baltic',
  name: 'Ostsee Layout Language',
  paperTone: '#fbfaf6',
  inkTone: '#16384c',
  accentTone: '#457b8d',
  quietTone: '#7f959d',
  headingFamily: '"Avenir Next", "Helvetica Neue", Arial, sans-serif',
  bodyFamily: '"Iowan Old Style", Georgia, "Times New Roman", serif',
  footer: {
    anchor: 'TRAVEL · PHOTOGRAPHY · MEMORIES',
    worldLabel: 'Ostsee'
  },
  companionLayoutId: 'baltic-companion-layout',
  destinationLayouts: [
    { id: 'destination-hero-banner', label: 'Weite', description: 'Der Ort öffnet sich über einen hellen Küstenhorizont.', emphasis: 'wide' },
    { id: 'destination-hero-left', label: 'Bild links', description: 'Das Bild führt in den Ort.', emphasis: 'image-first' },
    { id: 'destination-hero-right', label: 'Bild rechts', description: 'Die Geschichte führt, das Bild begleitet.', emphasis: 'story-first' }
  ],
  defaultLayoutByPageType: {
    cover: 'cover', welcome: 'welcome', contents: 'contents', planning: 'planning',
    destination: 'destination-hero-banner', knowledge: 'knowledge', workflow: 'workflow', notes: 'notes', closing: 'closing'
  }
};
