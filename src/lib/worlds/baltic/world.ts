import type { EditorialWorldDefinition } from '../types';

export const balticWorld: EditorialWorldDefinition = {
  id: 'baltic',
  name: 'Ostsee',
  referenceNumber: 2,
  status: 'editorial',
  character: ['light', 'coastal', 'hanseatic', 'summer-calm', 'open'],
  designLanguage: ['Northern', 'Light', 'Coastal'],
  companionId: 'baltic-otter',
  companionName: 'Fischotter',
  layoutSystemId: 'baltic-layout',
  layoutSystemName: 'Ostsee Layout Language',
  pageGrammars: [
    'cover', 'welcome', 'contents', 'planning', 'destination',
    'light', 'weather', 'workflow', 'notes', 'closing'
  ]
};
