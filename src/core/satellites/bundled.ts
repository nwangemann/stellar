import data from '../../data/satellites.json';
import { toSatellite, type Satellite } from './orbit';

/** When the bundled orbits were fetched from CelesTrak. */
export const BUNDLED_FETCHED = new Date(`${data.fetched}T00:00:00Z`);

/** The offline fallback: about 20 bright satellites, ISS first. Stale by the age of the app build. */
export const BUNDLED_SATELLITES: readonly Satellite[] = data.satellites
  .map(toSatellite)
  .filter((s): s is Satellite => s !== null);
