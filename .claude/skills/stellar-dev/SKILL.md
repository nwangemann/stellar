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
| Java 17 (Homebrew `openjdk@17`) | Installed 2026-11-26, keg-only, not on the path     |
| Maestro CLI 2.12.1             | Installed 2026-11-26 in /opt/homebrew               |
| Android Studio, SDK            | Not installed                                       |

Run this first in every new terminal (shell settings were not changed):

```bash
export PATH="$HOME/.local/node/bin:/opt/homebrew/bin:$PATH"
export LANG=en_US.UTF-8
```

For Maestro, also:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
```

## Commands

- `npm run ios`: build and run on the simulator. Starts Metro unless port 8081 is already serving it.
- `npm run web`: development preview.
- `npm run check`: types, lint, formatting, tests and docs. Required before finishing.
- `npm run test:e2e`: runs the Maestro flows in `.maestro/` on the simulator. Needs Metro on 8081 and the Java exports. With two simulators booted, add `-- --device <UDID>`.
- `npx prettier --write <files>`: fixes formatting failures.
- `npx expo-doctor`: needs Homebrew on the path.

Pipe long output through `tail` to save context.

## Rare cases

Read [reference.md](reference.md) when testing on the simulator, running prebuild, or changing the status bar, packages or git setup.

## Gotchas

- Read the installed package types before coding. VisionCamera 5, MMKV 4 and Expo 58 differ from older examples.
- Inside `useDerivedValue`, read shared values directly. One read only in a nested helper is not tracked; this froze the stars once.
- Expo rewrites `tsconfig.json` on start, so Prettier ignores it.
- Commits use a repo-local GitHub no-reply author. Keep it, so no personal email reaches GitHub.
- Only `src/services/camera` may import VisionCamera.
- The preview pane needs `.claude/launch.json`, which does not exist. Create it, or run `npm run web`.
