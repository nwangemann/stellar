# 10. Satellite passes

Goal: Layers returns with its first real layer: bright satellites, led by the ISS, placed for the current time and place, moving with time travel, with their next visible pass.

The `LayerPlugin` interface in `src/core/layers/types.ts` is the seam; adding the layer must not change the core beyond a new object kind. Read `docs/systems/` for the sky and layers before starting.

- [x] **10.1 Orbits in the core.** Add SGP4 propagation with `satellite.js` (MIT, v7, own types, no native code; add it with `npx expo install`). Bundle a TLE snapshot of about 20 bright objects from CelesTrak's visual group, in the style of ADR 13, as the offline fallback; record the source and its terms in `data-sources.md`. A pure function gives altitude and azimuth for a satellite, a moment and a place, and whether it is sunlit (Sun position from `astronomy-engine`, cylindrical Earth shadow). Test against one published ISS position or pass. ADR for orbits: fetched first, bundled fallback, how stale they may get.
- [x] **10.2 Fresh orbits.** Fetch current TLEs from CelesTrak at launch at most once every few hours (CelesTrak asks clients not to poll faster than the data updates), cache them with their fetch time, and fall back to the cache, then the bundle, offline. Orbit data age is available to the UI, with a limit past which it is too old to trust. Moved ahead of the sky work so the bundle is only a fallback.
- [ ] **10.3 On the sky.** A `satellite` object kind; the Layers plugin draws satellites and selects them; the card shows height, speed, whether it is lit and the orbit data's age, with a warning when it is too old. Satellites move smoothly (about ten updates a second, eased between) and with time travel. Show Layers in the mode strip again and update `architecture.md`.
- [ ] **10.4 Next pass.** For a locked or searched satellite: the next visible pass (start, highest point, end, direction; visible means the satellite is lit, the Sun is below about -6° and the satellite is above 10°), on its details screen. Search finds satellites by name; find in sky works for them.

Proof: `npm run check`; the core tests; one simulator pass of Layers with a faked date during a known ISS pass. Checking a pass against the real sky goes in task 8.
