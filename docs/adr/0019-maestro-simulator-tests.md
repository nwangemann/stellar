# 19. Maestro for simulator tests

- Status: accepted
- Date: 2026-11-26

## Context

Unit tests cover `src/core` and components, but nothing proves the app launches and the main flow works end to end. One command was wanted for that, on the iOS simulator first (ADR 11). The app runs as a development build (ADR 2), so a test must get past the dev-client launcher to the app.

## Decision

- Use Maestro: YAML flows in `.maestro/`, run with `npm run test:e2e`. It drives the simulator through accessibility labels, needs no code in the app and no native changes, and the same flows run on Android later.
- Install it with Homebrew from the `mobile-dev-inc/tap` tap, as the Maestro docs say, with Homebrew's `openjdk@17`. Both stay off the shell profile; the skill lists the exports.
- A flow opens the dev client's deep link to Metro on port 8081 instead of `launchApp`, so it loads the current JavaScript without a rebuild.
- Flows reuse `launch.yaml` with `runFlow`. They reach a known pose through the app's own UI, not test-only code: search, then Find in sky, on an object that is always up from the demo location (40° N, 105° W), such as Polaris. The simulator has no sensors, so the sky is in drag mode and Find in sky turns it.

## Consequences

- Flows need Metro running and the development build installed on the simulator.
- Flows select by visible text, so renaming a label can break a flow.
- The logbook keeps entries from earlier runs, so a flow proves its own save by the "Identified …" message, then checks the entry is listed.
- Maestro is a Java tool outside npm, so it is not in `package.json` and CI does not run it yet.
