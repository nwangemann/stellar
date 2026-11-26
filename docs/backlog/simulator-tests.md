# 3. Simulator tests

Goal: one command proves the main flow: launch, lock on, identify, logbook.

Java 17 and Maestro were installed on 2026-11-26 with the owner's OK (ADR 19).

- [x] **3.1 First flow.** Install the tools, document them, and launch to the sky screen. Done: `.maestro/launch.yaml`, run with `npm run test:e2e`.
- [x] **3.2 Main flow.** Lock on, identify, find the logbook entry. Done: `.maestro/identify.yaml` searches for Polaris, taps Find in sky, waits for Identify to enable, identifies and checks the logbook. No app code: Polaris is always up from 40° N, so the real time does not matter.
- [ ] **3.3 Coverage.** Looks, night vision, a detail screen. Document the command in the skill.
