import { deg, wrap360, type Degrees } from '../units';

/** Where the camera points. Roll is clockwise around the viewing axis. */
export interface Pose {
  readonly az: Degrees;
  readonly alt: Degrees;
  readonly roll: Degrees;
}

export const INITIAL_POSE: Pose = { az: deg(180), alt: deg(40), roll: deg(0) };

/** Drag-to-look: the sky follows the finger. Altitude stops just short of the poles. */
export function applyDrag(pose: Pose, dx: number, dy: number, degreesPerPixel: number): Pose {
  'worklet';
  const alt = Math.max(-20, Math.min(88, pose.alt + dy * degreesPerPixel));
  // Azimuth lines converge with altitude, so compensate to keep drag speed even on screen.
  const squeeze = Math.max(0.1, Math.cos((pose.alt * Math.PI) / 180));
  return {
    az: wrap360(deg(pose.az - (dx * degreesPerPixel) / squeeze)),
    alt: deg(alt),
    roll: pose.roll,
  };
}
