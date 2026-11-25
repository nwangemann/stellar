import type { Observer } from '../astro/coordinates';
import { precess, toAltAz } from '../astro/horizontal';
import { deg } from '../units';
import { constellationOf, STARS } from './catalog';
import type { SkyObject } from './types';

/** Used when location is unavailable. */
export const DEMO_OBSERVER: Observer = { lat: deg(40), lon: deg(-105) };

/** Fainter stars stay in the catalog, but drawing them all every frame is not worth it. */
const DRAW_LIMIT = 5;
const visible = STARS.filter((s) => s.magnitude <= DRAW_LIMIT || constellationOf(s.id));

/** The whole sphere, so lines that cross the horizon stay intact. */
export function createSky(observer: Observer, date: Date): SkyObject[] {
  return visible.map((s) => ({
    id: s.id,
    name: s.name,
    magnitude: s.magnitude,
    position: toAltAz(precess(s.position, date), observer, date),
  }));
}
export const aboveHorizon = (o: SkyObject): boolean => o.position.alt > 0;
