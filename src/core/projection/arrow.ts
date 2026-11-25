import { dot, type Vector } from '../astro/vector';
import type { Lens } from './projection';

/** The part of the screen the arrow may use, in pixels. */
export interface Box {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

export interface Arrow {
  readonly x: number;
  readonly y: number;
  /** Radians, clockwise on screen from pointing right. */
  readonly angle: number;
}

/**
 * An arrow from the screen centre towards a direction, the short way round: at the edge of the box,
 * or `gap` short of the point once that is inside. Null within the gap.
 */
export function arrowTo(lens: Lens, v: Vector, box: Box, gap: number): Arrow | null {
  'worklet';
  const depth = dot(lens.forward, v);
  let dx = dot(lens.right, v);
  let dy = -dot(lens.up, v);
  // Unlike the projection, these keep their signs behind the viewer.
  let length = Math.hypot(dx, dy);
  if (length < 1e-9) {
    if (depth > 0) return null;
    // Directly behind, every way is as short.
    dx = 1;
    dy = 0;
    length = 1;
  }
  const distance = depth > 0.01 ? (length / depth) * lens.focal : Infinity;
  if (distance <= gap) return null;
  dx /= length;
  dy /= length;
  const acrossX = dx === 0 ? Infinity : ((dx > 0 ? box.right : box.left) - lens.centerX) / dx;
  const acrossY = dy === 0 ? Infinity : ((dy > 0 ? box.bottom : box.top) - lens.centerY) / dy;
  const reach = Math.max(0, Math.min(acrossX, acrossY, distance - gap));
  return {
    x: lens.centerX + dx * reach,
    y: lens.centerY + dy * reach,
    angle: Math.atan2(dy, dx),
  };
}
