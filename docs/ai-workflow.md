# How Stellar was built with an AI agent

Most of Stellar was written by an AI coding agent (Claude Code), steered by a person who chose the direction, judged the results and decided what to keep. This page describes the files that steer the agent, the loop the work followed, and which checks the agent ran itself versus which are left to a person.

## The files that steer the agent

The agent reads these at the start of every session, so each session can start cold instead of relying on chat history.

- [`CLAUDE.md`](../CLAUDE.md) and [`AGENTS.md`](../AGENTS.md): the house rules and the session routine. `src/core` imports no React or Expo; docs change with the code; Expo APIs are looked up in the installed types and the versioned docs, never coded from memory; packages are added with `npx expo install`.
- The backlog: a short index with a **Next step** line, and one file per task with its steps as checkboxes, the files each step needs and how to prove it. Ideas that are not next go under **Later**, not into the current step.
- The handoff: what is built, what has been verified and how, and the known limits.

The backlog, the handoff and the dated reviews are working notes kept outside the repository, in a git-ignored `dev/` folder, so the repository holds only the project and its documentation. The facts in them that a reader needs, such as known limits and what is verified, are in the [README](../README.md#status).

- [Decision records](adr/): nineteen short ADRs, from the stack to the Maestro simulator tests. A later session reads the decision instead of making it again.
- [System docs](systems/): one page per feature folder, with the rules that are easy to break (for example, never capture a JS-thread object in a worklet).
- The `stellar-dev` skill (`.claude/skills/stellar-dev`): how to set up the shell, run the simulator and the checks, and the gotchas found so far.
- `npm run check`: types, lint, formatting, unit tests and a docs check that fails if `package.json` and [dependencies.md](dependencies.md) disagree or a feature folder has no system doc. A Husky hook runs it before every commit, commitlint checks the message, and [CI](../.github/workflows/check.yml) runs it on pull requests and `main`.

## The loop

1. **Pick one step.** The agent reads the backlog index, then only that task's file and the files the step lists.
2. **Build it.** Code, tests where mistakes are likely and hard to see, and the matching docs in the same change. A significant decision gets an ADR.
3. **Check what can be checked.** Unit tests for the maths; the iOS simulator for anything visible, with a faked date or place when the real sky would not show it.
4. **Record it.** Tick the step, update **Next step**, and note in the handoff what was seen and what was not. Anything only a phone can settle goes into the last backlog task.
5. **Explore, then reduce.** Ideas are tried cheaply and dropped with a reason: an alien visitor in the Starship look, three versions of the details transition behind a temporary setting.

## What the agent verified

- **Unit tests** for coordinates, precession, Sun, Moon and planet positions against JPL Horizons, projection, the lock-on state machine, sensor orientation and smoothing, compass alignment, the find-in-sky arrow, search, star and body facts, satellite orbits, sunlight, passes and the orbit fallback order, and the night palette: 210 tests in 26 suites.
- **The simulator.** Each visible step was run in a development build on the iOS simulator; the screenshots in the README come from it.
- **Measurement.** The sky refresh was timed on the simulator before and after it was rebuilt around a single rotation per refresh.

## What is left to a person

The last backlog task collects everything a simulator cannot judge: the camera image, haptics and permission prompts, the sensors against a known star, compass alignment and the camera's field of view, the Sun warning, looks over the live camera, frame rate and battery, a release build, and Android. It is deliberately last and never blocks other work.
