import type { Moment } from '../astro/coordinates';
import { altAzVector, type Vector } from '../astro/vector';
import type { SatelliteMark, SkyObject } from '../catalog/types';
import { satelliteView, type Satellite } from './orbit';

export const satelliteMarks = (satellites: readonly Satellite[]): SatelliteMark[] =>
  satellites.map((s) => ({ kind: 'satellite', id: s.id }));

/** Satellites placed at a moment. Those SGP4 cannot place are left out. */
export function satelliteObjects(satellites: readonly Satellite[], moment: Moment): SkyObject[] {
  return satellites.flatMap((s): SkyObject[] => {
    const view = satelliteView(s, moment);
    return view
      ? [
          {
            kind: 'satellite',
            id: s.id,
            name: s.name,
            magnitude: Infinity,
            position: view.position,
            satellite: s,
          },
        ]
      : [];
  });
}

/** Horizon directions by NORAD number, for the frequent refreshes that move satellites on screen. */
export function satelliteDirections(
  satellites: readonly Satellite[],
  moment: Moment,
): Record<string, Vector> {
  const directions: Record<string, Vector> = {};
  for (const s of satellites) {
    const view = satelliteView(s, moment);
    if (view) directions[s.id] = altAzVector(view.position);
  }
  return directions;
}
