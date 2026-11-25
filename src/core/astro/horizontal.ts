import { deg, toDeg, toRad, wrap360 } from '../units';
import type { AltAz, Observer, RaDec } from './coordinates';

const DAY_MS = 86_400_000;
const julianDate = (date: Date) => date.getTime() / DAY_MS + 2440587.5;

/** Moves J2000 coordinates to the equinox of the date (IAU 1976). */
export function precess(p: RaDec, date: Date): RaDec {
  const t = (julianDate(date) - 2451545) / 36525;
  const arcsec = (a: number, b: number, c: number) =>
    toRad(deg((a * t + b * t * t + c * t * t * t) / 3600));
  const zeta = arcsec(2306.2181, 0.30188, 0.017998);
  const z = arcsec(2306.2181, 1.09468, 0.018203);
  const theta = arcsec(2004.3109, -0.42665, -0.041833);
  const ra = toRad(p.ra) + zeta;
  const dec = toRad(p.dec);
  const a = Math.cos(dec) * Math.sin(ra);
  const b = Math.cos(theta) * Math.cos(dec) * Math.cos(ra) - Math.sin(theta) * Math.sin(dec);
  const c = Math.sin(theta) * Math.cos(dec) * Math.cos(ra) + Math.cos(theta) * Math.sin(dec);
  return {
    kind: 'radec',
    ra: wrap360(deg(((Math.atan2(a, b) + z) * 180) / Math.PI)),
    dec: deg((Math.atan2(c, Math.hypot(a, b)) * 180) / Math.PI),
  };
}

/** Coordinates of date to altitude and azimuth. Ignores refraction and nutation. */
export function toAltAz(p: RaDec, observer: Observer, date: Date): AltAz {
  const d = julianDate(date) - 2451545;
  const t = d / 36525;
  const gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t;
  const h = toRad(wrap360(deg(gmst + observer.lon - p.ra)));
  const dec = toRad(p.dec);
  const lat = toRad(observer.lat);
  const east = -Math.cos(dec) * Math.sin(h);
  const north = Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.cos(h) * Math.sin(lat);
  const up = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(h) * Math.cos(lat);
  const degrees = (r: number) => toDeg(r as Parameters<typeof toDeg>[0]);
  return {
    kind: 'altaz',
    alt: degrees(Math.atan2(up, Math.hypot(east, north))),
    az: wrap360(degrees(Math.atan2(east, north))),
  };
}
