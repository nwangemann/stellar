import { deg } from '../units';
import { precess, toAltAz } from './horizontal';

test('matches the worked horizontal example in Meeus, chapter 13', () => {
  const p = { kind: 'radec' as const, ra: deg(347.3193375), dec: deg(-6.719892) };
  const at = toAltAz(
    p,
    { lat: deg(38.921389), lon: deg(-77.065556) },
    new Date('1987-04-10T19:21:00Z'),
  );
  expect(at.alt).toBeCloseTo(15.125, 1);
  expect(at.az).toBeCloseTo(248.034, 1);
});
test('matches the worked precession example in Meeus, chapter 21', () => {
  const p = { kind: 'radec' as const, ra: deg(41.054063), dec: deg(49.22775) };
  const q = precess(p, new Date('2028-11-13T04:33:36Z'));
  expect(q.ra).toBeCloseTo(41.547214, 3);
  expect(q.dec).toBeCloseTo(49.348483, 3);
});
