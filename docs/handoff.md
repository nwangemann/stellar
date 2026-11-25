# Handoff

Snapshot: 2026-11-24. Check the install state again before relying on it.

Tasks are in the [backlog](backlog/README.md); setup is in the `stellar-dev` skill.

## Before v0.1.0

Device checks, tuning and calibration are deferred to the end of development, in [backlog task 8](backlog/device.md). Tag v0.1.0 only after they pass.

On the simulator, location and permission prompts are also untested.

## Phase status

| Phase                | Status                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Scaffold          | Done                                                                                                                                                                         |
| 2. Design system     | Done; glass panels are translucent, with no blur                                                                                                                             |
| 3. App shell         | Done except photo capture                                                                                                                                                    |
| 4. Verify on devices | iOS simulator done; physical iOS device deferred to the end (backlog task 8)                                                                                                 |
| 5. Core engine       | Started: real stars, constellations, star and mythology content. Sensors connected but not tried on a phone; compass alignment built but untried; Layers content not started |

## What has been verified

- `npm run check` passes, with 188 tests. GitHub Actions runs it on pull requests and `main`; it does not build the app.
- Both Husky hooks ran: a bad commit message was rejected and valid commits passed the full checks.
- Before the move, the iOS and Android JavaScript bundles built. The iOS debug build has since compiled; Android has not.
- Before the move, these worked in the web preview: onboarding, drag-to-look, lock-on, info sheet, capture to logbook, switching to Constellations, night vision.
- On the iPhone 17 Pro simulator (iOS 26.5): simulated sky, drag, lock-on, capture to SQLite, logbook, mode swipe, saved settings, night vision.
- With bundled data, on the simulator: real stars and lines, lock-on to a constellation, the constellation modal, the star modal.
- Expo Doctor passes 20/20 with Homebrew on the path. Without it, the native tooling check fails.

Not verified: camera image, haptics, permission prompts, location, release builds, anything on a physical phone or Android.

- Looks (ADR 14), on the simulator: the picker, the sky screen in Starship, Glass & chrome and Needlepoint, and night vision over them. Not verified: looks on a phone or Android, over the live camera, with Reduce Motion or Reduce Transparency, frame rate and battery. The Starship alien visitor has been seen, but with a lock showing (backlog item 6).
- Sky marks, on the simulator with a faked date: the Sun, a half Moon, planets and the Sun warning in every look and night vision.

## Known limits

- Stars, constellations and stories are bundled snapshots (ADR 13). Sensor pose is unproven on a phone; dragging is the fallback. The marks for the Sun, Moon and planets are much larger than life.
- Stories cover 10 figures and papers cover 27 stars. arXiv and NASA Exoplanet Archive reuse terms are unchecked. Stories need community review before release.
- Capture saves a data card with no photo. On web the logbook clears on reload.
- Sensor pose assumes portrait; iPads and large Android screens can rotate (ADR 16).
- The field of view over the camera is estimated, not measured on a phone. Compass alignment lasts only until the app restarts.
- npm audit reports 23 moderate advisories. Those examined involve `minimatch` in development tooling; the rest are unreviewed. Do not use `npm audit fix --force`: it proposed downgrading Expo.
- Stellar is MIT licensed (ADR 10). The copyright line says "Stellar contributors".

Update this file only when project state changes. Progress on tasks goes in the backlog.
