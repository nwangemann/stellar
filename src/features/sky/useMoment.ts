import { useEffect, useMemo, useState } from 'react';
import type { Moment } from '@/core/astro/coordinates';
import { DEMO_OBSERVER } from '@/core/catalog/sky';
import { lastObserver } from '@/services/location/location';

const REFRESH_MS = 60_000;

/**
 * The last known location and the time shown, refreshed every minute. `present` is the real time.
 * `offsetMs` moves the time away from now; the clock keeps running, so the offset holds.
 */
export function useMoment(offsetMs = 0): { moment: Moment; present: Moment; demo: boolean } {
  const [{ observer, now, demo }, setState] = useState(() => ({
    observer: DEMO_OBSERVER,
    now: Date.now(),
    demo: true,
  }));
  useEffect(() => {
    let live = true;
    const refresh = async () => {
      const found = await lastObserver();
      if (live) setState({ observer: found ?? DEMO_OBSERVER, now: Date.now(), demo: !found });
    };
    void refresh();
    const timer = setInterval(() => void refresh(), REFRESH_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);
  const moment = useMemo(
    () => ({ observer, date: new Date(now + offsetMs) }),
    [observer, now, offsetMs],
  );
  const present = useMemo(() => ({ observer, date: new Date(now) }), [observer, now]);
  return { moment, present, demo };
}
