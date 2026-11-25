import type { Degrees } from '../units';

/** Horizontal coordinates. Azimuth runs clockwise from true north. */
export interface AltAz {
  readonly kind: 'altaz';
  readonly alt: Degrees;
  readonly az: Degrees;
}

/**
 * Equatorial coordinates. RA is held in degrees, not hours.
 * Catalog stars are J2000; `precess` and `bodyPosition` return coordinates of date.
 */
export interface RaDec {
  readonly kind: 'radec';
  readonly ra: Degrees;
  readonly dec: Degrees;
}

export interface Observer {
  readonly lat: Degrees;
  readonly lon: Degrees;
}

/** A place and a time to see the sky from. */
export interface Moment {
  readonly observer: Observer;
  readonly date: Date;
}
