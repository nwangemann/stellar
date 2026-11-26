import type { Moment } from '@/core/astro/coordinates';
import { orbitAgeMs, tooOldToTrust } from '@/core/satellites/age';
import { satelliteView, type Satellite } from '@/core/satellites/orbit';
import { compassPoint, PASS_SEARCH_HOURS, type Pass, type PassPoint } from '@/core/satellites/pass';
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

const when = (date: Date) =>
  date.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
const clock = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const where = ({ position }: PassPoint) =>
  `${Math.round(position.alt)}° ${compassPoint(position.az)}`;

/** One line for a pass, or for there being none: for the find panel and below-horizon notes. */
export function passSummary(pass: Pass | null, moment: Moment): string {
  if (!pass) return `No visible pass in the next ${PASS_SEARCH_HOURS} hours`;
  if (pass.start.date <= moment.date) return `Visible now, until ${clock(pass.end.date)}`;
  return `Next visible pass ${when(pass.start.date)}, from the ${compassPoint(pass.start.position.az)}`;
}

/** Where and when it appears, peaks and disappears. */
export function passFacts(pass: Pass | null, moment: Moment): Fact[] {
  if (!pass) return [{ label: 'Next pass', value: `none in the next ${PASS_SEARCH_HOURS} hours` }];
  const started = pass.start.date <= moment.date;
  return [
    {
      label: 'Appears',
      value: `${started ? 'already up' : when(pass.start.date)}, ${where(pass.start)}`,
    },
    { label: 'Highest', value: `${clock(pass.highest.date)}, ${where(pass.highest)}` },
    { label: 'Disappears', value: `${clock(pass.end.date)}, ${where(pass.end)}` },
  ];
}
