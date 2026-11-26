import { BUNDLED_FETCHED } from '@/core/satellites/bundled';
import type { CachedOrbits } from '@/services/storage/orbitCache';
import data from '../../data/satellites.json';
import { loadOrbits, REFETCH_MS } from './orbits';

jest.mock('react-native-mmkv', () => ({ createMMKV: () => ({}) }));

const iss = data.satellites[0]!;
const text = `${iss.name}\n${iss.line1}\n${iss.line2}\nNOT BUNDLED\n1 99999U\n2 99999\n`;
const later = (ms: number) => new Date(BUNDLED_FETCHED.getTime() + ms);

function memoryCache(entry: CachedOrbits | null) {
  return { entry, read: () => entry, write: jest.fn() };
}

describe('loadOrbits', () => {
  it('uses a recent cache without fetching', async () => {
    const download = jest.fn();
    const cache = memoryCache({ text, fetchedAt: later(0) });
    const orbits = await loadOrbits({ now: later(REFETCH_MS - 1), cache, download });
    expect(download).not.toHaveBeenCalled();
    expect(orbits.source).toBe('cached');
    expect(orbits.satellites.map((s) => s.id)).toEqual(['25544']);
  });

  it('fetches once the cache is old, keeping only bundled satellites', async () => {
    const cache = memoryCache({ text, fetchedAt: later(0) });
    const now = later(REFETCH_MS);
    const orbits = await loadOrbits({ now, cache, download: async () => text });
    expect(orbits.source).toBe('fetched');
    expect(orbits.satellites.map((s) => s.id)).toEqual(['25544']);
    expect(cache.write).toHaveBeenCalledWith({ text, fetchedAt: now });
  });

  it('falls back to the cache, then the bundle, when the fetch fails', async () => {
    const download = () => Promise.reject(new Error('offline'));
    const now = later(10 * REFETCH_MS);
    const stale = await loadOrbits({
      now,
      cache: memoryCache({ text, fetchedAt: later(0) }),
      download,
    });
    expect(stale.source).toBe('cached');
    const none = await loadOrbits({ now, cache: memoryCache(null), download });
    expect(none.source).toBe('bundled');
    const beforeBundle = await loadOrbits({
      now,
      cache: memoryCache({ text, fetchedAt: later(-1) }),
      download,
    });
    expect(beforeBundle.source).toBe('bundled');
  });
});
