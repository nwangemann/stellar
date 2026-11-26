# Layers mode

Layer plugin, `src/features/layers/plugin.ts`. Draws stars and bright satellites, and selects only satellites, so a bright star cannot take the lock. Its first and only layer so far is [satellites](satellites.md); it will become a tray of toggleable layers. Stars and Constellations leave satellite marks out.

A satellite's card shows its height, speed, whether it is sunlit and the orbit data's age, with a warning past the 7-day limit (`satelliteFacts` in `src/features/satellites/facts.ts`). While a satellite is locked the card refreshes every second. Its "Next pass and details" button, search and logbook rows open `SatelliteScreen` (`app/satellite/[id].tsx`, `src/features/satellites`): the next visible pass, the card's facts for the time shown, and Find in sky. Satellites move too fast to zoom on, so their details open without the zoom.
