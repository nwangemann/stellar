import { deg, toRad } from '../units';
import { BODY_IDS, bodyPosition, type BodyId } from './bodies';
import type { Observer } from './coordinates';
import horizons from './fixtures/horizons.json';
import { toAltAz } from './horizontal';

const PLACES: Record<string, Observer> = {
  newYork: { lat: deg(40.7128), lon: deg(-74.006) },
  sydney: { lat: deg(-33.8688), lon: deg(151.2093) },
};
const limit = (body: string) => (body === 'moon' ? 0.1 : 0.05);

/** Angle in degrees between two directions given as longitude and latitude. */
function separation(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const r = (n: number) => toRad(deg(n));
  const h =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return (2 * Math.asin(Math.sqrt(h)) * 180) / Math.PI;
}

test('the fixtures cover every body at both places', () => {
  const covered = new Set(horizons.map((f) => `${f.body} ${f.place}`));
  expect(covered.size).toBe(BODY_IDS.length * Object.keys(PLACES).length);
});

test.each(horizons)('$body from $place at $utc matches JPL Horizons', (f) => {
  const observer = PLACES[f.place]!;
  const date = new Date(f.utc);
  const p = bodyPosition(f.body as BodyId, observer, date);
  expect(separation(p.ra, p.dec, f.ra, f.dec)).toBeLessThan(limit(f.body));
  const at = toAltAz(p, observer, date);
  expect(separation(at.az, at.alt, f.az, f.alt)).toBeLessThan(limit(f.body));
});

test('the Moon shows parallax between the two places', () => {
  const at = new Date('2000-01-01T12:00:00Z');
  const [a, b] = Object.values(PLACES).map((o) => bodyPosition('moon', o, at));
  expect(separation(a!.ra, a!.dec, b!.ra, b!.dec)).toBeGreaterThan(1);
});
