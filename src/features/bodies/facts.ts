import { bodyDetails, isBodyId, moonAge, RISE_SET_DAYS } from '@/core/astro/bodies';
import type { Moment } from '@/core/astro/coordinates';
import type { Fact } from '@/features/stars/facts';

/** Half a day of the Moon's motion: how close counts as new, quarter or full. */
const NEAR = 6;
const QUARTERS = ['New', 'First quarter', 'Full', 'Last quarter'] as const;
const BETWEEN = ['Waxing crescent', 'Waxing gibbous', 'Waning gibbous', 'Waning crescent'] as const;

export function moonPhaseName(age: number): string {
  const nearest = Math.round(age / 90);
  if (Math.abs(age - nearest * 90) <= NEAR) return QUARTERS[nearest % 4]!;
  return BETWEEN[Math.floor(age / 90) % 4]!;
}

function distance(km: number): string {
  if (km < 1e6) return `${(Math.round(km / 1000) * 1000).toLocaleString('en-US')} km`;
  return `${Number((km / 1e6).toPrecision(3)).toLocaleString('en-US')} million km`;
}

function eventFact(label: string, at: Date | null): Fact {
  if (!at) return { label, value: `not in the next ${RISE_SET_DAYS} days` };
  return {
    label,
    value: at.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' }),
  };
}

/** Facts in order of interest, with the next of rise and set first. */
export function bodyFacts(id: string, moment: Moment): Fact[] {
  if (!isBodyId(id)) return [];
  const d = bodyDetails(id, moment);
  const facts: Fact[] = [
    { label: 'Distance', value: distance(d.distanceKm) },
    { label: 'Brightness', value: `magnitude ${d.magnitude.toFixed(1)}` },
  ];
  const lit = `${Math.round(d.lit * 100)}% lit`;
  if (id === 'moon')
    facts.push({ label: 'Phase', value: `${moonPhaseName(moonAge(moment.date))}, ${lit}` });
  else if (id !== 'sun') facts.push({ label: 'Phase', value: lit });
  const rise = eventFact('Rises', d.rise);
  const set = eventFact('Sets', d.set);
  const setFirst = (d.set?.getTime() ?? Infinity) < (d.rise?.getTime() ?? Infinity);
  return [...facts, ...(setFirst ? [set, rise] : [rise, set])];
}
