import { orientationFromAngles, type Orientation } from '@/core/pose/orientation';
import { deg, toDeg, type Degrees, type Radians } from '@/core/units';

/** DeviceMotion's `rotation`. Despite the web-style names, it is in radians. */
export interface MotionRotation {
  readonly alpha: number;
  readonly beta: number;
  readonly gamma: number;
}

/**
 * Angle to add to a magnetic heading: `true = magnetic + declination`.
 * Null while the platform has no location to work it out from; both report that as -1.
 * Android's true heading can be slightly negative, so only -1 itself means unknown.
 */
export function declinationFromHeading(trueHeading: number, magHeading: number): Degrees | null {
  if (trueHeading === -1) return null;
  const turn = (((trueHeading - magHeading) % 360) + 360) % 360;
  return deg(turn > 180 ? turn - 360 : turn);
}

/**
 * DeviceMotion angles to the frame of `Orientation`.
 * iOS measures from x = magnetic north, y = west; Android from x = east, y = magnetic north.
 */
export function orientationFromMotion(
  { alpha, beta, gamma }: MotionRotation,
  declination: Degrees,
  platform: 'ios' | 'android',
): Orientation {
  const fromRad = (r: number) => toDeg(r as Radians);
  const frame = platform === 'ios' ? 90 : 0;
  // Alpha is counter-clockwise and headings are clockwise, so declination is subtracted.
  return orientationFromAngles(
    deg(fromRad(alpha) + frame - declination),
    fromRad(beta),
    fromRad(gamma),
  );
}
