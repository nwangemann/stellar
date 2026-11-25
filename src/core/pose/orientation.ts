import { toDeg, toRad, wrap360, type Degrees, type Radians } from '../units';
import type { Pose } from './pose';

/**
 * Unit quaternion turning device axes into world axes.
 * Device: x right, y towards the top edge, z out of the screen, with the phone in portrait.
 * World: x east, y true north, z up. The rear camera looks along device -z.
 */
export interface Orientation {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly w: number;
}

/**
 * From intrinsic Z-X'-Y'' angles, the order of the W3C `deviceorientation` event.
 * Alpha is counter-clockwise from true north, so a compass heading is `-alpha`.
 */
export function orientationFromAngles(alpha: Degrees, beta: Degrees, gamma: Degrees): Orientation {
  'worklet';
  const a = toRad(alpha) / 2;
  const b = toRad(beta) / 2;
  const g = toRad(gamma) / 2;
  const [ca, sa] = [Math.cos(a), Math.sin(a)];
  const [cb, sb] = [Math.cos(b), Math.sin(b)];
  const [cg, sg] = [Math.cos(g), Math.sin(g)];
  return {
    x: ca * sb * cg - sa * cb * sg,
    y: ca * cb * sg + sa * sb * cg,
    z: ca * sb * sg + sa * cb * cg,
    w: ca * cb * cg - sa * sb * sg,
  };
}

/** Where the rear camera points. At the zenith and nadir, azimuth and roll only mean something together. */
export function poseFromOrientation({ x, y, z, w }: Orientation): Pose {
  'worklet';
  // Device -z (the view) and +y (the top edge), in east, north, up.
  const viewE = -2 * (x * z + w * y);
  const viewN = -2 * (y * z - w * x);
  const viewU = -(1 - 2 * (x * x + y * y));
  const topE = 2 * (x * y - w * z);
  const topN = 1 - 2 * (x * x + z * z);
  const topU = 2 * (y * z + w * x);

  const az = Math.atan2(viewE, viewN);
  const alt = Math.atan2(viewU, Math.hypot(viewE, viewN));
  // Compare the top edge with the unrolled right and up directions used by `project`.
  const right = topE * Math.cos(az) - topN * Math.sin(az);
  const up =
    -topE * Math.sin(az) * Math.sin(alt) -
    topN * Math.cos(az) * Math.sin(alt) +
    topU * Math.cos(alt);
  return {
    az: wrap360(toDeg(az as Radians)),
    alt: toDeg(alt as Radians),
    roll: toDeg(Math.atan2(right, up) as Radians),
  };
}

/**
 * Moves from the last smoothed orientation towards a new reading along the shortest rotation.
 * Both times share a unit; a longer `timeConstant` is steadier but lags more.
 */
export function smoothOrientation(
  previous: Orientation,
  reading: Orientation,
  elapsed: number,
  timeConstant: number,
): Orientation {
  'worklet';
  if (timeConstant <= 0) return reading;
  const t = 1 - Math.exp(-Math.max(0, elapsed) / timeConstant);
  const dot =
    previous.x * reading.x +
    previous.y * reading.y +
    previous.z * reading.z +
    previous.w * reading.w;
  // q and -q are the same rotation; pick the one on the near side.
  const sign = dot < 0 ? -1 : 1;
  const angle = Math.acos(Math.min(1, Math.abs(dot)));
  const sin = Math.sin(angle);
  // Slerp, or a straight blend when the two almost coincide.
  const near = sin < 1e-4;
  const from = near ? 1 - t : Math.sin((1 - t) * angle) / sin;
  const to = sign * (near ? t : Math.sin(t * angle) / sin);
  const x = previous.x * from + reading.x * to;
  const y = previous.y * from + reading.y * to;
  const z = previous.z * from + reading.z * to;
  const w = previous.w * from + reading.w * to;
  const length = Math.hypot(x, y, z, w);
  return { x: x / length, y: y / length, z: z / length, w: w / length };
}
