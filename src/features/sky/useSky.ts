import { useEffect, useState } from 'react';
import { createSky, DEMO_OBSERVER } from '@/core/catalog/sky';
import { lastObserver } from '@/services/location/location';

const REFRESH_MS = 60_000;

/** The sky for the last known location, refreshed every minute (about a quarter degree of drift). */
export function useSky() {
  const [state, setState] = useState(() => ({
    sky: createSky(DEMO_OBSERVER, new Date()),
    demo: true,
  }));
  useEffect(() => {
    let live = true;
    const refresh = async () => {
      const observer = await lastObserver();
      if (live)
        setState({ sky: createSky(observer ?? DEMO_OBSERVER, new Date()), demo: !observer });
    };
    void refresh();
    const timer = setInterval(() => void refresh(), REFRESH_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);
  return state;
}
