# Layers mode

Layer plugin, `src/features/layers/plugin.ts`. Draws stars and bright satellites, and selects only satellites, so a bright star cannot take the lock. Its first and only layer so far is [satellites](satellites.md); it will become a tray of toggleable layers. Stars and Constellations leave satellite marks out.

A satellite's card shows its height, speed, whether it is sunlit and the orbit data's age, with a warning past the 7-day limit (`satelliteFacts` in `src/features/satellites/facts.ts`). While a satellite is locked the card refreshes every second. Satellites have no details screen yet, so their card has no details button and their logbook rows open nothing; backlog step 10.4 adds one.
