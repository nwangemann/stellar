import type { Observer } from '@/core/astro/coordinates';
import type { Target } from '@/core/layers/types';
import type { Pose } from '@/core/pose/pose';

export interface Capture {
  readonly id: string;
  readonly targetName: string;
  /** What was identified. Missing from captures saved before this was stored. */
  readonly target?: Pick<Target, 'kind' | 'id'>;
  readonly capturedAt: string;
  /** The time the sky showed, if it was not the present. */
  readonly skyTime?: string;
  readonly pose: Pose;
  /** Null when no location was available. */
  readonly observer: Observer | null;
}

export interface LogbookStore {
  add(capture: Capture): Promise<void>;
  list(): Promise<Capture[]>;
}
