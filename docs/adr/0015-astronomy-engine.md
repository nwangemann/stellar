# 15. astronomy-engine for the Moon, Sun and planets

- Status: accepted; amends ADR 13
- Date: 2026-11-24

## Context

ADR 13 computes positions without a library. That is simple for stars, but the Moon, Sun and planets need long series, light time, aberration and parallax. Phase, brightness, and rise and set are planned too.

## Decision

Use `astronomy-engine` (MIT, pure JavaScript, no dependencies) instead of hand-written formulas. Only `src/core/astro/bodies.ts` imports it. Stars keep the hand-written precession, and all objects share `toAltAz`.

## Consequences

- Tests compare it with saved JPL Horizons values: 7 bodies, 2 places, 6 dates from 2000 to 2030. Limits are 0.1 degree for the Moon and 0.05 for the rest. The worst errors found are 0.005 degree in right ascension and declination together, and 0.006 in altitude and azimuth.
- Positions are already of date and must not be precessed again.
- The minified package is about 130 kB before compression.
- Its last release was in 2023. It needs no data updates, and the adapter makes it replaceable.
