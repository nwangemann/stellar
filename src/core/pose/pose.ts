import type { AltAz } from '../astro/coordinates';
import { deg, wrap360, type Degrees } from '../units';

/** Where the camera points. Roll is clockwise around the viewing axis. */
export interface Pose {
  readonly az: Degrees;
  readonly alt: Degrees;
  readonly roll: Degrees;
}

export const INITIAL_POSE: Pose = { az: deg(180), alt: deg(40), roll: deg(0) };

const MAX_ALT = 88;

/** Drag-to-look: the sky follows the finger. Altitude stops just short of the poles. */
export function applyDrag(pose: Pose, dx: number, dy: number, degreesPerPixel: number): Pose {
  'worklet';
  const alt = Math.max(-20, Math.min(MAX_ALT, pose.alt + dy * degreesPerPixel));
  // Azimuth lines converge with altitude, so compensate to keep drag speed even on screen.
  const squeeze = Math.max(0.1, Math.cos((pose.alt * Math.PI) / 180));
  return {
    az: wrap360(deg(pose.az - (dx * degreesPerPixel) / squeeze)),
    alt: deg(alt),
    roll: pose.roll,
  };
}

/** Looks at a point, level, within the reach of dragging. */
export function facing(p: AltAz): Pose {
  return { az: p.az, alt: deg(Math.min(MAX_ALT, p.alt)), roll: deg(0) };
}

/** `from` with its azimuth unwrapped, so that a plain tween to `to` takes the short way round. */
export function turnStart(from: Pose, to: Pose): Pose {
  'worklet';
  const change = wrap360(deg(to.az - from.az + 180)) - 180;
  return { ...from, az: deg(to.az - change) };
}
