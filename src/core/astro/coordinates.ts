import type { Degrees } from '../units';

/** Horizontal coordinates. Azimuth runs clockwise from true north. */
export interface AltAz {
  readonly kind: 'altaz';
  readonly alt: Degrees;
  readonly az: Degrees;
}

/** Equatorial coordinates (J2000). RA is held in degrees, not hours. */
export interface RaDec {
  readonly kind: 'radec';
  readonly ra: Degrees;
  readonly dec: Degrees;
}

export interface Observer {
  readonly lat: Degrees;
  readonly lon: Degrees;
}
