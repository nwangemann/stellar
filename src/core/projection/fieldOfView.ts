import { deg, toDeg, type Degrees, type Radians } from '../units';

/** With no camera picture to match, any width works; this one is comfortable to look around in. */
export const OPEN_SKY_FOV = deg(60);

/** A main phone camera, in 35mm film equivalent millimetres. */
const TYPICAL_FOCAL = 26;
/** Half sides of a 4:3 picture with the 35mm frame's diagonal, which equivalent focal lengths refer to. */
const HALF_LONG = 17.31;
const HALF_SHORT = 12.98;

/**
 * Horizontal field of view of a portrait 4:3 camera picture centre-cropped to cover the screen.
 * Values too short for a 35mm equivalent are replaced: Android reports the real focal length.
 */
export function coverFieldOfView(
  width: number,
  height: number,
  focal: number | undefined,
): Degrees {
  const f = focal !== undefined && focal >= 10 ? focal : TYPICAL_FOCAL;
  const half = Math.min(HALF_SHORT, (HALF_LONG * width) / height);
  return toDeg((2 * Math.atan(half / f)) as Radians);
}
