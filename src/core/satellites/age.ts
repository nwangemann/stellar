import type { Satellite } from './orbit';

const DAY_MS = 86_400_000;

/**
 * How far past an orbit's epoch it may be used before its position is too uncertain to show
 * without a warning. A week old, the ISS can be tens of seconds early or late (ADR 18).
 */
export const ORBIT_AGE_LIMIT_MS = 7 * DAY_MS;

/** How far a moment is from the orbit's epoch, either way: time travel can go back too. */
export function orbitAgeMs(satellite: Pick<Satellite, 'epoch'>, date: Date): number {
  return Math.abs(date.getTime() - satellite.epoch.getTime());
}

/** Whether an orbit of this age is too old to trust. */
export function tooOldToTrust(ageMs: number): boolean {
  return ageMs > ORBIT_AGE_LIMIT_MS;
}
