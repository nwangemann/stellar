import { bodyPosition } from '../astro/bodies';
import { toAltAz } from '../astro/horizontal';
import { DEMO_OBSERVER } from '../catalog/sky';
import { BUNDLED_SATELLITES } from './bundled';
import { satelliteView } from './orbit';
import { compassPoint, DARK_SUN_ALT, MIN_PASS_ALT, nextPass } from './pass';

const iss = BUNDLED_SATELLITES[0]!;
const observer = DEMO_OBSERVER;

describe('next visible pass', () => {
  const from = { observer, date: iss.epoch };
  const pass = nextPass(iss, from, 48)!;

  it('finds an ISS pass from the bundled orbit and keeps to the visibility rules', () => {
    expect(pass).not.toBeNull();
    const { start, highest, end } = pass;
    expect(start.date.getTime()).toBeGreaterThanOrEqual(from.date.getTime());
    expect(start.date < highest.date || start.date.getTime() === highest.date.getTime()).toBe(true);
    expect(highest.date <= end.date).toBe(true);
    expect(end.date.getTime() - start.date.getTime()).toBeLessThan(12 * 60_000);
    expect(highest.position.alt).toBeGreaterThanOrEqual(start.position.alt);
    for (const { date } of [start, highest, end]) {
      const view = satelliteView(iss, { observer, date })!;
      expect(view.sunlit).toBe(true);
      expect(view.position.alt).toBeGreaterThanOrEqual(MIN_PASS_ALT);
      expect(toAltAz(bodyPosition('sun', observer, date), observer, date).alt).toBeLessThan(
        DARK_SUN_ALT,
      );
    }
    // Two seconds either side, it is not visible: low, in shadow or in daylight.
    expect(nextPass(iss, { observer, date: new Date(start.date.getTime() - 2000) }, 0)).toBeNull();
  });

  it('returns a pass under way with its start, and none when the window is empty', () => {
    const during = { observer, date: pass.highest.date };
    expect(nextPass(iss, during)!.start.date.getTime()).toBeCloseTo(pass.start.date.getTime(), -4);
    const after = { observer, date: new Date(pass.end.date.getTime() + 2000) };
    expect(nextPass(iss, after, 0)).toBeNull();
  });

  it('names compass points', () => {
    expect([0, 44, 91, 200, 350].map(compassPoint)).toEqual(['N', 'NE', 'E', 'S', 'N']);
  });
});
