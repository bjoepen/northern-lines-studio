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
    anchor: 'Northern Lines · Deine Reise beginnt hier.',
    worldLabel: 'Fjord'
  },
  destinationLayouts: [
    {
      id: 'destination-hero-banner',
      label: 'Weite',
      description: 'Das Hero-Bild öffnet die Seite als ruhiges, breites Fenster.',
      emphasis: 'wide'
    },
    {
      id: 'destination-hero-left',
      label: 'Bild links',
      description: 'Die Fotografie eröffnet den Ort, die Geschichte folgt.',
      emphasis: 'image-first'
    },
    {
      id: 'destination-hero-right',
      label: 'Bild rechts',
      description: 'Die Geschichte eröffnet den Ort, die Fotografie begleitet.',
      emphasis: 'story-first'
    }
  ],
  defaultLayoutByPageType: {
    cover: 'cover',
    welcome: 'welcome',
    contents: 'contents',
    destination: 'destination-hero-banner',
    knowledge: 'knowledge',
    workflow: 'workflow',
    notes: 'notes',
    closing: 'closing'
  }
};
