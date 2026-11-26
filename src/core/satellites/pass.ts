import { bodyPosition } from '../astro/bodies';
import type { AltAz, Moment } from '../astro/coordinates';
import { toAltAz } from '../astro/horizontal';
import { satelliteView, type Satellite } from './orbit';

/** Below this the Sun leaves the sky dark enough to see a satellite: civil twilight's end. */
export const DARK_SUN_ALT = -6;
/** Lower than this, haze and the landscape usually hide a satellite. */
export const MIN_PASS_ALT = 10;
/** How far ahead `nextPass` looks. */
export const PASS_SEARCH_HOURS = 36;

const STEP_MS = 30_000;
/** How far back to look for the start of a pass already under way. */
const LOOK_BACK_MS = 20 * 60_000;

export interface PassPoint {
  readonly date: Date;
  readonly position: AltAz;
}

/** A stretch of time in which the satellite can be seen. */
export interface Pass {
  /** When it appears: rising above 10°, leaving the Earth's shadow, or the sky getting dark. */
  readonly start: PassPoint;
  /** The highest point while visible. */
  readonly highest: PassPoint;
  /** When it disappears. */
  readonly end: PassPoint;
}

/** Where the satellite is if it is visible at the date, else null. */
function visibleAt(satellite: Satellite, observer: Moment['observer'], date: Date): AltAz | null {
  const view = satelliteView(satellite, { observer, date });
  if (!view || view.position.alt < MIN_PASS_ALT || !view.sunlit) return null;
  const sun = toAltAz(bodyPosition('sun', observer, date), observer, date);
  return sun.alt < DARK_SUN_ALT ? view.position : null;
}

/** The last moment like `from` and the first like `to`, a second apart. Their visibility must differ. */
function edge(
  satellite: Satellite,
  observer: Moment['observer'],
  from: number,
  to: number,
): readonly [number, number] {
  const startsVisible = visibleAt(satellite, observer, new Date(from)) !== null;
  let a = from;
  let b = to;
  while (b - a > 1000) {
    const mid = Math.round((a + b) / 2);
    if ((visibleAt(satellite, observer, new Date(mid)) !== null) === startsVisible) a = mid;
    else b = mid;
  }
  return [a, b];
}

/**
 * The next visible pass of a satellite from a moment, or null if there is none within
 * `PASS_SEARCH_HOURS`. Visible means above `MIN_PASS_ALT`, sunlit and with the Sun below
 * `DARK_SUN_ALT`. A pass under way at the moment is returned with its start in the past.
 * Searches in 30 s steps, so a visible stretch shorter than that may be missed.
 */
export function nextPass(
  satellite: Satellite,
  { observer, date }: Moment,
  hours = PASS_SEARCH_HOURS,
): Pass | null {
  const now = date.getTime();
  const limit = now + hours * 3_600_000;
  let t = now;
  if (visibleAt(satellite, observer, date)) {
    // Step back to before it appeared.
    while (t > now - LOOK_BACK_MS && visibleAt(satellite, observer, new Date(t))) t -= STEP_MS;
  } else {
    while (t <= limit && !visibleAt(satellite, observer, new Date(t))) t += STEP_MS;
    if (t > limit) return null;
    t -= STEP_MS;
  }
  const start = visibleAt(satellite, observer, new Date(t))
    ? t
    : edge(satellite, observer, t, t + STEP_MS)[1];

  // Walk to the end, keeping the highest sample.
  let best = start;
  let bestAlt = visibleAt(satellite, observer, new Date(start))?.alt ?? -90;
  let u = start;
  while (true) {
    const next = u + STEP_MS;
    const place = visibleAt(satellite, observer, new Date(next));
    if (!place) break;
    u = next;
    if (place.alt > bestAlt) {
      best = u;
      bestAlt = place.alt;
    }
  }
  const end = edge(satellite, observer, u, u + STEP_MS)[0];

  // Ternary search around the best sample for the true highest point, within the pass.
  let lo = Math.max(start, best - STEP_MS);
  let hi = Math.min(end, best + STEP_MS);
  const alt = (ms: number) => visibleAt(satellite, observer, new Date(ms))?.alt ?? -90;
  while (hi - lo > 1000) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (alt(m1) < alt(m2)) lo = m1;
    else hi = m2;
  }
  const point = (ms: number): PassPoint | null => {
    const d = new Date(Math.round(ms));
    const position = visibleAt(satellite, observer, d);
    return position ? { date: d, position } : null;
  };
  const first = point(start);
  const last = point(end);
  const highest = point((lo + hi) / 2) ?? point(best);
  return first && last && highest ? { start: first, highest, end: last } : null;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

/** The nearest of eight compass points for an azimuth. */
export const compassPoint = (az: number): (typeof COMPASS)[number] =>
  COMPASS[Math.round((((az % 360) + 360) % 360) / 45) % 8]!;
