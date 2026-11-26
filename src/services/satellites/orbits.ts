import { BUNDLED_FETCHED, BUNDLED_SATELLITES } from '@/core/satellites/bundled';
import { parseTle, toSatellite, type Satellite } from '@/core/satellites/orbit';
import type { OrbitCache } from '@/services/storage/orbitCache';

export type OrbitSource = 'fetched' | 'cached' | 'bundled';

export interface Orbits {
  /** The bundled set of satellites, in the bundle's order, ISS first. */
  readonly satellites: readonly Satellite[];
  readonly source: OrbitSource;
  /** When the orbits were fetched from CelesTrak. */
  readonly fetchedAt: Date;
}

export const CELESTRAK_URL = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle';

/** CelesTrak updates its data every couple of hours and blocks clients that poll faster. */
export const REFETCH_MS = 6 * 3_600_000;

const TIMEOUT_MS = 15_000;

export const BUNDLED_ORBITS: Orbits = {
  satellites: BUNDLED_SATELLITES,
  source: 'bundled',
  fetchedAt: BUNDLED_FETCHED,
};

const wanted = BUNDLED_SATELLITES.map((s) => s.id);

/** The bundle's satellites found in TLE text, in the bundle's order. */
function pick(text: string): Satellite[] {
  const byId = new Map<string, Satellite>();
  for (const tle of parseTle(text)) {
    const s = toSatellite(tle);
    if (s) byId.set(s.id, s);
  }
  return wanted.flatMap((id) => byId.get(id) ?? []);
}

export async function downloadTle(): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(CELESTRAK_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`CelesTrak answered ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The freshest orbits at hand: the cache if fetched within `REFETCH_MS`, else a new fetch,
 * else the cache, else the bundle. A cache older than the bundle loses to it.
 */
export async function loadOrbits({
  now,
  cache,
  download,
}: {
  now: Date;
  cache: OrbitCache;
  download: () => Promise<string>;
}): Promise<Orbits> {
  const entry = cache.read();
  const cached: Orbits | null =
    entry && entry.fetchedAt >= BUNDLED_FETCHED
      ? { satellites: pick(entry.text), source: 'cached', fetchedAt: entry.fetchedAt }
      : null;
  const usable = cached && cached.satellites.length > 0 ? cached : null;
  const since = usable ? now.getTime() - usable.fetchedAt.getTime() : Infinity;
  if (usable && since >= 0 && since < REFETCH_MS) return usable;

  try {
    const text = await download();
    const satellites = pick(text);
    if (satellites.length > 0) {
      cache.write({ text, fetchedAt: now });
      return { satellites, source: 'fetched', fetchedAt: now };
    }
  } catch {
    // Offline or refused: fall through.
  }
  return usable ?? BUNDLED_ORBITS;
}
