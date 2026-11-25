# 16. DeviceMotion plus compass heading for true north

- Status: accepted
- Date: 2026-11-24

## Context

The pose maths needs an orientation in portrait device axes and an east, true north, up world. Expo has no single API for that. `expo-sensors` DeviceMotion gives fused angles, in radians, relative to magnetic north. `expo-location` gives true and magnetic headings.

## Decision

Use `expo-sensors` DeviceMotion for rotation and the difference between `expo-location`'s two headings as the declination. `src/services/orientation` converts each platform's frame: iOS measures from x = magnetic north, Android from x = east.

No reading is sent until the declination is known, and none without location permission. The caller then uses dragging.

## Consequences

- No new prompt: raw motion needs no permission, so DeviceMotion's permission request is not called. iOS still needs its usage text. Android's activity recognition permission is blocked.
- The frame conversions come from reading the package source, SDK 58. Recheck them when upgrading.
- The pose assumes portrait. iPhones are locked to it, but iPads and large Android screens can rotate, and would show the sky turned.
- DeviceMotion gives Euler angles, which are ambiguous with the phone upright. Alpha and gamma come from the same sample, so they recombine correctly, but this needs a check on a phone.
