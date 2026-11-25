# 8. On a real device

Goal: check everything that needs a real device in one pass, after feature development. Tag v0.1.0 when it passes.

Deferred on purpose: the app is experimental, and building it out matters more than pinpoint accuracy. Until then, use sensible guesses for anything only a device can settle, and add the check here. Do not start this task, or hold up another for it, until the user says so.

Proof: the user's observations, recorded in the handoff.

- [ ] **8.1 Install.** The user signs in under Xcode Settings > Accounts, connects by cable and taps Trust, turns on Developer Mode, and gives the iPhone model and iOS version. Set the signing team in Xcode (bundle identifier `com.nate.stellar`) and build with `npx expo run:ios --device`. Do not commit the team unless the user agrees. Direct install is preferred over TestFlight, which needs the paid Apple Developer Program. A free Apple ID works, but the app expires after 7 days.
- [ ] **8.2 Basics.** Camera image, lock-on haptic, camera and location prompts (allow and deny), location in a capture, night vision, drag smoothness.
- [ ] **8.3 Sensors.** Direction against a known object, phone upright (ADR 16) and at the zenith, shake, lag, pausing and returning. The find-in-sky arrow (5.4). Tune `TIME_CONSTANT` in `useSensorPose.ts`.
- [ ] **8.4 Calibration.** The accuracy notice and its limit, alignment on a known object, and the field of view against the camera picture, including which lens is used. Read: `fieldOfView.ts`, `AlignPanel.tsx`.
- [ ] **8.5 Sun warning.** With sensor accuracy known, revisit warning in every direction while the camera is on.
- [ ] **8.6 Looks and cost.** Looks over the live camera, Reduce Motion and Reduce Transparency, frame rate, battery.
- [ ] **8.7 Release build.** Repeat the basics with `npx expo run:ios --device --configuration Release`, which runs away from the Mac.
- [ ] **8.8 Android.** When Android testing starts (ADR 11): build, camera, sensors, looks.
