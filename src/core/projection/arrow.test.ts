import { altAzVector } from '../astro/vector';
import { deg, px } from '../units';
import { arrowTo } from './arrow';
import { lensFor } from './projection';

const view = { width: px(400), height: px(800), horizontalFov: deg(60) };
const box = { left: 40, top: 100, right: 360, bottom: 600 };
const arrow = (alt: number, az: number, roll = 0, poseAlt = 0) =>
  arrowTo(
    lensFor({ alt: deg(poseAlt), az: deg(0), roll: deg(roll) }, view),
    altAzVector({ kind: 'altaz', alt: deg(alt), az: deg(az) }),
    box,
    36,
  );

test('off screen, it sits on the edge and points the way to turn', () => {
  expect(arrow(0, 60)).toMatchObject({ x: 360, y: 400 });
  expect(arrow(0, 300)!.x).toBeCloseTo(40);
  expect(arrow(80, 0)!.y).toBeCloseTo(100);
  expect(arrow(80, 0)!.angle).toBeCloseTo(-Math.PI / 2);
  expect(arrow(-80, 0)!.y).toBeCloseTo(600);
});
test('behind the viewer, it points the short way round', () => {
  expect(arrow(0, 170)!.x).toBeCloseTo(360);
  expect(arrow(0, 190)!.x).toBeCloseTo(40);
  expect(arrow(60, 180)!.y).toBeCloseTo(100);
  // Over the zenith is shorter than turning round.
  expect(arrow(70, 180, 0, 70)!.angle).toBeCloseTo(-Math.PI / 2);
});
test('directly behind, it still points somewhere', () => {
  const a = arrow(0, 180)!;
  expect(Number.isFinite(a.x + a.y + a.angle)).toBe(true);
});
test('it turns with the roll of the phone', () => {
  // Rolled clockwise, the zenith is to the left of the screen.
  expect(arrow(80, 0, 90)!.x).toBeCloseTo(40);
});
test('on screen, it stops short of the point and vanishes near the centre', () => {
  const point = 200 + (200 / Math.tan(Math.PI / 6)) * Math.tan(Math.PI / 12);
  expect(arrow(0, 15)!.x).toBeCloseTo(point - 36);
  expect(arrow(0, 2)).toBeNull();
  expect(arrow(0, 0)).toBeNull();
});
