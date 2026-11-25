import type { Orientation } from '@/core/pose/orientation';

export interface OrientationReading {
  readonly orientation: Orientation;
  /** Milliseconds from an arbitrary start, for smoothing. */
  readonly time: number;
  /** expo-location's compass scale: 3 is high, 0 is none. */
  readonly compassAccuracy: number;
}
