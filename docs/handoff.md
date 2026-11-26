# Handoff

Snapshot: 2026-11-25. Check the install state again before relying on it.

Tasks are in the [backlog](backlog/README.md); setup is in the `stellar-dev` skill. The latest review is [reviews/2026-11-25.md](reviews/2026-11-25.md).

## Before v0.1.0

Device checks, tuning and calibration are deferred to the end of development, in [backlog task 8](backlog/device.md). Tag v0.1.0 only after they pass.

## Status

| Area                                                 | Status                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| App shell, design system, looks, night vision        | Built; checked on the iOS simulator                         |
| Real sky: stars, constellations, Sun, Moon, planets  | Built; positions tested against JPL Horizons                |
| Details, mythology, search, find in sky, time travel | Built; checked on the iOS simulator, except the body screen |
| Logbook                                              | Built as data cards; photo capture not started              |
| Sensors, compass alignment, camera field of view     | Built; untried on a phone                                   |
| Layers mode                                          | Hidden until it has a real layer                            |
| Physical iPhone, release build, Android              | Not started (backlog task 8)                                |

## What has been verified

- `npm run check` passes, with 194 tests in 21 suites. GitHub Actions runs it on pull requests and `main`; it does not build the app.
- Both Husky hooks ran: a bad commit message was rejected and valid commits passed the full checks.
- The iOS debug build compiles. Expo Doctor passes 20/20 with Homebrew on the path.
- On the iPhone 17 Pro simulator (iOS 26.5): the sky, drag, lock-on, capture to SQLite, logbook, mode swipe, saved settings, night vision, every look, the star and constellation screens, and the Sun, Moon and planet marks with a faked date. On 2026-11-25 also: search, find in sky while dragging, the mythology tab, time travel and the settings switches.
- In the web preview, at an earlier stage: onboarding, drag-to-look, lock-on, capture and night vision.

Not verified: camera image, haptics, permission prompts, location, sensors, release builds, Reduce Motion and Reduce Transparency, frame rate and battery, anything on a physical phone or Android.

## Known limits

- Stars, constellations and stories are bundled snapshots (ADR 13). The marks for the Sun, Moon and planets are much larger than life.
- Stories cover 10 figures and papers cover 27 stars. arXiv and NASA Exoplanet Archive reuse terms are unchecked. Stories need community review before release.
- Capture saves a data card with no photo. On web the logbook clears on reload.
- Sensor pose assumes portrait; iPads can rotate (ADR 16). Compass alignment lasts only until the app restarts. The field of view over the camera is estimated, not measured.
- npm audit reports moderate advisories, mostly `minimatch` in development tooling. Do not use `npm audit fix --force`: it proposed downgrading Expo.
- Stellar is MIT licensed (ADR 10). The copyright line says "Stellar contributors".

Update this file only when project state changes. Progress on tasks goes in the backlog.
