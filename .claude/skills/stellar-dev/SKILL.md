---
name: stellar-dev
description: Set up the shell, run, check and simulate the Stellar Expo app, with its known gotchas. Use before running any npm, npx, pod or simulator command in this repo, and when a build or the simulator misbehaves.
---

# Working on Stellar

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

## Commands

- `npm run ios`: build and run on the simulator. Starts Metro unless port 8081 is already serving it.
- `npm run web`: development preview.
- `npm run check`: types, lint, formatting, tests and docs. Required before finishing.
- `npx prettier --write <files>`: fixes formatting failures.
- `npx expo-doctor`: needs Homebrew on the path.

Pipe long output through `tail` to save context.

## Simulator

If another session is using a simulator, use a different one. To test without rebuilding, install the app from `~/Library/Developer/Xcode/DerivedData/Stellar-*/Build/Products/Debug-iphonesimulator/Stellar.app`, then open `stellar://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`. Rebuild if native dependencies changed.

## Gotchas

- Read the installed package types before coding. VisionCamera 5, MMKV 4 and Expo 58 differ from older examples.
- Inside `useDerivedValue`, read shared values directly. One read only in a nested helper is not tracked; this froze the stars once.
- Expo rewrites `tsconfig.json` on start, so Prettier ignores it.
- `npx expo prebuild` regenerates `ios/` from scratch. Run `pod install` again and recreate `ios/.xcode.env.local` with `export NODE_BINARY=$HOME/.local/node/bin/node`.
- Night vision hides the iOS status bar through `UIViewControllerBasedStatusBarAppearance: false` plus expo-status-bar (ADR 12). Do not set `statusBarHidden` on the navigator.
- Two people driving the simulator at once looks like a bug: stray drags and mode changes. Relaunch before debugging.
- Commits use a repo-local GitHub no-reply author. Keep it, so no personal email reaches GitHub.
- `origin` is a private GitHub repo. `gh` is in /opt/homebrew/bin. Unpushed work exists only on this Mac.
- ESLint is pinned to version 9.
- Only `src/services/camera` may import VisionCamera.
- `sensors`, `astronomy-engine` and `file-system` packages were removed on purpose until phase 5.
- Keep the project in a path without spaces.
- The Claude preview config (`.claude/launch.json`) was not moved. Recreate it before using the web preview pane, or run `npm run web`. The template's `.claude/settings.json` (Expo plugin toggle) was also left behind.
