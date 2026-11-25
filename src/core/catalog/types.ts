import type { AltAz } from '../astro/coordinates';

/** What the overlay draws. Kept small because it is copied to the UI thread. */
export interface SkyObject {
  /** `body` is the Sun, the Moon or a planet; its id is a `BodyId`. */
  readonly kind: 'star' | 'body';
  readonly id: string;
  readonly name: string;
  readonly position: AltAz;
  /** Apparent magnitude: lower is brighter. */
  readonly magnitude: number;
}
