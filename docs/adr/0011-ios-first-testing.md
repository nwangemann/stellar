# 11. iOS-first testing

- Status: accepted
- Date: 2026-11-24

## Decision

Test on the iOS simulator and on a physical iPhone. Android testing comes later, on an emulator; no physical Android device is available. Android does not block v0.1.0. Android stays a supported target in code.

## Consequence

Camera and haptics are checked on the physical device before v0.1.0 is tagged. The simulator covers everyday UI work.

Android camera, sensors and haptics stay unverified on real hardware.

## Update, 2026-11-26

`v0.1.0` was tagged at the end of phase 1, before the device pass, to mark the phase. The camera and haptics are checked on a physical device before the next release instead.
