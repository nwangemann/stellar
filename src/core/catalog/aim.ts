import type { Target } from '../layers/types';
import { altAzVector, dot, type Vector } from '../astro/vector';
import { constellationById, constellationOf, starsIn } from './catalog';
import type { SkyObject } from './types';

/**
 * The object to point at to find a target, or null when nothing of it is above the horizon.
 * For a constellation, the line star nearest the middle of the figure among those that are up:
 * the middle itself may be empty sky.
 */
export function aimAt(
  { kind, id }: Pick<Target, 'kind' | 'id'>,
  sky: readonly SkyObject[],
): SkyObject | null {
  if (kind !== 'constellation')
    return sky.find((o) => o.kind === kind && o.id === id && o.position.alt > 0) ?? null;
  const lineStars = new Set(starsIn(constellationById(id)?.lines ?? []).map((s) => s.id));
  const placed = sky
    .filter((o) => lineStars.has(o.id))
    .map((object) => ({ object, v: altAzVector(object.position) }));
  const middle = placed.reduce<Vector>(
    (m, { v }) => [m[0] + v[0], m[1] + v[1], m[2] + v[2]],
    [0, 0, 0],
  );
  // A star shared with another figure may lock on to that one instead.
  const up = placed.filter((p) => p.v[2] > 0 && constellationOf(p.object.id)?.id === id);
  return (
    up.reduce<(typeof up)[number] | null>(
      (best, p) => (best && dot(best.v, middle) >= dot(p.v, middle) ? best : p),
      null,
    )?.object ?? null
  );
}
