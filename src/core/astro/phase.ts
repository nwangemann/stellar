import { deg, type Degrees } from '../units';
import type { AltAz } from './coordinates';
import { altAzVector, dot } from './vector';

const angle = (y: number, x: number): Degrees => deg((Math.atan2(y, x) * 180) / Math.PI);

export interface MoonPhase {
  /** Lit fraction of the disc, 0 to 1. Treats the Sun as infinitely far, which is within 0.3%. */
  readonly lit: number;
  /** A point one degree from the Moon towards the Sun: where the bright limb faces. */
  readonly towardSun: AltAz;
}

export function moonPhase(moon: AltAz, sun: AltAz): MoonPhase {
  const m = altAzVector(moon);
  const s = altAzVector(sun);
  const cos = Math.max(-1, Math.min(1, dot(m, s)));
  // The direction is undefined at exact new or full Moon, where it does not matter.
  const sin = Math.max(1e-9, Math.sqrt(1 - cos * cos));
  const step = Math.PI / 180;
  const along = (i: 0 | 1 | 2) =>
    m[i] * Math.cos(step) + ((s[i] - cos * m[i]) / sin) * Math.sin(step);
  return {
    lit: (1 - cos) / 2,
    towardSun: {
      kind: 'altaz',
      alt: angle(along(2), Math.hypot(along(0), along(1))),
      az: angle(along(0), along(1)),
    },
  };
}

/** Outline of the lit part of a unit disc, with the bright limb towards +x. */
export function litOutline(lit: number): { x: number; y: number }[] {
  'worklet';
  const steps = 24;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * Math.PI;
    points.push({ x: Math.cos(a), y: Math.sin(a) });
  }
  for (let i = steps - 1; i > 0; i--) {
    const a = -Math.PI / 2 + (i / steps) * Math.PI;
    points.push({ x: (1 - 2 * lit) * Math.cos(a), y: Math.sin(a) });
  }
  return points;
}
