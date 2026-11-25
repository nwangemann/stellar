import type { BodyId } from '../astro/bodies';
import type { AltAz } from '../astro/coordinates';
import type { Matrix, Vector } from '../astro/vector';

/** An object placed at one moment. Stays on the JS thread. */
export interface SkyObject {
  /** `body` is the Sun, the Moon or a planet; its id is a `BodyId`. */
  readonly kind: 'star' | 'body';
  readonly id: string;
  readonly name: string;
  readonly position: AltAz;
  /** Apparent magnitude: lower is brighter. */
  readonly magnitude: number;
}

export interface StarMark {
  readonly kind: 'star';
  readonly id: string;
  readonly magnitude: number;
  /** J2000, so it never changes. */
  readonly direction: Vector;
}
export interface BodyMark {
  readonly kind: 'body';
  readonly id: BodyId;
}
/** What the overlay draws. The same at every moment, so it is copied to the UI thread only once. */
export type SkyMark = StarMark | BodyMark;

/** Where the marks are at one moment. Small, because every refresh copies it to the UI thread. */
export interface SkyTurn {
  /** J2000 to the horizon. */
  readonly rotation: Matrix;
  /** Horizon directions. */
  readonly bodies: Readonly<Record<BodyId, Vector>>;
  readonly moon: { readonly lit: number; readonly towardSun: Vector };
}
