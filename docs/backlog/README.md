# Backlog

The long-term to-do list. This index stays short; detail lives in one file per task.

**Next step: 1.1 in [planets](planets.md).**

## Queue

Sizes are rough estimates in steps. A step should fit in one session.

| #   | Task                                  | Steps | Status     | Needs first                           |
| --- | ------------------------------------- | ----- | ---------- | ------------------------------------- |
| 1   | [Moon, Sun and planets](planets.md)   | 4     | Ready      | -                                     |
| 2   | [Real sensors](sensors.md)            | 5     | Ready      | 2.2 needs a rebuild, 2.5 a real phone |
| 3   | [Simulator tests](simulator-tests.md) | 3     | Needs user | OK to install Java and Maestro        |
| 4   | [Time travel slider](time-travel.md)  | 2     | Ready      | Better after 1                        |
| 5   | [Search with an arrow](search.md)     | 3     | Ready      | Better after 1                        |

## Small fixes

- 6. Alien visitor: see it on the simulator. It waits during lock-on, so check that it appears often enough.

## Needs the user

- Git: merge the pull request for `feat/real-sky-and-looks`.
- Device: say which iPhone and iOS version, and do the steps in the [handoff](../handoff.md).

## Later, not yet prioritized

- Photo capture, the unbuilt part of phase 3.
- Ask about this star: Claude answers from bundled data. Needs a small backend to hold the API key.
- Satellite passes as the first real layer.
- Simplify, to be decided: hide Layers until it has content; freeze or cut Glass and Needlepoint; go iOS-only.

## Rules

- A task file holds its goal, its steps as checkboxes, the files each step needs, and how to prove it.
- Start only steps that are ready. Split a step that will not fit in one session.
- When a task is done, add a line to the changelog, delete its file and remove its row.
