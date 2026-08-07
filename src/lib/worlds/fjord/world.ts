import type { EditorialWorldDefinition } from '../types';

export const fjordWorld: EditorialWorldDefinition = {
  id: 'fjord',
  name: 'Fjord',
  referenceNumber: 1,
  status: 'reference',
  character: ['calm', 'spacious', 'nordic', 'photographic', 'reflective'],
  designLanguage: ['Northern', 'Calm', 'Image-led'],
  companion: {
    id: 'puffin',
    name: 'Papageientaucher',
    role: 'editorial_companion'
  },
  pageGrammars: [
    'cover',
    'welcome',
    'contents',
    'destination',
    'light',
    'weather',
    'workflow',
    'notes',
    'closing'
  ]
};
