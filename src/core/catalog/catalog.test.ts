import { BODY_IDS, bodyPosition, type BodyId } from '../astro/bodies';
import { toAltAz } from '../astro/horizontal';
import { STORIES } from '../../data/mythology';
import {
  constellationById,
  constellationOf,
  CONSTELLATIONS,
  figureLines,
  papersFor,
  segments,
  starById,
  starsIn,
} from './catalog';
import { createSky, DEMO_OBSERVER } from './sky';

test('has the 88 constellations plus the Pleiades, and every line star', () => {
  expect(CONSTELLATIONS).toHaveLength(89);
  for (const c of CONSTELLATIONS) {
    expect(starsIn(c.lines)).toHaveLength(new Set(c.lines.flat()).size);
    expect(segments(c.lines).length).toBeGreaterThan(0);
  }
});
test('Betelgeuse has its known values', () => {
  const star = starById('hip-27989')!;
  expect(star.name).toBe('Betelgeuse');
  expect(star.position.ra).toBeCloseTo(88.793, 2);
  expect(constellationOf(star.id)?.id).toBe('Ori');
  expect(papersFor(star.id).length).toBeGreaterThan(0);
});
test('papers about instruments with a star name are left out', () => {
  const titles = papersFor('hip-80763').map((p) => p.title);
  expect(titles.length).toBeGreaterThan(0);
  expect(titles.join()).not.toMatch(/ANTARES/);
});
test('every story points at a known constellation, figure and source', () => {
  for (const s of STORIES) {
    expect(constellationById(s.constellation)).toBeDefined();
    expect(s.source.url).toMatch(/^https:/);
    if (s.figure) expect(starsIn(figureLines(s.figure)).length).toBeGreaterThan(1);
  }
  expect(new Set(STORIES.map((s) => s.constellation)).size).toBe(10);
});
test('Polaris stands at about the latitude of the observer', () => {
  const sky = createSky(DEMO_OBSERVER, new Date('2026-11-25T03:00:00Z'));
  expect(Math.abs(sky.find((o) => o.name === 'Polaris')!.position.alt - 40)).toBeLessThan(1);
});
test('bodies are in the sky, precessed only once, and are not stars or figures', () => {
  const date = new Date('2026-11-25T03:00:00Z');
  const bodies = createSky(DEMO_OBSERVER, date).filter((o) => o.kind === 'body');
  expect(bodies.map((o) => o.id)).toEqual([...BODY_IDS]);
  for (const o of bodies) {
    const expected = toAltAz(
      bodyPosition(o.id as BodyId, DEMO_OBSERVER, date),
      DEMO_OBSERVER,
      date,
    );
    expect(o.position).toEqual(expected);
    expect(starById(o.id)).toBeUndefined();
    expect(constellationOf(o.id)).toBeUndefined();
  }
});
