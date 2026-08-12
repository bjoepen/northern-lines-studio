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

export function companionVisibleForRole(
  rule: CompanionLayoutRule,
  role: PageRole | undefined
): boolean {
  return Boolean(role && rule.visibleRoles.includes(role));
}

export const balticCompanionLayout: CompanionLayoutRule = { ...fjordCompanionLayout };
