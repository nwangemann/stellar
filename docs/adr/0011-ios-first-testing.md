# 11. iOS-first testing

- Status: accepted
- Date: 2026-11-24

## Decision

Test on the iOS simulator and on a physical iOS device, which the user has. Android testing comes later, on an emulator, with no physical Android devices. This narrows phase 4 of the original plan: Android no longer blocks v0.1.0. Android stays a supported target in code.

## Consequence

Camera and haptics are checked on the physical device before v0.1.0 is tagged. The simulator covers everyday UI work.

Android camera, sensors and haptics stay unverified on real hardware.
