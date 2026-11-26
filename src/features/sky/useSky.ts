import { useEffect, useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { bodyPosition } from '@/core/astro/bodies';
import { toAltAz } from '@/core/astro/horizontal';
import { altAzVector, type Vector } from '@/core/astro/vector';
import { createSky, skyTurn } from '@/core/catalog/sky';
import type { SkyTurn } from '@/core/catalog/types';
import type { Satellite } from '@/core/satellites/orbit';
import { useMoment } from './useMoment';

/**
 * The sky for the last known location, refreshed every minute (about a quarter degree of drift).
 * Satellites move much faster; `useMovingSky` keeps them current on screen.
 * `offsetMs` shows it at another time; `realSun` is where the Sun is now, whatever time is shown. `turn` is the same sky for the UI thread; never capture
 * `sky` in a worklet, because copying it there is slow.
 */
export function useSky(offsetMs = 0, satellites: readonly Satellite[] = []) {
  const { moment, present, demo } = useMoment(offsetMs);
  const { sky, current } = useMemo(() => {
    const { observer, date } = moment;
    const sky = createSky(observer, date, satellites);
    return { sky, current: skyTurn(sky, observer, date) };
  }, [moment, satellites]);
  const turn = useSharedValue<SkyTurn>(current);
  useEffect(() => turn.set(current), [turn, current]);
  const sun = useMemo(() => {
    const { observer, date } = present;
    return altAzVector(toAltAz(bodyPosition('sun', observer, date), observer, date));
  }, [present]);
  const realSun = useSharedValue<Vector>(sun);
  useEffect(() => realSun.set(sun), [realSun, sun]);
  return { sky, turn, realSun, moment, demo };
}
