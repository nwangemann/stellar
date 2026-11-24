# Handoff

Snapshot: 2026-11-24. Check the install state again before relying on it.

## Pick up here

Open a Claude Code session in `~/Code/stellar` and say: "Read docs/handoff.md and continue."

1. Check `git log` and `git status` on `main`.
2. Confirm the iOS simulator runtime finished downloading: `xcrun simctl list runtimes`.
3. Rerun `npx expo-doctor`. Its last run failed one check, saying `.expo` is not ignored. It is in `.gitignore`, so missing Git is the likely cause, but that is unconfirmed.
4. Once the runtime and CocoaPods (if Expo needs it) are ready, start phase 4: iOS simulator first, then a physical iOS device. Android is deferred to an emulator run later (ADR 11) and needs Android Studio, not Xcode.
5. Tag v0.1.0 only after phase 4 passes.

## What Stellar is

A phone app that overlays the sky on the camera, with three modes (Identify, Constellations, Layers), reticle lock-on and a capture logbook. The user accepted every default in the original plan. Decisions are in [adr/](adr/); the design is in [architecture.md](architecture.md).

## Environment

| Tool                      | State on 2026-11-24                                 |
| ------------------------- | --------------------------------------------------- |
| Node 24.22.3, npm 11.19.1 | Installed in `~/.local/node`, not on the shell path |
| Git 2.50.1                | Installed with Xcode                                |
| Xcode 26.6                | Installed; iOS simulator runtime not yet present    |
| CocoaPods, Homebrew       | Not installed                                       |
| Android Studio, SDK, Java | Not installed                                       |

Run this first in every new terminal (shell settings were not changed):

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

The project moved here from a temporary Claude session folder. Work only in `~/Code/stellar`.

## Phase status

| Phase                | Status                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| 1. Scaffold          | Done                                                                      |
| 2. Design system     | Done; glass panels are translucent, with no blur                          |
| 3. App shell         | Done except photo capture                                                 |
| 4. Verify on devices | Not started; needs native toolchains                                      |
| 5. Core engine       | Not started: real astronomy, sensors, calibration, catalogs, mode content |

## What has been verified

- `npm run check` passes in this folder: types, lint, formatting, 17 tests, `docs:check`.
- commitlint accepts a valid message and rejects a bad one when run directly.
- Before the move, the iOS and Android JavaScript bundles built. Native code has never been compiled.
- Before the move, these worked in the web preview: onboarding, drag-to-look, lock-on, info sheet, capture to logbook, switching to Constellations, night vision.

Not verified: camera, haptics, SQLite, location, swiping between modes, Husky hooks, anything on a simulator or phone.

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
- ESLint is pinned to version 9.
- Only `src/services/camera` may import VisionCamera.
- `sensors`, `astronomy-engine` and `file-system` packages were removed on purpose until phase 5.
- Keep the project in a path without spaces.
- The Claude preview config (`.claude/launch.json`) was not moved. Recreate it before using the web preview pane, or run `npm run web`. The template's `.claude/settings.json` (Expo plugin toggle) was also left behind.

## Waiting on the user

- Let Xcode finish downloading the iOS platform.
- Say which iOS device models and iOS versions to test on. A physical iOS device is confirmed for phase 4 (ADR 11).
- Before the first iOS build: choose a bundle identifier (none in app.json yet), and sign in to Xcode with an Apple ID. The user does the sign-in.

Update this file at the end of each work session.
