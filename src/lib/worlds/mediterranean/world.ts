import type { EditorialWorldDefinition } from '../types';

export const mediterraneanWorld: EditorialWorldDefinition = {
  id: 'mediterranean',
  name: 'Mittelmeer',
  referenceNumber: 3,
  status: 'editorial',
  character: ['warm', 'calm', 'stone', 'cypress', 'late-light'],
  designLanguage: ['Northern', 'Warm', 'Mediterranean'],
  companionId: 'iberian-lynx',
  companionName: 'Iberischer Luchs',
  layoutSystemId: 'mediterranean-layout',
  layoutSystemName: 'Mittelmeer Layout Language',
  pageGrammars: [
    'cover',
    'welcome',
    'contents',
    'planning',
    'destination',
    'destination_interest',
    'light',
    'weather',
    'workflow',
    'notes',
    'closing'
  ]
};
