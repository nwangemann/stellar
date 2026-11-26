import { createMMKV } from 'react-native-mmkv';

/** TLE text as last fetched from CelesTrak, with when. */
export interface CachedOrbits {
  readonly text: string;
  readonly fetchedAt: Date;
}

export interface OrbitCache {
  read(): CachedOrbits | null;
  write(entry: CachedOrbits): void;
}

const mmkv = createMMKV({ id: 'orbits' });

export const orbitCache: OrbitCache = {
  read() {
    const text = mmkv.getString('text');
    const at = mmkv.getNumber('fetchedAt');
    return text && at !== undefined ? { text, fetchedAt: new Date(at) } : null;
  },
  write({ text, fetchedAt }) {
    mmkv.set('text', text);
    mmkv.set('fetchedAt', fetchedAt.getTime());
  },
};
