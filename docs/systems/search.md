# Search

`SearchScreen` (`src/features/search`) lists matches as the user types; each opens its existing details screen, and Back returns to the results. It uses the time the sky shows, passed as `at`. Objects below the horizon are labelled; a constellation counts as below only when none of the stars that lock on to it is up. The system keyboard is dark but not red in night vision.

`detailsRoute` in `src/features/sky/details.ts` gives the route to any object's details, with the time shown.

Matching is in [sky-model](sky-model.md).

Each result also has a [Find in sky](find.md) button.
