import { deg } from '../units';
import { litOutline, moonPhase } from './phase';

const at = (alt: number, az: number) => ({ kind: 'altaz' as const, alt: deg(alt), az: deg(az) });
const area = (points: { x: number; y: number }[]) =>
  points.reduce((sum, p, i) => {
    const q = points[(i + 1) % points.length]!;
    return sum + (p.x * q.y - q.x * p.y) / 2;
  }, 0);

test('lit fraction follows the distance from the Sun', () => {
  expect(moonPhase(at(20, 100), at(20, 100)).lit).toBeCloseTo(0);
  expect(moonPhase(at(0, 190), at(0, 100)).lit).toBeCloseTo(0.5);
  expect(moonPhase(at(-20, 280), at(20, 100)).lit).toBeCloseTo(1);
});
test('the bright limb faces the Sun', () => {
  const { towardSun } = moonPhase(at(0, 190), at(0, 270));
  expect((towardSun.az + 360) % 360).toBeCloseTo(191);
  expect(towardSun.alt).toBeCloseTo(0);
  expect(moonPhase(at(40, 180), at(-30, 180)).towardSun.alt).toBeCloseTo(39);
});
test.each([0, 0.25, 0.5, 0.9, 1])('the outline covers a lit fraction of %d', (lit) => {
  expect(area(litOutline(lit)) / Math.PI).toBeCloseTo(lit, 1);
});
