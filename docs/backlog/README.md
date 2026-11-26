# Backlog

The long-term to-do list. This index stays short; detail lives in one file per task.

**Next step: none ready.** Task 3 needs the owner's OK to install Java and Maestro; task 8 waits for the owner's go-ahead. Otherwise pick from **Later**.

Prioritized 2026-11-25 by immediate value: quick visible fixes first, then the feature that brings back the hidden Layers mode.

## Queue

Sizes are rough estimates in steps. A step should fit in one session.

| #   | Task                                  | Steps | Status     | Needs first                        |
| --- | ------------------------------------- | ----- | ---------- | ---------------------------------- |
| 3   | [Simulator tests](simulator-tests.md) | 3     | Needs user | OK to install Java and Maestro     |
| 8   | [On a real device](device.md)         | 8     | Last       | Feature work done, user's go-ahead |

## Later, not yet prioritized

In rough order of value:

- Simplify, to be decided by the owner: freeze or cut Glass and Needlepoint; go iOS-only. Cuts the cost of every later feature.
- Set the GitHub description and topics. The owner's call, since it is public.
- Photo capture, the unbuilt part of phase 3. The simulator has no camera, so most of it can only be proven in task 8.
- Ask about this star: Claude answers from bundled data. Needs a small backend to hold the API key.

## Rules

- Anything that needs a real device, including tuning and calibration, goes in [task 8](device.md) and never holds up other work.
- A task file holds its goal, its steps as checkboxes, the files each step needs, and how to prove it.
- Start only steps that are ready. Split a step that will not fit in one session.
- When a task is done, add a line to the changelog, delete its file and remove its row.
