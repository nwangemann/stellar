# Handoff

Snapshot: 2026-11-24. Check the install state again before relying on it.

## Pick up here

Open a Claude Code session in `~/Code/stellar` and say: "Read docs/handoff.md and continue."

1. Check `git log` and `git status` on `main`.
2. Phase 4 on the iOS simulator is done. Next: the physical iOS device. Android is deferred to an emulator run later (ADR 11) and needs Android Studio, not Xcode.
3. To run on the simulator again: `npx expo start --dev-client --localhost`, then `npm run ios` in another terminal.
4. Check camera, haptics, permission prompts and location on the device.
5. Tag v0.1.0 only after phase 4 passes.

## What Stellar is

A phone app that overlays the sky on the camera, with three modes (Identify, Constellations, Layers), reticle lock-on and a capture logbook. The user accepted every default in the original plan. Decisions are in [adr/](adr/); the design is in [architecture.md](architecture.md).

## Environment

| Tool                           | State on 2026-11-24                                 |
| ------------------------------ | --------------------------------------------------- |
| Node 24.22.3, npm 11.19.1      | Installed in `~/.local/node`, not on the shell path |
| Git 2.50.1                     | Installed with Xcode                                |
| Xcode 26.6, iOS 26.5 simulator | Installed                                           |
| CocoaPods 1.17.0, Homebrew     | Installed in /opt/homebrew                          |
| Android Studio, SDK, Java      | Not installed                                       |

Run this first in every new terminal (shell settings were not changed):

```bash
export PATH="$HOME/.local/node/bin:/opt/homebrew/bin:$PATH"
export LANG=en_US.UTF-8
```

The project moved here from a temporary Claude session folder. Work only in `~/Code/stellar`.

## Phase status

| Phase                | Status                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| 1. Scaffold          | Done                                                                      |
| 2. Design system     | Done; glass panels are translucent, with no blur                          |
| 3. App shell         | Done except photo capture                                                 |
| 4. Verify on devices | iOS simulator done; physical iOS device not started                       |
| 5. Core engine       | Not started: real astronomy, sensors, calibration, catalogs, mode content |

## What has been verified

- `npm run check` passes in this folder: types, lint, formatting, 17 tests, `docs:check`.
- commitlint accepts a valid message and rejects a bad one when run directly.
- Before the move, the iOS and Android JavaScript bundles built. The iOS debug build has since compiled; Android has not.
- Before the move, these worked in the web preview: onboarding, drag-to-look, lock-on, info sheet, capture to logbook, switching to Constellations, night vision.

- On the iPhone 17 Pro simulator (iOS 26.5): simulated sky, drag, lock-on, capture to SQLite, logbook, mode swipe, saved settings, night vision.
- Expo Doctor passed 20/20 and both Husky hooks ran (before the iOS work).

Not verified: camera image, haptics, permission prompts, location, release builds, anything on a physical phone or Android.

## Known limits

- Stars and constellation lines are made-up placeholders. Pose comes from dragging only.
- Capture saves a data card with no photo. On web the logbook clears on reload.
- Field of view is fixed at 60°.
- npm audit reports 23 moderate advisories. Those examined involve `minimatch` in development tooling; the rest are unreviewed. Do not use `npm audit fix --force`: it proposed downgrading Expo.
- Stellar is MIT licensed (ADR 10). The copyright line says "Stellar contributors".

## Gotchas

- Read the installed package types before coding. VisionCamera 5, MMKV 4 and Expo 58 differ from older examples.
- Inside `useDerivedValue`, read shared values directly. One read only in a nested helper is not tracked; this froze the stars once.
- Expo rewrites `tsconfig.json` on start, so Prettier ignores it.
- `npx expo prebuild` regenerates `ios/` from scratch. Run `pod install` again and recreate `ios/.xcode.env.local` with `export NODE_BINARY=$HOME/.local/node/bin/node`.
- Night vision hides the iOS status bar through `UIViewControllerBasedStatusBarAppearance: false` plus expo-status-bar. Do not set `statusBarHidden` on the navigator.
- ESLint is pinned to version 9.
- Only `src/services/camera` may import VisionCamera.
- `sensors`, `astronomy-engine` and `file-system` packages were removed on purpose until phase 5.
- Keep the project in a path without spaces.
- The Claude preview config (`.claude/launch.json`) was not moved. Recreate it before using the web preview pane, or run `npm run web`. The template's `.claude/settings.json` (Expo plugin toggle) was also left behind.

## Waiting on the user

- Say which iOS device models and iOS versions to test on. A physical iOS device is confirmed for phase 4 (ADR 11).
- Before the device build: sign in to Xcode with an Apple ID (the user does this). The bundle identifier is `com.nate.stellar`.

Update this file at the end of each work session.
