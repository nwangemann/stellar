import { applyDrag, INITIAL_POSE } from '../pose/pose';
import { deg, px } from '../units';
import { hitTest, project, type Viewport } from './projection';

const view: Viewport = { width: px(400), height: px(800), horizontalFov: deg(60) };
const at = (alt: number, az: number) => ({ kind: 'altaz' as const, alt: deg(alt), az: deg(az) });
const pose = { alt: deg(0), az: deg(0), roll: deg(0) };

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
test('hit test picks the closest, but keeps the locked target a little longer', () => {
  const star = (id: string, az: number) => ({ id, name: id, magnitude: 1, position: at(0, az) });
  const sky = [star('far', 8), star('near', 1)];
  expect(hitTest(sky, pose, view, 44, null)!.object.id).toBe('near');
  expect(hitTest(sky, pose, view, 44, 'far')!.object.id).toBe('far');
  expect(hitTest(sky, pose, view, 2, null)).toBeNull();
});
