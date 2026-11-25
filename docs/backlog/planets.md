# 1. Moon, Sun and planets

Goal: the Moon, Sun and naked-eye planets appear in the right place, lock on and have details.

Proof: positions match JPL Horizons values saved as test fixtures, not values from the library under test.

- [x] **1.1 Positions.** Decide between `astronomy-engine` (MIT, recommended) and our own formulas; record an ADR. Add `src/core/astro/bodies.ts` returning topocentric coordinates of date. The Moon needs parallax, which reaches about a degree. Fixtures: several dates and two places. Aim: 0.1 degree for the Moon, 0.05 for the rest, confirmed once fixtures exist. Read: `src/core/astro/`, `src/core/units.ts`, `docs/dependencies.md`.
- [x] **1.2 Into the sky.** Add a body kind to `SkyObject` and `Target`, and merge bodies in `createSky`. Do not precess them twice. Check that constellation lines and star lookups by id ignore them. Read: `src/core/catalog/`, `src/core/layers/types.ts`, the plugins in `src/features`.
- [x] **1.3 Drawing.** Distinct marks for the Sun, Moon (with phase) and planets, in every look and night vision. Add a warning not to point the camera at the Sun. Read: `SkyCanvas.tsx`, `docs/systems/ui.md`. Check on the simulator.
- [ ] **1.4 Details.** Card and modal: distance, brightness, phase, rise and set. Check that Identify and the logbook work. Update `sky-model.md` and the handoff limits. Read: `src/features/stars/`, `app/star/`, `SkyScreen.tsx`.
