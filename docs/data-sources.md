# Data sources

Everything is bundled in `src/data`. The app makes no network requests for sky data yet; links open in the browser. Fetched 2026-11-24 unless noted. Satellite orbits will be fetched at launch from step 10.2 (ADR 18); the bundled set is the offline fallback.

| Data                                            | File                                  | Origin and version                                                                       | Licence                                 |
| ----------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| Stars to magnitude 6, plus fainter figure stars | `stars.json`                          | HYG 4.4, codeberg.org/astronexus/hyg, SHA-256 `00b34989…82197d`                          | CC BY-SA 4.0                            |
| Constellation and culture figures               | `constellations.json`, `figures.json` | Stellarium sky cultures, commit `2d80ce7`                                                | CC BY-SA (the source states no version) |
| Stories                                         | `mythology.ts`                        | Summaries written for Stellar from Stellarium and Wikipedia; each links a fixed revision | CC BY-SA 4.0                            |
| Paper titles                                    | `papers.json`                         | arXiv API, title search in astro-ph.SR for 50 named stars                                | Terms still to be checked               |
| Planets                                         | `planets.json`                        | NASA Exoplanet Archive, `pscomppars`, V < 6.5                                            | Terms still to be checked               |
| Satellite orbits (TLE), 20 bright satellites    | `satellites.json`                     | CelesTrak `gp.php?GROUP=visual&FORMAT=tle`, fetched 2026-11-25                           | CelesTrak terms, see below              |

Rebuild with `node scripts/build-catalog.mjs <dir>`, where `<dir>` holds `hyg/hyg_v44.csv.gz`, `sc/<culture>/index.json`, `api/papers.json` and `api/planets.json`. It writes one record per line to keep searches small. The script fails if a line star is missing.

The app does not bundle these test values: `src/core/astro/fixtures/horizons.json` holds airless apparent positions from the JPL Horizons API (DE441, observer tables, quantities 2 and 4), fetched 2026-11-24. Sites are at 0 km: 40.7128° N, 74.006° W and 33.8688° S, 151.2093° E.

`satellites.json` was picked by hand from the visual group: ISS (ZARYA) first, then CSS (TIANHE), HST, the five BlueBird satellites (SPACEMOBILE-001 to 005), and twelve large ones such as ENVISAT, SEASAT 1 and AJISAI. Rocket bodies were left out because their names repeat. To refresh it, fetch the same URL and keep the same names. CelesTrak's data comes from the US Space Force's Space-Track, which allows redistribution of these public elements; CelesTrak asks for attribution and that clients fetch no more often than the data updates (about every two hours). Its terms are at celestrak.org/webmaster.php and are to be checked again before release.

## Limits

- HYG carries some doubtful values, such as type F7V for Dubhe. Colour words use B−V instead.
- Papers match on title words. Known false matches are filtered by the script; relevance is arXiv's, not curated. 27 stars have papers.
- The Pleiades are a cluster, added as an 89th entry using the Indian figure's lines.
- Cultures with no-derivatives, non-commercial or GPL terms were left out. No illustrations are bundled.
- Stories are outsiders' summaries. Review by the communities concerned is still needed before release.
- Bundled orbits age with the app build. A week-old ISS orbit can be off by tens of seconds along track, more after a reboost (ADR 18).
- SIMBAD answered 404 and VizieR timed out on 2026-11-24, so neither is used.
