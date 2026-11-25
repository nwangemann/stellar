# 4. Time travel slider

Goal: scrub through tonight and watch the sky move.

`createSky` already takes a date; `useSky` fixes it to now. Recomputing every star on each tick is the main risk, so measure first.

- [ ] **4.1 Time source.** Give `useSky` a time offset and measure the cost of a refresh. Read: `useSky.ts`, `src/core/catalog/sky.ts`.
- [ ] **4.2 Slider.** Control, current time label, return to now, every look. Captures must record the time shown. Read: `SkyScreen.tsx`, `capture.ts`.
