# Satellites

`src/core/satellites` holds satellite orbits. Nothing draws them yet; backlog task 10 wires them into the Layers mode.

`orbit.ts` is the only file that imports `satellite.js` (ADR 18). `parseTle` reads three-line TLE text as CelesTrak serves it, and `toSatellite` turns a record into a `Satellite` with its NORAD number and epoch, or null if it does not parse. `satelliteView` gives, for a satellite and a `Moment`, its `AltAz` (azimuth clockwise from true north, like `toAltAz`; no refraction, observer at sea level), range, height, inertial speed and whether it is sunlit. `sunlit` is the cylindrical shadow test on its own.

`bundled.ts` loads `src/data/satellites.json`, 20 bright satellites with the ISS first, as the offline fallback. See [data sources](../data-sources.md) for how to refresh it.

`age.ts` gives `orbitAgeMs`, how far a moment is from a satellite's epoch either way, and `tooOldToTrust`, true past `ORBIT_AGE_LIMIT_MS` (7 days, ADR 18).

Fresh orbits live outside the core. `src/services/satellites/orbits.ts` has `loadOrbits`: the cache if fetched under six hours ago, else a fetch from CelesTrak's visual group, else the cache, else the bundle. It keeps only the bundled satellites, in the bundle's order. `src/services/storage/orbitCache.ts` keeps the fetched text and its fetch time in MMKV. `src/state/orbits.ts` exposes `useOrbits`: the `satellites`, their `source` (`fetched`, `cached` or `bundled`) and `fetchedAt`. It starts on the bundle, and the root layout calls `refresh` once at launch.
