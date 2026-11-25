# 17. Lens zoom and Apple's zoom transition for details

- Status: accepted
- Date: 2026-11-24

## Context

Opening details from the sky should feel like zooming in on the object, and closing them like returning. Three versions were tried behind a temporary setting: none, a zoom followed by the sheet, and a zoom with Apple's transition. The user chose the last.

## Decision

Zoom the projection lens around the object, and open the details with Expo Router's `Link.AppleZoom` before the zoom ends. Before iOS 18 and off iOS, the plain sheet follows the zoom. With Reduce Motion the details just open.

Not chosen: scaling the sky layer, which blurs marks and leaves edges empty; changing the field of view in React state, which rebuilds the worklets; our own card over a transparent modal, which would rebuild the swipe and accessibility by hand; Reanimated shared elements, which are off by default and cannot share Skia marks.

## Consequences

- Only a `Link` can start the transition, so an invisible one sits at the object and its press handler is called. Recheck this when upgrading Expo Router.
- Only drawing is zoomed. Hit-testing is not, so the lock holds and the return is exact.
- The camera cannot zoom around an off-centre point, so its picture fades out instead.
- Wide constellations zoom only slightly.
