# 2. Real sensors

Goal: pointing the phone moves the sky. Dragging stays as the fallback.

Proof: the math has unit tests. Accuracy and feel need a person with a real phone; the simulator cannot show them.

- [ ] **2.1 Math.** Turn a device orientation into `Pose` in `src/core/pose`. Test level, zenith, each compass direction and roll. Smooth the rotation itself, not its angles, because azimuth jumps near the zenith. Read: `src/core/pose/`, `src/core/projection/`.
- [ ] **2.2 Adapter.** Choose the packages (`expo-sensors`, `expo-location` heading) from the Expo 58 docs; record an ADR. Add `src/services/orientation` with a `.web` variant, permission text and true north rather than magnetic. Rebuild the app. Read: `src/services/location/`, `app.json`.
- [ ] **2.3 Wiring.** Feed the pose shared value without React renders. Pause when the screen is covered. Add a sensor or drag setting; denied permission means drag. Read: `SkyScreen.tsx`, `src/state/settings.ts`, `app/settings.tsx`.
- [ ] **2.4 Calibration.** Show low compass accuracy, let the user align on a known object, and review the fixed 60 degree field of view. Read: what 2.3 changed, and the camera service.
- [ ] **2.5 On a phone.** With the user: direction against a known object, shake, lag, zenith, battery. Tune and record the results.
