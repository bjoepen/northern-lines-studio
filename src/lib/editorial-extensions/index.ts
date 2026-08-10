import type { EditorialExtensionKind } from '../project';

export interface EditorialExtensionDefinition {
  kind: EditorialExtensionKind;
  label: string;
  hint: string;
  signet: string;
}

export const EDITORIAL_EXTENSION_DEFINITIONS: readonly EditorialExtensionDefinition[] = [
  { kind: 'knowledge', label: 'Wissen', hint: 'Ein überraschender oder hilfreicher Fakt.', signet: 'knowledge' },
  { kind: 'photo_spot', label: 'Fotospot', hint: 'Ein besonderer Ort für ein Bild.', signet: 'photo-spot' },
  { kind: 'tip', label: 'Tipp', hint: 'Eine persönliche Empfehlung für unterwegs.', signet: 'tip' },
  { kind: 'souvenir', label: 'Souvenir', hint: 'Etwas Typisches, das sich mitnehmen lässt.', signet: 'souvenir' },
  { kind: 'important', label: 'Wichtig', hint: 'Etwas, das man vor Ort wirklich wissen sollte.', signet: 'important' },
  { kind: 'history', label: 'Geschichte', hint: 'Ein historischer Kontext, der den Ort erklärt.', signet: 'history' }
] as const;

export function editorialExtensionDefinition(kind: EditorialExtensionKind): EditorialExtensionDefinition {
  return EDITORIAL_EXTENSION_DEFINITIONS.find((entry) => entry.kind === kind) ?? EDITORIAL_EXTENSION_DEFINITIONS[0];
}

export function editorialExtensionLabel(kind: EditorialExtensionKind): string {
  return editorialExtensionDefinition(kind).label;
}
