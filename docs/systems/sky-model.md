# Sky model

`src/core/catalog/sky.ts` turns the catalog, a location and a time into altitude and azimuth. `src/core/astro/horizontal.ts` applies precession and sidereal time; it ignores refraction, nutation and proper motion. `useSky` refreshes every minute and falls back to 40° N, 105° W, labelled "Demo location". The Sun, Moon and planets are not included.
