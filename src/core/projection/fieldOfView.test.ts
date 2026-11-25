import { coverFieldOfView } from './fieldOfView';

test('a tall screen crops the sides; a wide one shows the full short side', () => {
  expect(coverFieldOfView(393, 852, 26)).toBeCloseTo(34.14, 2);
  expect(coverFieldOfView(800, 1000, 26)).toBeCloseTo(53.1, 1);
});

test('a missing or real focal length falls back to a typical camera', () => {
  expect(coverFieldOfView(393, 852, undefined)).toBe(coverFieldOfView(393, 852, 26));
  expect(coverFieldOfView(393, 852, 5.4)).toBe(coverFieldOfView(393, 852, 26));
});
