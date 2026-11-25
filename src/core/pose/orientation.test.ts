import { project } from '../projection/projection';
import { deg, px } from '../units';
import {
  orientationFromAngles,
  poseFromOrientation,
  smoothOrientation,
  type Orientation,
} from './orientation';

const angles = (alpha: number, beta: number, gamma = 0) =>
  orientationFromAngles(deg(alpha), deg(beta), deg(gamma));
const view = { width: px(400), height: px(800), horizontalFov: deg(60) };

/** Device coordinates to alt-az, independent of the pose maths under test. */
function toSky(q: Orientation, v: readonly [number, number, number]) {
  const cross = (a: readonly number[], b: readonly number[]) => [
    a[1]! * b[2]! - a[2]! * b[1]!,
    a[2]! * b[0]! - a[0]! * b[2]!,
    a[0]! * b[1]! - a[1]! * b[0]!,
  ];
  const axis = [q.x, q.y, q.z];
  const t = cross(axis, v).map((c) => 2 * c);
  const u = cross(axis, t);
  const [e, n, up] = v.map((c, i) => c + q.w * t[i]! + u[i]!) as [number, number, number];
  return {
    kind: 'altaz' as const,
    az: deg((Math.atan2(e, n) * 180) / Math.PI),
    alt: deg((Math.atan2(up, Math.hypot(e, n)) * 180) / Math.PI),
  };
}

test.each([
  ['north', 0, 0],
  ['east', 270, 90],
  ['south', 180, 180],
  ['west', 90, 270],
])('upright and facing %s is level', (_, alpha, az) => {
  const pose = poseFromOrientation(angles(alpha, 90));
  expect(Math.cos(((pose.az - az) * Math.PI) / 180)).toBeCloseTo(1);
  expect(pose.alt).toBeCloseTo(0);
  expect(pose.roll).toBeCloseTo(0);
});

test('flat on a table looks straight down, and overhead looks straight up', () => {
  expect(poseFromOrientation(angles(30, 0)).alt).toBeCloseTo(-90);
  expect(poseFromOrientation(angles(30, 180)).alt).toBeCloseTo(90);
});

test('tilting back raises the view', () => {
  expect(poseFromOrientation(angles(0, 130)).alt).toBeCloseTo(40);
});

test('turning the upright phone clockwise, as its holder sees it, gives positive roll', () => {
  // Facing north with the top edge to the east: a quarter turn about the north axis.
  const h = Math.SQRT1_2;
  const level = angles(0, 90);
  const turn = { x: 0, y: h, z: 0, w: h };
  const rolled = {
    x: turn.w * level.x + turn.y * level.z,
    y: turn.w * level.y + turn.y * level.w,
    z: turn.w * level.z - turn.y * level.x,
    w: turn.w * level.w - turn.y * level.y,
  };
  const pose = poseFromOrientation(rolled);
  expect(pose.alt).toBeCloseTo(0);
  expect(pose.roll).toBeCloseTo(90);
});

// Straight up included: azimuth and roll are ambiguous there, but the picture must not be.
test.each([
  [0, 90, 0],
  [200, 110, 25],
  [75, 60, -40],
  [310, 180, 0],
  [310, 179.9, 10],
])('device directions land on the matching screen spot (%d, %d, %d)', (a, b, g) => {
  const q = angles(a, b, g);
  const pose = poseFromOrientation(q);
  const focal = 200 / Math.tan(Math.PI / 6);
  const p = project(toSky(q, [0.2, 0.3, -1]), pose, view)!;
  expect(p.x).toBeCloseTo(200 + 0.2 * focal, 3);
  expect(p.y).toBeCloseTo(400 - 0.3 * focal, 3);
});

test('smoothing crosses north the short way', () => {
  const mid = smoothOrientation(angles(10, 90), angles(350, 90), Math.LN2, 1);
  expect(Math.cos((poseFromOrientation(mid).az * Math.PI) / 180)).toBeCloseTo(1);
});

test('smoothing treats a negated quaternion as the same rotation', () => {
  const q = angles(40, 120, 10);
  const negated = { x: -q.x, y: -q.y, z: -q.z, w: -q.w };
  const pose = poseFromOrientation(smoothOrientation(q, negated, 0.5, 1));
  expect(pose.az).toBeCloseTo(poseFromOrientation(q).az);
});

test('smoothing passes over the zenith without swinging around', () => {
  // From 10 degrees short of the zenith to 10 degrees past it, azimuth flips but the view goes straight over.
  const mid = smoothOrientation(angles(0, 170), angles(0, 190), Math.LN2, 1);
  expect(poseFromOrientation(mid).alt).toBeCloseTo(90);
});
