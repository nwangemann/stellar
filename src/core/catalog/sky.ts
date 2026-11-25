import { BODY_IDS, bodyMagnitude, bodyPosition, type BodyId } from '../astro/bodies';
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

const BODY_NAMES: Record<BodyId, string> = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
};

/** The whole sphere, so lines that cross the horizon stay intact. */
export function createSky(observer: Observer, date: Date): SkyObject[] {
  const stars = visible.map((s): SkyObject => ({
    kind: 'star',
    id: s.id,
    name: s.name,
    magnitude: s.magnitude,
    position: toAltAz(precess(s.position, date), observer, date),
  }));
  // Body positions are already of date, so they are not precessed.
  const bodies = BODY_IDS.map((id): SkyObject => ({
    kind: 'body',
    id,
    name: BODY_NAMES[id],
    magnitude: bodyMagnitude(id, date),
    position: toAltAz(bodyPosition(id, observer, date), observer, date),
  }));
  return [...stars, ...bodies];
}
export const aboveHorizon = (o: SkyObject): boolean => o.position.alt > 0;
