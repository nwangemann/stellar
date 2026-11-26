import type { BodyId } from '../astro/bodies';
import type { AltAz } from '../astro/coordinates';
import type { Matrix, Vector } from '../astro/vector';
import type { Satellite } from '../satellites/orbit';

interface Placed {
  readonly id: string;
  readonly name: string;
  readonly position: AltAz;
  /** Apparent magnitude: lower is brighter. Infinity for satellites, which have no catalogued one. */
  readonly magnitude: number;
}
/** An object placed at one moment. Stays on the JS thread. */
export type SkyObject =
  | (Placed & {
      /** `body` is the Sun, the Moon or a planet; its id is a `BodyId`. */
      readonly kind: 'star' | 'body';
    })
  | (Placed & {
      /** An Earth satellite; its id is the NORAD number. */
      readonly kind: 'satellite';
      readonly satellite: Satellite;
    });

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
export interface SatelliteMark {
  readonly kind: 'satellite';
  readonly id: string;
}
/** What the overlay draws. The same at every moment, so it is copied to the UI thread only once. */
export type SkyMark = StarMark | BodyMark | SatelliteMark;

/** Where the marks are at one moment. Small, because every refresh copies it to the UI thread. */
export interface SkyTurn {
  /** J2000 to the horizon. */
  readonly rotation: Matrix;
  /** Horizon directions. */
  readonly bodies: Readonly<Record<BodyId, Vector>>;
  readonly moon: { readonly lit: number; readonly towardSun: Vector };
  /** Horizon directions by NORAD number. Satellites move fast, so the UI refreshes these often. */
  readonly satellites: Readonly<Record<string, Vector>>;
}
