import { fjordLayoutSystem } from './fjord';
import type { EditorialLayoutSystem } from './types';

const layoutRegistry: ReadonlyMap<string, EditorialLayoutSystem> = new Map([
  [fjordLayoutSystem.worldId, fjordLayoutSystem]
]);

export function layoutSystemForWorld(worldId: string | undefined): EditorialLayoutSystem | null {
  if (!worldId) return null;
  return layoutRegistry.get(worldId) ?? null;
}

export function requireLayoutSystem(worldId: string): EditorialLayoutSystem {
  const layout = layoutSystemForWorld(worldId);
  if (!layout) throw new Error(`Keine Layout Language für Editorial World '${worldId}'.`);
  return layout;
}
