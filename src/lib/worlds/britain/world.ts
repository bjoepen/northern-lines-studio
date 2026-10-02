import type { EditorialWorldDefinition } from '../types';

export const britainWorld: EditorialWorldDefinition = {
  id: 'britain', name: 'British Isles', referenceNumber: 4, status: 'editorial',
  character: ['weathered', 'calm', 'heather', 'stone', 'timeless'],
  designLanguage: ['Northern', 'Weathered Elegance', 'British Isles'],
  companionId: 'britain-red-grouse', companionName: 'Moorhuhn',
  layoutSystemId: 'britain-layout', layoutSystemName: 'British Isles Layout Language',
  pageGrammars: ['cover','welcome','contents','planning','destination','destination_interest','light','weather','workflow','notes','closing']
};
