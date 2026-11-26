# 10. Satellite passes

Goal: Layers returns with its first real layer: bright satellites, led by the ISS, placed for the current time and place, moving with time travel, with their next visible pass.

The `LayerPlugin` interface in `src/core/layers/types.ts` is the seam; adding the layer must not change the core beyond a new object kind. Read `docs/systems/` for the sky and layers before starting.

- [ ] **10.1 Orbits in the core.** Add SGP4 propagation (check `satellite.js` first: pure TypeScript-friendly, no native code; add it with `npx expo install`). Bundle a TLE snapshot of about 20 bright objects from CelesTrak's visual group, in the style of ADR 13; record the source and its terms in `data-sources.md`. A pure function gives altitude and azimuth for a satellite, a moment and a place, and whether it is sunlit. Test against one published ISS pass. ADR for bundled orbits and how stale they may get.
- [ ] **10.2 On the sky.** A `satellite` object kind; the Layers plugin draws satellites and selects them; the card shows height, speed and whether it is lit. Satellites move with time travel. Show Layers in the mode strip again and update `architecture.md`.
- [ ] **10.3 Next pass.** For a locked or searched satellite: the next visible pass (start, highest point, end, direction), on its details screen. Search finds satellites by name; find in sky works for them.
- [ ] **10.4 Fresh orbits.** Fetch current TLEs from CelesTrak at launch, cache them, and fall back to the bundle offline. Show the orbit data's age, and warn when it is too old to trust.

Proof: `npm run check`; the core tests; one simulator pass of Layers with a faked date during a known ISS pass. Checking a pass against the real sky goes in task 8.
