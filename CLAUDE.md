# Stellar

@AGENTS.md

- Any change to `src/core`, features, dependencies or standards must update the matching doc in the same change.
- Significant decisions get an ADR in `docs/adr`.
- `src/core` stays free of React and Expo imports.
- Never read `src/data/*.json` whole; look up records with `grep` and cap output with `head -c`.
- Run `npm run check` before declaring work done.
- Keep testing and validation to a minimum. This is not in production, so favour progress over stability and security: `npm run check` is usually enough. Add a few tests only where mistakes are likely and hard to see; skip exhaustive cases, regression sweeps and repeat simulator checks.

## Session routine

1. Read `docs/backlog/README.md`, then only the file for the task at hand. Read `docs/handoff.md` only when you need project state.
2. Load the `stellar-dev` skill before running anything.
3. Do one step (one checkbox). Open only the files that step lists.
4. Run `npm run check`, tick the step, update "Next step" in the backlog index, and stop. Start the next step in a new session.

New ideas go in the backlog, not in the current step.
