import {
  Body,
  Equator,
  Illumination,
  KM_PER_AU,
  MoonPhase,
  Observer as Site,
  SearchRiseSet,
} from 'astronomy-engine';
import { deg, type Degrees } from '../units';
import type { Moment, Observer, RaDec } from './coordinates';

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
export const isBodyId = (id: string): id is BodyId => Object.hasOwn(BODIES, id);

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

export interface BodyDetails {
  /** Distance from the observer. */
  readonly distanceKm: number;
  readonly magnitude: number;
  /** Lit fraction of the disc, 0 to 1, seen from the centre of the Earth. */
  readonly lit: number;
  /** Next rise and set of the upper limb, with standard refraction. Null if none is near. */
  readonly rise: Date | null;
  readonly set: Date | null;
}

/** The Moon rises about 25 hours apart, so one day can miss an event. */
export const RISE_SET_DAYS = 2;

export function bodyDetails(id: BodyId, { observer, date }: Moment): BodyDetails {
  const body = BODIES[id];
  const site = new Site(observer.lat, observer.lon, 0);
  const light = Illumination(body, date);
  const next = (direction: 1 | -1) =>
    SearchRiseSet(body, site, direction, date, RISE_SET_DAYS)?.date ?? null;
  return {
    distanceKm: Equator(body, date, site, true, true).dist * KM_PER_AU,
    magnitude: light.mag,
    lit: light.phase_fraction,
    rise: next(1),
    set: next(-1),
  };
}

/** How far the Moon is past new, 0 to 360 degrees along the ecliptic. */
export const moonAge = (date: Date): Degrees => deg(MoonPhase(date));
