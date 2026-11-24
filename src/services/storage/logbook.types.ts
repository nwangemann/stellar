import type { Observer } from '@/core/astro/coordinates';
import type { Pose } from '@/core/pose/pose';

export interface Capture {
  readonly id: string;
  readonly targetName: string;
  readonly capturedAt: string;
  readonly pose: Pose;
  /** Null when no location was available. */
  readonly observer: Observer | null;
}

export interface LogbookStore {
  add(capture: Capture): Promise<void>;
  list(): Promise<Capture[]>;
}
