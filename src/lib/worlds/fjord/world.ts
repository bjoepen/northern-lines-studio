import type { EditorialWorldDefinition } from '../types';

export const fjordWorld: EditorialWorldDefinition = {
  id: 'fjord',
  name: 'Fjord',
  referenceNumber: 1,
  status: 'reference',
  character: ['calm', 'spacious', 'nordic', 'photographic', 'reflective'],
  designLanguage: ['Northern', 'Calm', 'Image-led'],
  companionId: 'fjord-puffin',
  companionName: 'Papageientaucher',
  layoutSystemId: 'fjord-layout',
  layoutSystemName: 'Fjord Layout Language',
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
