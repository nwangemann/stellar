# Pose

`src/core/pose/pose.ts` holds azimuth, altitude and roll. The pose follows the phone's sensors when it can, and dragging otherwise.

`src/core/pose/orientation.ts` turns a device orientation into a pose. An orientation is a quaternion from device axes (portrait) to east, true north and up, so an adapter must supply true north and map its own frame to this one. `src/services/orientation` does that (ADR 16): it streams readings only with location permission and a known declination, and resolves to null when the phone cannot supply them. Both the maths and the adapter assume portrait. `orientationFromAngles` accepts W3C-style alpha, beta and gamma.

Smooth the orientation with `smoothOrientation` before calling `poseFromOrientation`. Near the zenith azimuth and roll jump, but together they still draw the same picture; smoothing them separately would swing the sky around.

`useSensorPose` in `src/features/sky` connects the two. It smooths each reading, adds the user's compass correction and writes the pose shared value; React renders only when tracking starts or stops or the compass accuracy crosses the limit. It stops while another screen covers the sky or the app is not in front, and tries again on return. Dragging works until the first reading and is off while tracking. The first drag drops any roll the sensors left. [Find in sky](find.md) turns the view with `facing` and `turnStart`, the short way round; dragging interrupts it.

## Compass alignment

Phone compasses are often off by 20° or more. While tracking, a notice shows when the reported accuracy is below 3 (worse than 20° on iOS) and the user has not aligned. The compass button opens `AlignPanel`: the user points at a known object and drags the sky sideways onto it. `src/core/pose/alignment.ts` turns that drag into an azimuth correction. It fixes the compass only; tilt is trusted, since gravity gives it. The correction lasts until reset or the app restarts, because compass error changes from place to place. It is untried on a phone.

The "Follow the phone" setting (`followPhone`, on by default) chooses between them. Without location permission, or on the simulator or web, the sky is dragged.
