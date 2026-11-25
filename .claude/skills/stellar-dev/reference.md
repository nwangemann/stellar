# Reference

## Simulator

If another session is using a simulator, use a different one. To test without rebuilding, install the app from `~/Library/Developer/Xcode/DerivedData/Stellar-*/Build/Products/Debug-iphonesimulator/Stellar.app`, then open `stellar://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`. Rebuild if native dependencies changed.

- Two people driving the simulator at once looks like a bug: stray drags and mode changes. Relaunch before debugging.

## Other

- `npx expo prebuild` regenerates `ios/` from scratch. Run `pod install` again and recreate `ios/.xcode.env.local` with `export NODE_BINARY=$HOME/.local/node/bin/node`.
- Night vision hides the iOS status bar through `UIViewControllerBasedStatusBarAppearance: false` plus expo-status-bar (ADR 12). Do not set `statusBarHidden` on the navigator.
- `origin` is a private GitHub repo. `gh` is in /opt/homebrew/bin. Unpushed work exists only on this Mac.
- ESLint is pinned to version 9.
- `file-system` was removed on purpose until phase 5.
- Keep the project in a path without spaces.
