export type CompanionStatus = 'active' | 'planned' | 'candidate';

export interface CompanionDefinition {
  id: string;
  editorialWorldId: string | null;
  name: string;
  scientificName?: string;
  role: 'editorial_companion';
  status: CompanionStatus;
  character: string;
  editorialMood: readonly string[];
  assetPath: string;
  alphaTransparencyReady: boolean;
}
