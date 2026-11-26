import { eciToGeodetic, gstime, propagate, twoline2satrec } from 'satellite.js';
import { deg } from '../units';
import { BUNDLED_SATELLITES } from './bundled';
import { parseTle, satelliteView, sunlit, toSatellite } from './orbit';

// Vallado et al., "Revisiting Spacetrack Report #3" (2006), test case 00005 at its epoch.
const VANGUARD = {
  name: 'VANGUARD 1',
  line1: '1 00005U 58002B   00179.78495062  .00000023  00000-0  28098-4 0  4753',
  line2: '2 00005  34.2682 348.7242 1859667 331.7664  19.3264 10.82419157413667',
};

describe('satellite orbits', () => {
  it('parses three-line TLE text and skips broken sets', () => {
    const text = `${VANGUARD.name}\n${VANGUARD.line1}\n${VANGUARD.line2}\nJUNK\n1 bad\n`;
    expect(parseTle(text)).toEqual([VANGUARD]);
  });

  it('matches the published SGP4 reference at epoch', () => {
    const sat = toSatellite(VANGUARD)!;
    expect(sat.id).toBe('00005');
    const view = satelliteView(sat, { observer: { lat: deg(0), lon: deg(0) }, date: sat.epoch });
    expect(view).not.toBeNull();
    // Reference r = (7022.46529266, -1400.08296755, 0.03995155) km, v = (1.893841015, 6.405893759, 4.534807250) km/s.
    expect(view!.speedKmS).toBeCloseTo(Math.hypot(1.893841015, 6.405893759, 4.53480725), 5);
    const r = Math.hypot(7022.46529266, -1400.08296755, 0.03995155);
    expect(view!.heightKm).toBeGreaterThan(r - 6378.2);
    expect(view!.heightKm).toBeLessThan(r - 6356.7);
  });

  it('puts the ISS overhead for an observer beneath it', () => {
    const iss = BUNDLED_SATELLITES[0]!;
    expect(iss.name).toBe('ISS (ZARYA)');
    const date = new Date(iss.epoch.getTime() + 3_600_000);
    const ground = eciToGeodetic(propagate(iss.satrec, date)!.position, gstime(date));
    const observer = {
      lat: deg((ground.latitude * 180) / Math.PI),
      lon: deg((ground.longitude * 180) / Math.PI),
    };
    const view = satelliteView(iss, { observer, date })!;
    expect(view.position.alt).toBeGreaterThan(89.5);
    expect(view.heightKm).toBeGreaterThan(380);
    expect(view.heightKm).toBeLessThan(460);
    expect(view.rangeKm).toBeCloseTo(view.heightKm, -1);
    expect(view.speedKmS).toBeCloseTo(7.66, 1);
  });

  it('is lit on the day side and dark straight behind the Earth', () => {
    const sun = { x: 1.5e8, y: 0, z: 0 };
    expect(sunlit({ x: 6800, y: 0, z: 0 }, sun)).toBe(true);
    expect(sunlit({ x: -6800, y: 0, z: 0 }, sun)).toBe(false);
    expect(sunlit({ x: -3000, y: 6800, z: 0 }, sun)).toBe(true);
  });

  it('loads every bundled orbit', () => {
    expect(BUNDLED_SATELLITES).toHaveLength(20);
    expect(twoline2satrec(VANGUARD.line1, VANGUARD.line2).error).toBe(0);
  });
});
