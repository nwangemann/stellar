import { deg, toDeg, toRad, wrap360, type Radians } from '../units';
import type { AltAz, RaDec } from './coordinates';

/** A unit direction: east, north, up for the horizon; x to RA 0°, z to the pole for the equator. */
export type Vector = readonly [number, number, number];
/** Three rows. */
export type Matrix = readonly [Vector, Vector, Vector];

export function dot(a: Vector, b: Vector): number {
  'worklet';
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function altAzVector(p: AltAz): Vector {
  'worklet';
  const alt = toRad(p.alt);
  const az = toRad(p.az);
  return [Math.sin(az) * Math.cos(alt), Math.cos(az) * Math.cos(alt), Math.sin(alt)];
}

export function raDecVector(p: RaDec): Vector {
  const ra = toRad(p.ra);
  const dec = toRad(p.dec);
  return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
}

export function vectorAltAz(v: Vector): AltAz {
  const degrees = (r: number) => toDeg(r as Radians);
  return {
    kind: 'altaz',
    alt: degrees(Math.atan2(v[2], Math.hypot(v[0], v[1]))),
    az: wrap360(degrees(Math.atan2(v[0], v[1]))),
  };
}

export const rotate = (m: Matrix, v: Vector): Vector => [dot(m[0], v), dot(m[1], v), dot(m[2], v)];

/** Takes a horizon direction back to the frame that `m` rotates from. */
export function unrotate(m: Matrix, v: Vector): Vector {
  'worklet';
  return [
    m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2],
    m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2],
    m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2],
  ];
}

/** The equator's axes, whose images are the columns of a rotation from it. */
export const EQUATOR_AXES: readonly [RaDec, RaDec, RaDec] = [
  { kind: 'radec', ra: deg(0), dec: deg(0) },
  { kind: 'radec', ra: deg(90), dec: deg(0) },
  { kind: 'radec', ra: deg(0), dec: deg(90) },
];
