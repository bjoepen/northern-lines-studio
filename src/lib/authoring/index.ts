import type { EditorialComponentId } from '../grammar/types';
import type { StudioPage } from '../project';
import type { AuthoringEntry, AuthoringStatus, AuthoringView } from './types';

export const AUTHORING_STATUSES: readonly AuthoringStatus[] = ['empty', 'draft', 'revised', 'approved', 'final'];

export const AUTHORING_STATUS_LABELS: Readonly<Record<AuthoringStatus, string>> = {
  empty: 'Leer',
  draft: 'Entwurf',
  revised: 'Überarbeitet',
  approved: 'Freigegeben',
  final: 'Final'
};

export function authoringEntryFor(page: StudioPage | null, componentId: EditorialComponentId | null): AuthoringEntry | null {
  if (!page || !componentId) return null;
  return page.authoring?.[componentId] ?? null;
}

export function authoringViewFor(page: StudioPage | null, componentId: EditorialComponentId | null, label = ''): AuthoringView | null {
  if (!page || !componentId) return null;
  const entry = authoringEntryFor(page, componentId);
  return {
    componentId,
    label: label || componentId,
    content: entry?.content ?? (componentId === 'title' ? page.title : ''),
    status: entry?.status ?? (componentId === 'title' ? 'draft' : 'empty'),
    isPersisted: Boolean(entry),
  };
}

export function withAuthoringEntry(page: StudioPage, entry: AuthoringEntry): StudioPage {
  return {
    ...page,
    authoring: { ...(page.authoring ?? {}), [entry.componentId]: entry }
  };
}

export function authoringCompletion(page: StudioPage | null): number {
  if (!page?.components?.length) return 0;
  const authored = page.components.filter((id) => {
    const entry = page.authoring?.[id];
    return entry && entry.status !== 'empty' && entry.content.trim().length > 0;
  }).length;
  return Math.round((authored / page.components.length) * 100);
}
export function authoredComponentCount(page: StudioPage | null): number {
  if (!page?.components?.length) return 0;
  return page.components.filter((id) => {
    const entry = page.authoring?.[id];
    return Boolean(entry && entry.status !== 'empty' && entry.content.trim().length > 0);
  }).length;
}

export function authoringIsDirty(view: AuthoringView | null, draft: string, status: AuthoringStatus): boolean {
  if (!view) return false;
  return draft !== view.content || status !== view.status;
}
