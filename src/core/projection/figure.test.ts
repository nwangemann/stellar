import { deg } from '../units';
import { fitFigure } from './figure';

const at = (ra: number, dec: number) => ({ kind: 'radec' as const, ra: deg(ra), dec: deg(dec) });

test('puts north up and east left, inside the padding, across 0h', () => {
  const [east, west, north] = fitFigure([at(5, 0), at(355, 0), at(0, 5)], 200, 100, 10);
  expect(east!.x).toBeLessThan(west!.x);
  expect(north!.y).toBeLessThan(east!.y);
  for (const p of [east!, west!, north!]) {
    expect(p.x).toBeGreaterThanOrEqual(9.99);
    expect(p.x).toBeLessThanOrEqual(190.01);
    expect(p.y).toBeGreaterThanOrEqual(9.99);
    expect(p.y).toBeLessThanOrEqual(90.01);
  }
});
