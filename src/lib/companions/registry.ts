import type { CompanionDefinition } from './types';

const companions: readonly CompanionDefinition[] = [
  {
    id: 'fjord-puffin',
    editorialWorldId: 'fjord',
    name: 'Papageientaucher',
    scientificName: 'Fratercula arctica',
    role: 'editorial_companion',
    status: 'active',
    character: 'ruhig, neugierig, küstennah',
    editorialMood: ['Ruhe', 'Küste', 'Ankommen'],
    assetPath: 'design-library/companions/fjord/companion.png',
    alphaTransparencyReady: true
  },
  {
    id: 'baltic-otter',
    editorialWorldId: 'baltic',
    name: 'Fischotter',
    role: 'editorial_companion',
    status: 'active',
    character: 'gelassen, neugierig, wasserverbunden',
    editorialMood: ['Wasser', 'Küste', 'Leichtigkeit'],
    assetPath: 'design-library/companions/baltic/companion.png',
    alphaTransparencyReady: true
  },
  {
    id: 'britain-red-grouse',
    editorialWorldId: 'britain',
    name: 'Moorhuhn',
    role: 'editorial_companion',
    status: 'planned',
    character: 'zurückhaltend, erdig, heideverbunden',
    editorialMood: ['Moor', 'Heide', 'Weite'],
    assetPath: 'design-library/companions/britain/companion.png',
    alphaTransparencyReady: true
  },
  {
    id: 'woodland-badger',
    editorialWorldId: 'woodland',
    name: 'Dachs',
    scientificName: 'Meles meles',
    role: 'editorial_companion',
    status: 'planned',
    character: 'gelassen, bodenständig, beobachtend',
    editorialMood: ['Wald', 'Ruhe', 'Bodenständigkeit'],
    assetPath: 'design-library/companions/woodland/companion.png',
    alphaTransparencyReady: true
  },
  {
    id: 'iberian-lynx',
    editorialWorldId: 'mediterranean',
    name: 'Iberischer Luchs',
    scientificName: 'Lynx pardinus',
    role: 'editorial_companion',
    status: 'active',
    character: 'würdevoll, ruhig, wild',
    editorialMood: ['Weite', 'Wärme', 'Wildnis'],
    assetPath: 'design-library/companions/iberian/companion.png',
    alphaTransparencyReady: true
  },
  {
    id: 'canary-gecko',
    editorialWorldId: 'canary',
    name: 'Gecko',
    role: 'editorial_companion',
    status: 'planned',
    character: 'aufmerksam, neugierig, sonnennah',
    editorialMood: ['Vulkan', 'Sonne', 'Insel'],
    assetPath: 'design-library/companions/canary/companion.png',
    alphaTransparencyReady: false
  },
  {
    id: 'arctic-walrus',
    editorialWorldId: 'arctic',
    name: 'Walross',
    scientificName: 'Odobenus rosmarus',
    role: 'editorial_companion',
    status: 'planned',
    character: 'ruhig, kraftvoll, gelassen',
    editorialMood: ['Stille', 'Eis', 'Weite'],
    assetPath: 'design-library/companions/arctic/companion.png',
    alphaTransparencyReady: true
  },
  {
    id: 'candidate-squirrel',
    editorialWorldId: null,
    name: 'Eichhörnchen',
    role: 'editorial_companion',
    status: 'candidate',
    character: 'lebendig, neugierig',
    editorialMood: ['Wald', 'Jahreszeiten', 'Nähe'],
    assetPath: 'design-library/companions/candidates/squirrel/companion.png',
    alphaTransparencyReady: true
  }
];

const registry = new Map(companions.map((companion) => [companion.id, companion]));

export function loadCompanion(id: string | undefined): CompanionDefinition | null {
  if (!id) return null;
  return registry.get(id) ?? null;
}

export function requireCompanion(id: string): CompanionDefinition {
  const companion = loadCompanion(id);
  if (!companion) throw new Error(`Unbekannter Editorial Companion: ${id}`);
  return companion;
}

export function availableCompanions(): CompanionDefinition[] {
  return [...companions];
}

export function companionsForWorld(editorialWorldId: string): CompanionDefinition[] {
  return companions.filter((companion) => companion.editorialWorldId === editorialWorldId);
}
