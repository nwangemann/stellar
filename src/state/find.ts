import { create } from 'zustand';
import type { Target } from '@/core/layers/types';

/** A request to be shown an object in the sky. */
export interface Wanted {
  readonly target: Pick<Target, 'kind' | 'id' | 'name'>;
  /** The object to point at: the target itself, or a star of the constellation. */
  readonly aimId: string;
  /**
   * Whether the sky followed the phone when asked, so an arrow leads there. Kept here because
   * the sensors are still restarting when the sky returns.
   */
  readonly byArrow: boolean;
}

interface Find {
  wanted: Wanted | null;
  /** Whether the request has been locked on to. */
  reached: boolean;
  /** Whether the sky followed the phone when it was last on screen. */
  following: boolean;
  set: (patch: Partial<Omit<Find, 'set'>>) => void;
}

/** Not persisted. The sky screen serves the request and clears it. */
export const useFind = create<Find>()((set) => ({
  wanted: null,
  reached: false,
  following: false,
  set: (patch) => set(patch),
}));
