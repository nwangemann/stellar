import { rotate } from '../astro/vector';
import { starById } from '../catalog/catalog';
import { createSky, DEMO_OBSERVER, MARKS, skyTurn } from '../catalog/sky';
import type { StarMark } from '../catalog/types';
import { facing } from '../pose/pose';
import { deg, px } from '../units';
import { lensFor, projectThrough, type Viewport } from './projection';
import { zoomedLens, zoomFor } from './zoom';

const view: Viewport = { width: px(400), height: px(800), horizontalFov: deg(60) };
const date = new Date('2026-11-25T03:00:00Z');
const turn = skyTurn(createSky(DEMO_OBSERVER, date), DEMO_OBSERVER, date);
const sky = createSky(DEMO_OBSERVER, date);
const index = sky.findIndex((o) => o.kind === 'star' && o.position.alt > 30 && !!starById(o.id));
const mark = MARKS[index] as StarMark;
const base = facing(sky[index]!.position);
const pose = { ...base, alt: deg(base.alt + 4), roll: deg(20) };
const place = (lens: ReturnType<typeof lensFor>) =>
  projectThrough(lens, rotate(turn.rotation, mark.direction))!;

test('a zoomed star stays where it is', () => {
  const aim = zoomFor([mark.direction], view);
  expect(aim.scale).toBe(6);
  const before = place(lensFor(pose, view));
  const after = place(zoomedLens(pose, view, turn, aim, 1));
  expect(after.x).toBeCloseTo(before.x);
  expect(after.y).toBeCloseTo(before.y);
});
test('a zoomed figure ends at the screen centre', () => {
  const aim = { ...zoomFor([mark.direction], view), centered: true };
  const after = place(zoomedLens(pose, view, turn, aim, 1));
  expect(after.x).toBeCloseTo(200);
  expect(after.y).toBeCloseTo(400);
});
test('a figure too wide for the screen barely zooms', () => {
  expect(zoomFor([[1, 0, 0], [0, 1, 0]], view).scale).toBe(1.15); // prettier-ignore
});
