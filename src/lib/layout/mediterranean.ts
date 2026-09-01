import type { EditorialLayoutSystem } from './types';

export const mediterraneanLayoutSystem: EditorialLayoutSystem = {
  id: 'mediterranean-layout',
  worldId: 'mediterranean',
  name: 'Mittelmeer Layout Language',
  paperTone: '#ffffff',
  inkTone: '#4a4a3f',
  accentTone: '#4e6650',
  quietTone: '#a59d8d',
  headingFamily: 'Georgia, "Times New Roman", serif',
  bodyFamily: 'Georgia, "Times New Roman", serif',
  footer: {
    anchor: 'TRAVEL · PHOTOGRAPHY · MEMORIES',
    worldLabel: 'Mittelmeer'
  },
  companionLayoutId: 'mediterranean-companion-layout',
  destinationLayouts: [
    {
      id: 'destination-hero-banner',
      label: 'Weite',
      description: 'Der Ort öffnet sich über eine ruhige mediterrane Weite.',
      emphasis: 'wide'
    },
    {
      id: 'destination-hero-left',
      label: 'Bild links',
      description: 'Das Bild führt in den Ort.',
      emphasis: 'image-first'
    },
    {
      id: 'destination-hero-right',
      label: 'Bild rechts',
      description: 'Die Geschichte führt, das Bild begleitet.',
      emphasis: 'story-first'
    }
  ],
  defaultLayoutByPageType: {
    cover: 'cover',
    welcome: 'welcome',
    contents: 'contents',
    planning: 'planning',
    destination: 'destination-hero-banner',
    knowledge: 'knowledge',
    workflow: 'workflow',
    notes: 'notes',
    closing: 'closing'
  }
};
