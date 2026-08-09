import type { PageType } from '../project';

export type DestinationLayoutId =
  | 'destination-hero-banner'
  | 'destination-hero-left'
  | 'destination-hero-right';

export interface DestinationLayoutVariant {
  id: DestinationLayoutId;
  label: string;
  description: string;
  emphasis: 'wide' | 'image-first' | 'story-first';
}

export interface EditorialFooterDefinition {
  anchor: string;
  worldLabel: string;
}

export interface EditorialLayoutSystem {
  id: string;
  worldId: string;
  name: string;
  paperTone: string;
  inkTone: string;
  accentTone: string;
  quietTone: string;
  headingFamily: string;
  bodyFamily: string;
  footer: EditorialFooterDefinition;
  companionLayoutId: string;
  destinationLayouts: readonly DestinationLayoutVariant[];
  defaultLayoutByPageType: Partial<Record<PageType, string>>;
}
