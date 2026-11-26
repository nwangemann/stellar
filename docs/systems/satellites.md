# Satellites

`src/core/satellites` holds satellite orbits. Nothing draws them yet; backlog task 10 wires them into the Layers mode.

`orbit.ts` is the only file that imports `satellite.js` (ADR 18). `parseTle` reads three-line TLE text as CelesTrak serves it, and `toSatellite` turns a record into a `Satellite` with its NORAD number and epoch, or null if it does not parse. `satelliteView` gives, for a satellite and a `Moment`, its `AltAz` (azimuth clockwise from true north, like `toAltAz`; no refraction, observer at sea level), range, height, inertial speed and whether it is sunlit. `sunlit` is the cylindrical shadow test on its own.

`bundled.ts` loads `src/data/satellites.json`, 20 bright satellites with the ISS first, as the offline fallback. See [data sources](../data-sources.md) for how to refresh it.
