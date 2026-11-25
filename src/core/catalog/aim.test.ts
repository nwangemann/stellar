import { deg } from '../units';
import { aimAt } from './aim';
import { constellationById, constellationOf, CONSTELLATIONS, starsIn } from './catalog';
import { createSky, DEMO_OBSERVER } from './sky';

const sky = createSky(DEMO_OBSERVER, new Date('2026-11-24T04:00:00Z'));
const at = (alt: number) => sky.map((o) => ({ ...o, position: { ...o.position, alt: deg(alt) } }));

test('every constellation has a star that locks on to it, unless it is below the horizon', () => {
  for (const { id } of CONSTELLATIONS) {
    const aim = aimAt({ kind: 'constellation', id }, at(10));
    expect([id, aim && constellationOf(aim.id)?.id]).toEqual([id, id]);
    expect(aimAt({ kind: 'constellation', id }, at(-10))).toBeNull();
  }
});
test('aims at the line star nearest the middle, among those that are up', () => {
  const orion = { kind: 'constellation', id: 'Ori' } as const;
  const ids = new Set(starsIn(constellationById('Ori')!.lines).map((s) => s.id));
  // Placed along a line, the middle of the figure is the middle star.
  const stars = sky.filter((o) => ids.has(o.id) && constellationOf(o.id)?.id === 'Ori').slice(0, 5);
  const row = stars.map((o, i) => ({
    ...o,
    position: { kind: 'altaz' as const, az: deg(90), alt: deg(10 + i * 5) },
  }));
  expect(aimAt(orion, row)?.id).toBe(stars[2]!.id);
  const sunk = row.map((o) => ({
    ...o,
    position: { ...o.position, alt: deg(o.position.alt - 22) },
  }));
  expect(aimAt(orion, sunk)?.id).toBe(stars[3]!.id);
});
test('aims at stars and bodies themselves, and not at unknown objects', () => {
  expect(aimAt({ kind: 'body', id: 'mars' }, at(10))?.id).toBe('mars');
  expect(aimAt({ kind: 'body', id: 'mars' }, at(0))).toBeNull();
  expect(aimAt({ kind: 'star', id: 'mars' }, at(10))).toBeNull();
});
