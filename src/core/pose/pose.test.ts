import { deg } from '../units';
import { facing, turnStart, type Pose } from './pose';

const pose = (az: number): Pose => ({ az: deg(az), alt: deg(0), roll: deg(0) });

test.each([
  [350, 10, -10],
  [10, 350, 370],
  [100, 200, 100],
  [0, 270, 360],
])('turning from %d to %d starts at %d, the short way round', (from, to, start) => {
  expect(turnStart(pose(from), pose(to)).az).toBeCloseTo(start);
});
test('facing stops where dragging does, and is level', () => {
  expect(facing({ kind: 'altaz', az: deg(20), alt: deg(89.5) })).toEqual({
    az: 20,
    alt: 88,
    roll: 0,
  });
});
