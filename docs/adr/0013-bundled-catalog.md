# 13. Bundled sky data

- Status: accepted; amended by ADR 15
- Date: 2026-11-24

## Decision

Bundle a trimmed star catalog, figures, paper titles and stories instead of calling live services. Positions are computed in `src/core/astro` without a library. Share-alike data stays in `src/data`, apart from the MIT code.

## Consequences

The app works offline and needs no keys or server. Data is a snapshot and needs a rebuild to update. A live literature search later would need caching, and a proxy if it uses NASA ADS.
