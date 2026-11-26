import { DEMO_OBSERVER } from '../catalog/sky';
import { BUNDLED_SATELLITES } from './bundled';
import { satelliteView } from './orbit';
import { placeAt, satelliteObjects } from './sky';

const iss = BUNDLED_SATELLITES[0]!;

describe('placeAt', () => {
  it('places a satellite afresh instead of keeping a minute-old position', () => {
    const then = { observer: DEMO_OBSERVER, date: iss.epoch };
    const now = { observer: DEMO_OBSERVER, date: new Date(iss.epoch.getTime() + 60_000) };
    const [stale] = satelliteObjects([iss], then);
    const placed = placeAt(stale!, now);
    expect(placed).toEqual(satelliteView(iss, now)!.position);
    // A minute moves the ISS by degrees, the error this guards against.
    const moved =
      Math.abs(placed.alt - stale!.position.alt) + Math.abs(placed.az - stale!.position.az);
    expect(moved).toBeGreaterThan(1);
  });
});
