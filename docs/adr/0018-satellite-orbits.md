# 18. Satellite orbits from CelesTrak with SGP4

- Status: accepted
- Date: 2026-11-25

## Context

The Layers mode returns with bright satellites, led by the ISS. A satellite's place depends on an orbit measured days ago, and low orbits change quickly: drag lowers them every day and the ISS is reboosted every few weeks. Stellar has no backend and no API keys.

## Decision

- Propagate with `satellite.js` (MIT, pure JavaScript SGP4, own types). Only `src/core/satellites/orbit.ts` imports it. Its WebAssembly builds need Node and are not used; `metro.config.js` resolves their imports to an empty module.
- Orbits are two-line element sets from CelesTrak's free `visual` group. From step 10.2 the app fetches them at launch, at most once every few hours, and caches them with their fetch time. Offline it uses the cache, then the snapshot bundled in `src/data/satellites.json` as in ADR 13.
- The Sun comes from `astronomy-engine` (ADR 15) and the Earth's shadow is a cylinder. The penumbra and the atmosphere are ignored, so a satellite fades a few seconds later or earlier than shown.

## Consequences

- SGP4 is accurate to about 1 km at the TLE's epoch and drifts by a few km a day for low orbits. For the ISS, at 7.7 km/s, a few days old means a few seconds early or late on the sky; a week old can be tens of seconds; across a reboost, more. The orbit's age must be shown, with a warning past a limit (step 10.2).
- The bundled snapshot ages with the app build and is only good enough to show roughly where a satellite is.
- satellite.js ships ES modules only, so Jest maps it to its `dist` file and transforms it.
- Tests check SGP4 against the Vallado (2006) reference case 00005, not against a live pass. Checking a pass against the real sky is in backlog task 8.
