import * as Location from 'expo-location';
import type { Observer } from '@/core/astro/coordinates';
import { deg } from '@/core/units';

export async function requestLocation(): Promise<boolean> {
  return (await Location.requestForegroundPermissionsAsync()).granted;
}

/** Last known position only, so capture never waits on GPS and never prompts. */
export async function lastObserver(): Promise<Observer | null> {
  try {
    if (!(await Location.getForegroundPermissionsAsync()).granted) return null;
    const p = await Location.getLastKnownPositionAsync();
    return p ? { lat: deg(p.coords.latitude), lon: deg(p.coords.longitude) } : null;
  } catch {
    return null;
  }
}
