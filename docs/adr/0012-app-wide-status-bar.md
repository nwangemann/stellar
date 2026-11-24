# 12. App-wide iOS status bar and themed header

- Status: accepted
- Date: 2026-11-24

## Context

On iOS 26 the system back button and status bar stayed white in night vision. Setting `statusBarHidden` on the navigator had no effect in the development build.

## Decision

Set `UIViewControllerBasedStatusBarAppearance` to false in app.json, control the bar with expo-status-bar, and replace the system header with `ScreenHeader`.

## Consequence

Changing the Info.plist setting needs a native rebuild. The Expo developer menu button is not red-safe, but it exists only in development builds.
