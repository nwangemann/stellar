# 3. Simulator tests

Goal: one command proves the main flow: launch, lock on, identify, logbook.

Java 17 and Maestro were installed on 2026-11-26 with the owner's OK (ADR 19).

- [x] **3.1 First flow.** Install the tools, document them, and launch to the sky screen. Done: `.maestro/launch.yaml`, run with `npm run test:e2e`.
- [ ] **3.2 Main flow.** Lock on, identify, find the logbook entry. Needs a fixed time, place and pose so the result repeats.
- [ ] **3.3 Coverage.** Looks, night vision, a detail screen. Document the command in the skill.
