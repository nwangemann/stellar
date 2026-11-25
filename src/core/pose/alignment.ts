import { deg, wrap360, type Degrees } from '../units';
import type { Pose } from './pose';

/**
 * Corrects a compass error. Exact at any altitude and roll, because adding to the
 * azimuth turns the whole view about the vertical.
 */
export function alignPose(pose: Pose, correction: Degrees): Pose {
  'worklet';
  return { ...pose, az: wrap360(deg(pose.az + correction)) };
}

/** Compass correction after dragging the sky along the horizon. `dx` and `dy` are screen pixels. */
export function dragAlignment(
  correction: Degrees,
  pose: Pose,
  dx: number,
  dy: number,
  degreesPerPixel: number,
): Degrees {
  'worklet';
  const roll = (pose.roll * Math.PI) / 180;
  // The part of the drag along the horizon, which `project` tilts by the roll.
  const along = dx * Math.cos(roll) - dy * Math.sin(roll);
  const squeeze = Math.max(0.1, Math.cos((pose.alt * Math.PI) / 180));
  const turned = correction - (along * degreesPerPixel) / squeeze;
  return deg(wrap360(deg(turned + 180)) - 180);
}
