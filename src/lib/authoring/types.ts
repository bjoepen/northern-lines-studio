import type { EditorialComponentId } from '../grammar/types';

export type AuthoringStatus = 'empty' | 'draft' | 'revised' | 'approved' | 'final';

export interface AuthoringEntry {
  componentId: EditorialComponentId;
  content: string;
  status: AuthoringStatus;
  updatedAt?: string;
}

export interface AuthoringView {
  componentId: EditorialComponentId;
  label: string;
  content: string;
  status: AuthoringStatus;
  isPersisted: boolean;
}
