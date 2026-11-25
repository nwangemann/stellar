# Handoff

Snapshot: 2026-11-24. Check the install state again before relying on it.

## Pick up here

Work is tracked in the [backlog](backlog/README.md). Start there. Setup and gotchas are in the `stellar-dev` skill.

Tag v0.1.0 only after the device checks below pass.

### Physical device checklist

The user does: sign in under Xcode Settings > Accounts, connect by cable and tap Trust, turn on Developer Mode, and give the model and iOS version.

Then:

1. Set the signing team in Xcode and build with `npx expo run:ios --device`. Do not commit the team unless the user agrees.
2. Check the camera image, lock-on haptic, camera and location prompts (allow and deny), location in a capture, night vision, and drag smoothness.
3. Repeat with `npx expo run:ios --device --configuration Release`, which runs away from the Mac.

Direct install is preferred over TestFlight for now. A free Apple ID works, but the app expires after 7 days. TestFlight needs the paid Apple Developer Program.

On the simulator, location and permission prompts are also untested.

## What Stellar is

A phone app that overlays the sky on the camera, with three modes (Stars, Constellations, Layers), reticle lock-on and a logbook of identified objects. The user accepted every default in the original plan. Decisions are in [adr/](adr/); the design is in [architecture.md](architecture.md).

## Phase status

| Phase                | Status                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1. Scaffold          | Done                                                                                                                 |
| 2. Design system     | Done; glass panels are translucent, with no blur                                                                     |
| 3. App shell         | Done except photo capture                                                                                            |
| 4. Verify on devices | iOS simulator done; physical iOS device not started                                                                  |
| 5. Core engine       | Started: real stars, constellations, star and mythology content. Sensors, calibration and Layers content not started |

## What has been verified

- `npm run check` passes in this folder: types, lint, formatting, 34 tests, `docs:check`.
- Both Husky hooks ran: a bad commit message was rejected and valid commits passed the full checks.
- Before the move, the iOS and Android JavaScript bundles built. The iOS debug build has since compiled; Android has not.
- Before the move, these worked in the web preview: onboarding, drag-to-look, lock-on, info sheet, capture to logbook, switching to Constellations, night vision.
- On the iPhone 17 Pro simulator (iOS 26.5): simulated sky, drag, lock-on, capture to SQLite, logbook, mode swipe, saved settings, night vision.
- With bundled data, on the simulator: real stars and lines, lock-on to a constellation, the constellation modal, the star modal.
- Expo Doctor passes 20/20 with Homebrew on the path. Without it, the native tooling check fails.

Not verified: camera image, haptics, permission prompts, location, release builds, anything on a physical phone or Android.

- Looks (ADR 14), on the simulator: the picker, the sky screen in Starship, Glass & chrome and Needlepoint, and night vision over them. Not verified: looks on a phone or Android, over the live camera, with Reduce Motion or Reduce Transparency, frame rate and battery. The Starship alien visitor has not been seen on screen (backlog item 6).

## Known limits

- Stars, constellations and stories are bundled snapshots (ADR 13). Pose comes from dragging only. No Sun, Moon or planets.
- Stories cover 10 figures and papers cover 27 stars. arXiv and NASA Exoplanet Archive reuse terms are unchecked. Stories need community review before release.
- Capture saves a data card with no photo. On web the logbook clears on reload.
- Field of view is fixed at 60°.
- npm audit reports 23 moderate advisories. Those examined involve `minimatch` in development tooling; the rest are unreviewed. Do not use `npm audit fix --force`: it proposed downgrading Expo.
- Stellar is MIT licensed (ADR 10). The copyright line says "Stellar contributors".

## Waiting on the user

- Say which iOS device models and iOS versions to test on. A physical iOS device is confirmed for phase 4 (ADR 11).
- Do the user steps in the device checklist. The bundle identifier is `com.nate.stellar`.
- The remote is a private GitHub repo, `nwangemann/stellar`. GitHub CI is part of the original plan and is not set up.

Update this file only when project state changes. Progress on tasks goes in the backlog.
