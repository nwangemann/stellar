import { Body, GeoVector, KM_PER_AU } from 'astronomy-engine';
import {
  eciToEcf,
  eciToGeodetic,
  ecfToLookAngles,
  gstime,
  propagate,
  twoline2satrec,
  type SatRec,
} from 'satellite.js';
import type { AltAz, Moment } from '../astro/coordinates';
import { toDeg, wrap360, type Radians } from '../units';

/** One two-line element set with its name line. */
export interface Tle {
  readonly name: string;
  readonly line1: string;
  readonly line2: string;
}

export interface Satellite {
  /** NORAD catalog number, as written in the TLE. */
  readonly id: string;
  readonly name: string;
  /** When the orbit was measured. Accuracy falls as the moment moves away from it. */
  readonly epoch: Date;
  readonly satrec: SatRec;
}

export interface SatelliteView {
  readonly position: AltAz;
  /** Distance from the observer. */
  readonly rangeKm: number;
  /** Height above the WGS 84 ellipsoid. */
  readonly heightKm: number;
  /** Speed in the inertial frame. */
  readonly speedKmS: number;
  /** Whether sunlight reaches it, with a cylindrical Earth shadow. */
  readonly sunlit: boolean;
}

const EARTH_RADIUS_KM = 6378.137;
const DAY_MS = 86_400_000;

/** Reads three-line TLE text (name, line 1, line 2), as CelesTrak serves it. Skips broken sets. */
export function parseTle(text: string): Tle[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const sets: Tle[] = [];
  for (let i = 0; i + 2 < lines.length; i++) {
    const [name = '', line1 = '', line2 = ''] = lines.slice(i, i + 3);
    if (line1.startsWith('1 ') && line2.startsWith('2 ')) {
      sets.push({ name, line1, line2 });
      i += 2;
    }
  }
  return sets;
}

/** Prepares a TLE for propagation, or null if it does not parse. */
export function toSatellite(tle: Tle): Satellite | null {
  try {
    const satrec = twoline2satrec(tle.line1, tle.line2);
    if (satrec.error) return null;
    return {
      id: satrec.satnum.trim(),
      name: tle.name,
      epoch: new Date((satrec.jdsatepoch - 2440587.5) * DAY_MS),
      satrec,
    };
  } catch {
    return null;
  }
}

type Vec = { readonly x: number; readonly y: number; readonly z: number };

/**
 * True if a point lies outside the Earth's shadow, taken as a cylinder of the Earth's radius
 * pointing away from the Sun. Both vectors are geocentric, in the same frame.
 */
export function sunlit(satKm: Vec, sunKm: Vec): boolean {
  const sunLength = Math.hypot(sunKm.x, sunKm.y, sunKm.z);
  const along = (satKm.x * sunKm.x + satKm.y * sunKm.y + satKm.z * sunKm.z) / sunLength;
  if (along >= 0) return true;
  const off = Math.hypot(satKm.x, satKm.y, satKm.z) ** 2 - along * along;
  return off > EARTH_RADIUS_KM * EARTH_RADIUS_KM;
}

/**
 * Where a satellite is seen from the observer at sea level, by SGP4. Ignores refraction.
 * Null if SGP4 fails, for example after the satellite has decayed.
 */
export function satelliteView(
  satellite: Satellite,
  { observer, date }: Moment,
): SatelliteView | null {
  const state = propagate(satellite.satrec, date);
  if (!state) return null;
  const { position, velocity } = state;
  const gmst = gstime(date);
  const site = {
    latitude: (observer.lat * Math.PI) / 180,
    longitude: (observer.lon * Math.PI) / 180,
    height: 0,
  };
  const look = ecfToLookAngles(site, eciToEcf(position, gmst));
  // The Sun is J2000 and SGP4 is of date; 0.4° of precession is far below the shadow's precision.
  const sun = GeoVector(Body.Sun, date, true);
  const au = (n: number) => n * KM_PER_AU;
  return {
    position: {
      kind: 'altaz',
      alt: toDeg(look.elevation as Radians),
      az: wrap360(toDeg(look.azimuth as Radians)),
    },
    rangeKm: look.rangeSat,
    heightKm: eciToGeodetic(position, gmst).height,
    speedKmS: Math.hypot(velocity.x, velocity.y, velocity.z),
    sunlit: sunlit(position, { x: au(sun.x), y: au(sun.y), z: au(sun.z) }),
  };
}
