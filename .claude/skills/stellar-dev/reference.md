# Reference

## Simulator

If another session is using a simulator, use a different one. To test without rebuilding, install the app from `~/Library/Developer/Xcode/DerivedData/Stellar-*/Build/Products/Debug-iphonesimulator/Stellar.app`, then open `stellar://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`. Rebuild if native dependencies changed.

- Two people driving the simulator at once looks like a bug: stray drags and mode changes. Relaunch before debugging.

## Maestro

Installed 2026-11-26 (ADR 19):

```bash
brew install openjdk@17
brew tap mobile-dev-inc/tap
brew trust --formula mobile-dev-inc/tap/maestro
brew install mobile-dev-inc/tap/maestro
```

The tap also pulls in Homebrew's latest `openjdk`; the exports use 17. Flows open the dev-client deep link, not `launchApp`, and tap past the launcher and first-run prompts with `optional: true`.

## Other

- `npx expo prebuild` regenerates `ios/` from scratch. Run `pod install` again and recreate `ios/.xcode.env.local` with `export NODE_BINARY=$HOME/.local/node/bin/node`.
- Night vision hides the iOS status bar through `UIViewControllerBasedStatusBarAppearance: false` plus expo-status-bar (ADR 12). Do not set `statusBarHidden` on the navigator.
- `origin` is a public GitHub repo, so nothing personal goes in commits or docs. `gh` is in /opt/homebrew/bin. Unpushed work exists only on this Mac.
- ESLint is pinned to version 9.
- `expo-file-system` was removed on purpose; add it back with photo capture.
- Keep the project in a path without spaces.
