# Stellar

@AGENTS.md

- Any change to `src/core`, features, dependencies or standards must update the matching doc in the same change.
- Significant decisions get an ADR in `docs/adr`.
- `src/core` stays free of React and Expo imports.
- Never read `src/data/*.json` whole; look up records with `grep` and cap output with `head -c`.
- Run `npm run check` before declaring work done.
- Keep testing and validation to a minimum. This is not in production, so favour progress over stability and security: `npm run check` is usually enough. Add a few tests only where mistakes are likely and hard to see; skip exhaustive cases, regression sweeps and repeat simulator checks.

## Session routine

1. Read `dev/backlog/README.md`, then only the file for the task at hand. Read `dev/handoff.md` only when you need project state. `dev/` holds process notes (backlog, handoff, reviews); it is git-ignored, and committed files never link to it.
2. Load the `stellar-dev` skill before running anything.
3. Do one step (one checkbox). Open only the files that step lists.
4. Run `npm run check`, tick the step, update "Next step" in the backlog index, and stop. Start the next step in a new session.

New ideas go in the backlog, not in the current step. Project docs (architecture, systems, ADRs, README) are committed; backlogs, handoffs, reviews and other process notes go in `dev/`. Public facts from them, such as known limits, belong in the README.
