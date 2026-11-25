import type { BodyId } from '../astro/bodies';
import { dot, rotate, type Vector } from '../astro/vector';
import type { SkyTurn } from '../catalog/types';
import { lensFor, projectThrough, type Lens, type Viewport } from './projection';
import type { Pose } from '../pose/pose';
import { toRad } from '../units';

const MAX_SCALE = 6;
const MIN_SCALE = 1.15;
/** How much of the screen's width a zoomed figure fills. */
const FILL = 0.8;

/** What the view zooms in on. */
export interface ZoomAim {
  /** A body, which moves; otherwise `direction` is used. */
  readonly body: BodyId | null;
  /** J2000. */
  readonly direction: Vector;
  readonly scale: number;
  /** Whether it moves to the screen centre. If not, it stays where it is. */
  readonly centered: boolean;
}

export const bodyZoom = (body: BodyId): ZoomAim => ({
  body,
  direction: [0, 0, 1],
  scale: MAX_SCALE,
  centered: false,
});

/** Fits J2000 directions, which must not be empty, on the screen. A single one stays in place. */
export function zoomFor(directions: readonly Vector[], view: Viewport): ZoomAim {
  const sum = (i: 0 | 1 | 2) => directions.reduce((a, v) => a + v[i], 0);
  const [x, y, z] = [sum(0), sum(1), sum(2)];
  const length = Math.hypot(x, y, z) || 1;
  const direction: Vector = [x / length, y / length, z / length];
  const nearest = Math.min(...directions.map((v) => Math.min(1, dot(direction, v))));
  // The tangent of the widest angle from the middle; a figure past the horizon of the lens is too wide.
  const spread = nearest > 0.05 ? Math.sqrt(1 - nearest * nearest) / nearest : Infinity;
  const half = Math.tan(toRad(view.horizontalFov) / 2);
  const fit = spread > 1e-6 ? (FILL * half) / spread : MAX_SCALE;
  return {
    body: null,
    direction,
    scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, fit)),
    centered: directions.length > 1,
  };
}

/** The lens for a pose, zoomed in on `aim` by `amount` from 0 to 1. Sees horizon directions. */
export function zoomedLens(
  pose: Pose,
  view: Viewport,
  turn: SkyTurn,
  aim: ZoomAim | null,
  amount: number,
): Lens {
  'worklet';
  const lens = lensFor(pose, view);
  if (!aim || amount === 0) return lens;
  const at = projectThrough(
    lens,
    aim.body ? turn.bodies[aim.body] : rotate(turn.rotation, aim.direction),
  );
  if (!at) return lens;
  const scale = Math.pow(aim.scale, amount);
  const drift = aim.centered ? amount : 0;
  return {
    ...lens,
    centerX: at.x + (lens.centerX - at.x) * (scale + drift),
    centerY: at.y + (lens.centerY - at.y) * (scale + drift),
    focal: lens.focal * scale,
  };
}
