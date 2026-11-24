import type { AltAz } from '../astro/coordinates';
import { deg } from '../units';

export interface SkyObject {
  readonly id: string;
  readonly name: string;
  readonly position: AltAz;
  /** Apparent magnitude: lower is brighter. */
  readonly magnitude: number;
}

/** Placeholder stars at made-up positions. These are NOT real astronomy; phase 5 replaces them. */
export function createMockSky(count = 400, seed = 7): SkyObject[] {
  let s = seed;
  const random = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i + 1}`,
    name: `Mock star ${i + 1}`,
    position: {
      kind: 'altaz' as const,
      az: deg(random() * 360),
      alt: deg((Math.asin(random()) * 180) / Math.PI),
    },
    magnitude: random() * 6,
  }));
}
