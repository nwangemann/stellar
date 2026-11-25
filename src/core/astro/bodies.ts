import { Body, Equator, Illumination, Observer as Site } from 'astronomy-engine';
import { deg } from '../units';
import type { Observer, RaDec } from './coordinates';

const BODIES = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
} as const;

export type BodyId = keyof typeof BODIES;
export const BODY_IDS = Object.keys(BODIES) as readonly BodyId[];

/**
 * Apparent place of a body seen from the observer, at sea level, with parallax and aberration.
 * The result is already of date: pass it to `toAltAz`, never to `precess`.
 */
export function bodyPosition(id: BodyId, observer: Observer, date: Date): RaDec {
  const site = new Site(observer.lat, observer.lon, 0);
  const p = Equator(BODIES[id], date, site, true, true);
  return { kind: 'radec', ra: deg(p.ra * 15), dec: deg(p.dec) };
}

/** Apparent magnitude, seen from the centre of the Earth. */
export const bodyMagnitude = (id: BodyId, date: Date): number => Illumination(BODIES[id], date).mag;
