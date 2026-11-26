import { create } from 'zustand';
import { BUNDLED_ORBITS, downloadTle, loadOrbits, type Orbits } from '@/services/satellites/orbits';
import { orbitCache } from '@/services/storage/orbitCache';

interface OrbitState extends Orbits {
  /** Loads fresher orbits if any. Call once at launch; repeat calls share the first. */
  refresh: () => Promise<void>;
}

let loading: Promise<void> | undefined;

/** Not persisted here; the cache lives in `orbitCache`. Starts on the bundle. */
export const useOrbits = create<OrbitState>()((set) => ({
  ...BUNDLED_ORBITS,
  refresh: () =>
    (loading ??= loadOrbits({ now: new Date(), cache: orbitCache, download: downloadTle }).then(
      (orbits) => set(orbits),
    )),
}));
