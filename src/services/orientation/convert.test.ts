import { poseFromOrientation } from '@/core/pose/orientation';
import { deg } from '@/core/units';
import { declinationFromHeading, orientationFromMotion } from './convert';

const rad = (d: number) => (d * Math.PI) / 180;
const azimuth = (alpha: number, declination: number, platform: 'ios' | 'android') =>
  poseFromOrientation(
    orientationFromMotion(
      { alpha: rad(alpha), beta: rad(90), gamma: 0 },
      deg(declination),
      platform,
    ),
  ).az;

test('declination wraps, keeps its sign and can be unknown', () => {
  expect(declinationFromHeading(5, 355)).toBe(10);
  expect(declinationFromHeading(355, 5)).toBe(-10);
  expect(declinationFromHeading(-8, 2)).toBe(-10);
  expect(declinationFromHeading(-1, 40)).toBeNull();
});

test('upright iPhone with its x axis at magnetic north faces magnetic west', () => {
  expect(azimuth(0, 0, 'ios')).toBeCloseTo(270);
  expect(azimuth(-180, 0, 'ios')).toBeCloseTo(90);
});

test('Android alpha is zero at magnetic north', () => {
  expect(azimuth(-90, 0, 'android')).toBeCloseTo(90);
});

test.each(['ios', 'android'] as const)('east declination raises the azimuth on %s', (platform) => {
  expect(azimuth(-120, 10, platform) - azimuth(-120, 0, platform)).toBeCloseTo(10);
});
