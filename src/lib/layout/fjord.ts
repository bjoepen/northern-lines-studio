import type { EditorialLayoutSystem } from './types';

export const fjordLayoutSystem: EditorialLayoutSystem = {
  id: 'fjord-layout',
  worldId: 'fjord',
  name: 'Fjord Layout Language',
  paperTone: '#f8f7f3',
  inkTone: '#1d3039',
  accentTone: '#547b8c',
  quietTone: '#8d9ca2',
  headingFamily: 'Georgia, "Times New Roman", serif',
  bodyFamily: 'Georgia, "Times New Roman", serif',
  footer: {
    anchor: 'TRAVEL · PHOTOGRAPHY · MEMORIES',
    worldLabel: 'Fjord'
  },
  companionLayoutId: 'fjord-companion-layout',
  destinationLayouts: [
    {
      id: 'destination-hero-banner',
      label: 'Weite',
      description: 'Der Ort öffnet sich über ein ruhiges Panorama.',
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
