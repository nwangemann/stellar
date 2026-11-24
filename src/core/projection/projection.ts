import type { AltAz } from '../astro/coordinates';
import type { SkyObject } from '../catalog/mockSky';
import type { Pose } from '../pose/pose';
import { px, toRad, type Degrees, type Pixels } from '../units';

export interface Viewport {
  readonly width: Pixels;
  readonly height: Pixels;
  readonly horizontalFov: Degrees;
}

export interface ScreenPoint {
  readonly x: Pixels;
  readonly y: Pixels;
}

/** Gnomonic (pinhole camera) projection. Returns null for anything behind the camera. */
export function project(p: AltAz, pose: Pose, view: Viewport): ScreenPoint | null {
  'worklet';
  const alt = toRad(p.alt);
  const az = toRad(p.az);
  const pAlt = toRad(pose.alt);
  const pAz = toRad(pose.az);
  const roll = toRad(pose.roll);
  // East, north, up.
  const e = Math.sin(az) * Math.cos(alt);
  const n = Math.cos(az) * Math.cos(alt);
  const u = Math.sin(alt);
  const depth =
    e * Math.sin(pAz) * Math.cos(pAlt) + n * Math.cos(pAz) * Math.cos(pAlt) + u * Math.sin(pAlt);
  if (depth <= 0.01) return null;
  const right = e * Math.cos(pAz) - n * Math.sin(pAz);
  const up =
    -e * Math.sin(pAz) * Math.sin(pAlt) - n * Math.cos(pAz) * Math.sin(pAlt) + u * Math.cos(pAlt);
  const focal = view.width / 2 / Math.tan(toRad(view.horizontalFov) / 2);
  const sx = (right / depth) * focal;
  const sy = (up / depth) * focal;
  // Rolling the phone clockwise turns the image counter-clockwise.
  return {
    x: px(view.width / 2 + sx * Math.cos(roll) - sy * Math.sin(roll)),
    y: px(view.height / 2 - (sx * Math.sin(roll) + sy * Math.cos(roll))),
  };
}

export interface Hit {
  readonly object: SkyObject;
  readonly point: ScreenPoint;
}

/** Closest object to the screen centre within the radius. The locked object gets a wider radius. */
export function hitTest(
  objects: readonly SkyObject[],
  pose: Pose,
  view: Viewport,
  radius: number,
  lockedId: string | null,
): Hit | null {
  'worklet';
  let best: Hit | null = null;
  let bestDistance = radius;
  for (const object of objects) {
    const point = project(object.position, pose, view);
    if (!point) continue;
    const d = Math.hypot(point.x - view.width / 2, point.y - view.height / 2);
    if (object.id === lockedId && d <= radius * 1.4) return { object, point };
    if (d <= bestDistance) {
      best = { object, point };
      bestDistance = d;
    }
  }
  return best;
}
