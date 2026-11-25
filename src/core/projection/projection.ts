import type { AltAz } from '../astro/coordinates';
import { altAzVector, dot, unrotate, type Vector } from '../astro/vector';
import type { SkyMark, SkyTurn } from '../catalog/types';
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

/** A pose and view, with the trigonometry done once for all the points of a frame. */
export interface Lens {
  readonly right: Vector;
  readonly up: Vector;
  readonly forward: Vector;
  readonly centerX: number;
  readonly centerY: number;
  readonly focal: number;
}

/** Sees horizon directions. */
export function lensFor(pose: Pose, view: Viewport): Lens {
  'worklet';
  const sinAlt = Math.sin(toRad(pose.alt));
  const cosAlt = Math.cos(toRad(pose.alt));
  const sinAz = Math.sin(toRad(pose.az));
  const cosAz = Math.cos(toRad(pose.az));
  // Rolling the phone clockwise turns the image counter-clockwise.
  const sin = Math.sin(toRad(pose.roll));
  const cos = Math.cos(toRad(pose.roll));
  const e = -sinAz * sinAlt;
  const n = -cosAz * sinAlt;
  return {
    right: [cosAz * cos - e * sin, -sinAz * cos - n * sin, -cosAlt * sin],
    up: [cosAz * sin + e * cos, -sinAz * sin + n * cos, cosAlt * cos],
    forward: [sinAz * cosAlt, cosAz * cosAlt, sinAlt],
    centerX: view.width / 2,
    centerY: view.height / 2,
    focal: view.width / 2 / Math.tan(toRad(view.horizontalFov) / 2),
  };
}

/** Sees J2000 directions: turning the lens once is cheaper than turning every star. */
export function starLens(lens: Lens, turn: SkyTurn): Lens {
  'worklet';
  return {
    right: unrotate(turn.rotation, lens.right),
    up: unrotate(turn.rotation, lens.up),
    forward: unrotate(turn.rotation, lens.forward),
    centerX: lens.centerX,
    centerY: lens.centerY,
    focal: lens.focal,
  };
}

/** Gnomonic (pinhole camera) projection. Returns null for anything behind the camera. */
export function projectThrough(lens: Lens, v: Vector): ScreenPoint | null {
  'worklet';
  const depth = dot(lens.forward, v);
  if (depth <= 0.01) return null;
  const scale = lens.focal / depth;
  return {
    x: px(lens.centerX + dot(lens.right, v) * scale),
    y: px(lens.centerY - dot(lens.up, v) * scale),
  };
}

export function project(p: AltAz, pose: Pose, view: Viewport): ScreenPoint | null {
  'worklet';
  return projectThrough(lensFor(pose, view), altAzVector(p));
}

export interface Hit {
  readonly id: string;
  readonly point: ScreenPoint;
}

/**
 * Closest mark above the horizon to the screen centre within the radius.
 * The held one, locked or wanted, gets a wider radius and wins over nearer ones.
 */
export function hitTest(
  marks: readonly SkyMark[],
  turn: SkyTurn,
  pose: Pose,
  view: Viewport,
  radius: number,
  heldId: string | null,
): Hit | null {
  'worklet';
  const lens = lensFor(pose, view);
  const stars = starLens(lens, turn);
  const zenith = turn.rotation[2];
  let best: Hit | null = null;
  let bestDistance = radius;
  for (const mark of marks) {
    const star = mark.kind === 'star';
    const direction = star ? mark.direction : turn.bodies[mark.id];
    const point = projectThrough(star ? stars : lens, direction);
    if (!point || (star ? dot(zenith, direction) : direction[2]) <= 0) continue;
    const d = Math.hypot(point.x - view.width / 2, point.y - view.height / 2);
    if (mark.id === heldId && d <= radius * 1.4) return { id: mark.id, point };
    if (d <= bestDistance) {
      best = { id: mark.id, point };
      bestDistance = d;
    }
  }
  return best;
}
