import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useAnimatedReaction, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { alignPose } from '@/core/pose/alignment';
import { poseFromOrientation, smoothOrientation, type Orientation } from '@/core/pose/orientation';
import type { Pose } from '@/core/pose/pose';
import { deg, type Degrees } from '@/core/units';
import { watchOrientation } from '@/services/orientation/orientation';

/** Milliseconds. A first guess, to tune on a phone. */
const TIME_CONSTANT = 100;
/** Below this the compass may be off by more than 20 degrees on iOS. */
const HIGH_ACCURACY = 3;

/**
 * Drives the pose from the phone's sensors while enabled and the app is in front.
 * `tracking` is whether readings are arriving; until then, dragging is the pose source.
 * `correction` is the user's compass alignment, kept while the screen is mounted.
 * Only starting, stopping and accuracy changes render.
 */
export function useSensorPose(pose: SharedValue<Pose>, enabled: boolean) {
  const [inFront, setInFront] = useState(AppState.currentState !== 'background');
  const [tracking, setTracking] = useState(false);
  const [accurate, setAccurate] = useState(true);
  const sensed = useSharedValue<Pose | null>(null);
  const correction = useSharedValue<Degrees>(deg(0));

  // Combined on the UI thread, so aligning never waits for a reading.
  useAnimatedReaction(
    () => (sensed.value ? alignPose(sensed.value, correction.value) : null),
    (next) => {
      if (next) pose.value = next;
    },
  );

  useEffect(() => {
    // Retrying on return also picks up permission granted in the system settings.
    const subscription = AppState.addEventListener('change', (s) => setInFront(s === 'active'));
    return () => subscription.remove();
  }, []);

  const active = enabled && inFront;
  useEffect(() => {
    if (!active) return;
    let live = true;
    let stop: (() => void) | null = null;
    let last: { orientation: Orientation; time: number } | null = null;

    void watchOrientation(({ orientation, time, compassAccuracy }) => {
      if (!live) return;
      if (!last) setTracking(true);
      setAccurate(compassAccuracy >= HIGH_ACCURACY);
      const smooth = last
        ? smoothOrientation(last.orientation, orientation, time - last.time, TIME_CONSTANT)
        : orientation;
      last = { orientation: smooth, time };
      sensed.set(poseFromOrientation(smooth));
    }).then((stopWatching) => {
      if (live) stop = stopWatching;
      else stopWatching?.();
    });

    return () => {
      live = false;
      stop?.();
      sensed.set(null);
      setTracking(false);
    };
  }, [active, sensed]);

  return { tracking, accurate, correction };
}
