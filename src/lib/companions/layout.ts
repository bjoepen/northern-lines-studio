import type { PageRole } from '../project';

export type CompanionPlacement = 'bottom-left';
export type CompanionPose = 'default';

export interface CompanionLayoutRule {
  placement: CompanionPlacement;
  pose: CompanionPose;
  mirror: false;
  scale: 'small';
  visibleFromRole: 'journey_planning';
  visibleRoles: readonly PageRole[];
}

export const fjordCompanionLayout: CompanionLayoutRule = {
  placement: 'bottom-left',
  pose: 'default',
  mirror: false,
  scale: 'small',
  visibleFromRole: 'journey_planning',
  visibleRoles: [
    'journey_planning',
    'destination',
    'journey_knowledge',
    'workflow',
    'notes',
    'closing_memory'
  ]
};

export const balticCompanionLayout: CompanionLayoutRule = { ...fjordCompanionLayout };
export const mediterraneanCompanionLayout: CompanionLayoutRule = { ...fjordCompanionLayout };

const companionLayoutRegistry: ReadonlyMap<string, CompanionLayoutRule> = new Map([
  ['fjord-companion-layout', fjordCompanionLayout],
  ['baltic-companion-layout', balticCompanionLayout],
  ['mediterranean-companion-layout', mediterraneanCompanionLayout]
]);

export function loadCompanionLayout(id: string | undefined): CompanionLayoutRule | null {
  if (!id) return null;
  return companionLayoutRegistry.get(id) ?? null;
}

export function requireCompanionLayout(id: string): CompanionLayoutRule {
  const layout = loadCompanionLayout(id);
  if (!layout) throw new Error(`Unbekanntes Companion Layout: ${id}`);
  return layout;
}

export function companionVisibleForRole(
  rule: CompanionLayoutRule,
  role: PageRole | undefined
): boolean {
  return Boolean(role && rule.visibleRoles.includes(role));
}
