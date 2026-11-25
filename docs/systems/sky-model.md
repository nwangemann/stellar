# Sky model

`src/core/catalog/sky.ts` turns the catalog, a location and a time into altitude and azimuth. `src/core/astro/horizontal.ts` applies precession and sidereal time; it ignores refraction, nutation and proper motion. `useSky` refreshes every minute and falls back to 40° N, 105° W, labelled "Demo location".

`createSky` adds the Sun, Moon and naked-eye planets as objects of kind `body`. They can be locked on to in Stars and Layers, within each mode's magnitude limit; Constellations draws them but ignores them otherwise. They have no details screen yet. `BodyMarks` draws them; see [UI](ui.md). `src/core/astro/phase.ts` gives the Moon's lit fraction and the direction of its bright limb.

`src/core/astro/bodies.ts` gives the topocentric place of the Sun, Moon and naked-eye planets through `astronomy-engine` (ADR 15). These are coordinates of date, so pass them to `toAltAz` without `precess`. Tests check them against JPL Horizons values in `src/core/astro/fixtures`.
