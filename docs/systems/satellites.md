# Satellites

`src/core/satellites` holds satellite orbits. The [Layers mode](layers.md) draws and selects them.

`orbit.ts` is the only file that imports `satellite.js` (ADR 18). `parseTle` reads three-line TLE text as CelesTrak serves it, and `toSatellite` turns a record into a `Satellite` with its NORAD number and epoch, or null if it does not parse. `satelliteView` gives, for a satellite and a `Moment`, its `AltAz` (azimuth clockwise from true north, like `toAltAz`; no refraction, observer at sea level), range, height, inertial speed and whether it is sunlit. `sunlit` is the cylindrical shadow test on its own.

`bundled.ts` loads `src/data/satellites.json`, 20 bright satellites with the ISS first, as the offline fallback. See [data sources](../data-sources.md) for how to refresh it.

`age.ts` gives `orbitAgeMs`, how far a moment is from a satellite's epoch either way, and `tooOldToTrust`, true past `ORBIT_AGE_LIMIT_MS` (7 days, ADR 18).

Fresh orbits live outside the core. `src/services/satellites/orbits.ts` has `loadOrbits`: the cache if fetched under six hours ago, else a fetch from CelesTrak's visual group, else the cache, else the bundle. It keeps only the bundled satellites, in the bundle's order. `src/services/storage/orbitCache.ts` keeps the fetched text and its fetch time in MMKV. `src/state/orbits.ts` exposes `useOrbits`: the `satellites`, their `source` (`fetched`, `cached` or `bundled`) and `fetchedAt`. It starts on the bundle, and the root layout calls `refresh` once at launch.

## On the sky

A satellite is a `SkyObject` of kind `satellite`, its id the NORAD number; it carries its `Satellite`, so cards can propagate it. It has no catalogued magnitude, so `magnitude` is Infinity. `src/core/satellites/sky.ts` gives `satelliteObjects` for `createSky`, `satelliteMarks` for drawing and `satelliteDirections` for the frequent refreshes. `SkyTurn.satellites` holds their horizon directions.

The sky screen passes `useOrbits`' satellites to `useSky`, whose minute refresh places them too. `useMovingSky` (`src/features/sky`) keeps them moving: while Layers is shown, the JS thread places them every 100 ms for 100 ms ahead, with time travel's offset, and a frame callback eases each step on the UI thread. It returns the turn with those directions; the reticle lock, the find arrow and `SatelliteMarks` use it, while stars keep the plain turn so the motion does not redraw them.
