import { precess, toAltAz } from '../astro/horizontal';
import { altAzVector, unrotate } from '../astro/vector';
import { starById } from '../catalog/catalog';
import { createSky, DEMO_OBSERVER, MARKS, skyTurn } from '../catalog/sky';
import { applyDrag, INITIAL_POSE } from '../pose/pose';
import { deg, px } from '../units';
import { hitTest, lensFor, project, projectThrough, starLens, type Viewport } from './projection';

const view: Viewport = { width: px(400), height: px(800), horizontalFov: deg(60) };
const at = (alt: number, az: number) => ({ kind: 'altaz' as const, alt: deg(alt), az: deg(az) });
const pose = { alt: deg(0), az: deg(0), roll: deg(0) };

const date = new Date('2026-11-25T03:00:00Z');
const sky = createSky(DEMO_OBSERVER, date);

test('the aim point is the screen centre', () => {
  const p = project(at(40, 180), INITIAL_POSE, view)!;
  expect(p.x).toBeCloseTo(200);
  expect(p.y).toBeCloseTo(400);
});
test('half the field of view lands on the screen edge', () => {
  expect(project(at(0, 30), pose, view)!.x).toBeCloseTo(400);
});
test('up is up, and east is right when facing north', () => {
  expect(project(at(10, 0), pose, view)!.y).toBeLessThan(400);
  expect(project(at(0, 10), pose, view)!.x).toBeGreaterThan(200);
});
test('objects behind the camera are dropped', () => {
  expect(project(at(0, 180), pose, view)).toBeNull();
});
test('rolling the phone clockwise turns the image counter-clockwise', () => {
  const p = project(at(10, 0), { ...pose, roll: deg(90) }, view)!;
  expect(p.x).toBeLessThan(200);
  expect(p.y).toBeCloseTo(400);
});
test('dragging right moves the sky right, across north', () => {
  expect(applyDrag(pose, 10, 0, 1).az).toBe(350);
});
test('the hit test picks the closest, but keeps the locked target a little longer', () => {
  const turn = skyTurn(sky, DEMO_OBSERVER, date);
  const star = (id: string, alt: number, az: number) => ({
    kind: 'star' as const,
    id,
    magnitude: 1,
    direction: unrotate(turn.rotation, altAzVector(at(alt, az))),
  });
  const marks = [star('far', 1, 8), star('near', 1, 1), star('set', -0.1, 0)];
  expect(hitTest(marks, turn, pose, view, 44, null)!.id).toBe('near');
  expect(hitTest(marks, turn, pose, view, 44, 'far')!.id).toBe('far');
  expect(hitTest(marks, turn, pose, view, 2, null)).toBeNull();
});
test('the marks land where the sky puts the objects', () => {
  const turn = skyTurn(sky, DEMO_OBSERVER, date);
  const tilted = { alt: deg(35), az: deg(140), roll: deg(25) };
  const lens = lensFor(tilted, view);
  const stars = starLens(lens, turn);
  let seen = 0;
  MARKS.forEach((mark, i) => {
    const object = sky[i]!;
    expect(mark.id).toBe(object.id);
    const p = project(object.position, tilted, view);
    const q =
      mark.kind === 'star'
        ? projectThrough(stars, mark.direction)
        : projectThrough(lens, turn.bodies[mark.id]);
    // Placed the long way round: precession and sidereal time as angles.
    const s = starById(mark.id);
    const direct = s
      ? project(toAltAz(precess(s.position, date), DEMO_OBSERVER, date), tilted, view)
      : p;
    if (!p || !q || !direct) return;
    if (Math.hypot(q.x, q.y) > 2000) return;
    seen++;
    for (const other of [p, direct]) {
      expect(q.x).toBeCloseTo(other.x, 3);
      expect(q.y).toBeCloseTo(other.y, 3);
    }
  });
  expect(seen).toBeGreaterThan(100);
});
