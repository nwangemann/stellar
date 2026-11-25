import { project } from '../projection/projection';
import { deg, px } from '../units';
import { alignPose, dragAlignment } from './alignment';

const view = { width: px(400), height: px(800), horizontalFov: deg(60) };

test.each([0, 90, -40])(
  'the sky follows an alignment drag along the horizon at roll %d',
  (roll) => {
    const pose = { az: deg(359), alt: deg(20), roll: deg(roll) };
    const r = (roll * Math.PI) / 180;
    const [dx, dy] = [10 * Math.cos(r), -10 * Math.sin(r)];
    const correction = dragAlignment(deg(0), pose, dx, dy, 0.1);
    const star = { kind: 'altaz' as const, az: deg(359), alt: deg(20) };
    const p = project(star, alignPose(pose, correction), view)!;
    const moved = (p.x - 200) * Math.cos(r) - (p.y - 400) * Math.sin(r);
    expect(moved).toBeGreaterThan(5);
  },
);

test('the correction stays within half a turn', () => {
  const pose = { az: deg(0), alt: deg(0), roll: deg(0) };
  expect(dragAlignment(deg(-175), pose, 10, 0, 1)).toBe(175);
});
