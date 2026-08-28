import { fjordWorld } from './fjord/world';
import { balticWorld } from './baltic/world';
import { mediterraneanWorld } from './mediterranean/world';
import type { EditorialWorldDefinition } from './types';

const worldRegistry: ReadonlyMap<string, EditorialWorldDefinition> = new Map([
  [fjordWorld.id, fjordWorld],
  [balticWorld.id, balticWorld],
  [mediterraneanWorld.id, mediterraneanWorld]
]);

export function loadEditorialWorld(id: string | undefined): EditorialWorldDefinition | null {
  if (!id) return null;
  return worldRegistry.get(id) ?? null;
}

export function requireEditorialWorld(id: string): EditorialWorldDefinition {
  const world = loadEditorialWorld(id);
  if (!world) {
    throw new Error(`Unbekannte Editorial World: ${id}`);
  }
  return world;
}

export function availableEditorialWorlds(): EditorialWorldDefinition[] {
  return Array.from(worldRegistry.values());
}
