import { BODY_IDS, bodyMagnitude, bodyPosition, type BodyId } from '../astro/bodies';
import type { Observer } from '../astro/coordinates';
import { skyRotation, toAltAz } from '../astro/horizontal';
import { moonPhase } from '../astro/phase';
import { altAzVector, raDecVector, rotate, vectorAltAz, type Vector } from '../astro/vector';
import { deg } from '../units';
import { constellationOf, STARS } from './catalog';
import type { SkyMark, SkyObject, SkyTurn, StarMark } from './types';

/** Used when location is unavailable. */
export const DEMO_OBSERVER: Observer = { lat: deg(40), lon: deg(-105) };

/** Fainter stars stay in the catalog, but drawing them all every frame is not worth it. */
const DRAW_LIMIT = 5;
const visible = STARS.filter((s) => s.magnitude <= DRAW_LIMIT || constellationOf(s.id));
const starMarks = visible.map((s): StarMark => ({
  kind: 'star',
  id: s.id,
  magnitude: s.magnitude,
  direction: raDecVector(s.position),
}));
/** Everything in the sky, independent of time and place. */
export const MARKS: readonly SkyMark[] = [
  ...starMarks,
  ...BODY_IDS.map((id): SkyMark => ({ kind: 'body', id })),
];

export const BODY_NAMES: Record<BodyId, string> = {
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
  const rotation = skyRotation(observer, date);
  const stars = visible.map((s, i): SkyObject => ({
    kind: 'star',
    id: s.id,
    name: s.name,
    magnitude: s.magnitude,
    position: vectorAltAz(rotate(rotation, starMarks[i]!.direction)),
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

/** The part of a sky that the UI thread needs to place `MARKS`. */
export function skyTurn(sky: readonly SkyObject[], observer: Observer, date: Date): SkyTurn {
  const places = new Map(sky.filter((o) => o.kind === 'body').map((o) => [o.id, o.position]));
  const bodies = Object.fromEntries(
    BODY_IDS.map((id) => [id, altAzVector(places.get(id)!)]),
  ) as Record<BodyId, Vector>;
  const { lit, towardSun } = moonPhase(places.get('moon')!, places.get('sun')!);
  return {
    rotation: skyRotation(observer, date),
    bodies,
    moon: { lit, towardSun: altAzVector(towardSun) },
  };
}
