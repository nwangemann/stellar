import type { Moment } from '@/core/astro/coordinates';
import { orbitAgeMs, tooOldToTrust } from '@/core/satellites/age';
import { satelliteView, type Satellite } from '@/core/satellites/orbit';
import type { Fact } from '@/features/stars/facts';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

function age(ms: number): string {
  if (ms < DAY_MS) {
    const hours = Math.max(1, Math.round(ms / HOUR_MS));
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  const days = Math.round(ms / DAY_MS);
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

/** Height, speed, sunlight and how far the orbit data is from the moment, with a warning past the limit. */
export function satelliteFacts(satellite: Satellite, moment: Moment): Fact[] {
  const view = satelliteView(satellite, moment);
  const ageMs = orbitAgeMs(satellite, moment.date);
  const before = moment.date < satellite.epoch;
  const orbit: Fact = tooOldToTrust(ageMs)
    ? {
        label: 'Orbit data',
        value: `${age(ageMs)} ${before ? 'ahead' : 'old'}, too far to trust: it may be well off`,
      }
    : { label: 'Orbit data', value: `${age(ageMs)} ${before ? 'ahead' : 'old'}` };
  if (!view) return [{ label: 'Position', value: 'unknown: the orbit cannot be computed' }, orbit];
  return [
    { label: 'Height', value: `${Math.round(view.heightKm).toLocaleString('en-US')} km` },
    { label: 'Speed', value: `${view.speedKmS.toFixed(1)} km/s` },
    { label: 'Sunlight', value: view.sunlit ? 'Sunlit' : "In Earth's shadow" },
    orbit,
  ];
}
