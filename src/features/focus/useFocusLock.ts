import { useCallback, useState } from 'react';
import {
  useFrameCallback,
  useSharedValue,
  withTiming,
  type DerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { SkyMark, SkyTurn } from '@/core/catalog/types';
import { stepLock, UNLOCKED, type LockState } from '@/core/focus/lock';
import type { Pose } from '@/core/pose/pose';
import { hitTest, type Viewport } from '@/core/projection/projection';

const RADIUS = 44;

export function useFocusLock(
  targets: readonly SkyMark[],
  turn: DerivedValue<SkyTurn>,
  pose: SharedValue<Pose>,
  view: Viewport,
  onLock: () => void,
  /** Preferred over nearer targets, so a neighbour cannot take its place. */
  wantedId: string | null,
) {
  const [lockedId, setLockedId] = useState<string | null>(null);
  const lock = useSharedValue<LockState>(UNLOCKED);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const publish = useCallback(
    (id: string | null) => {
      setLockedId(id);
      if (id) onLock();
    },
    [onLock],
  );

  useFrameCallback((frame) => {
    'worklet';
    const before = lock.value;
    const hit = hitTest(targets, turn.value, pose.value, view, RADIUS, wantedId ?? before.lockedId);
    const next = stepLock(before, hit ? hit.id : null, frame.timestamp);
    if (next !== before) lock.value = next;
    if (next.lockedId !== before.lockedId) scheduleOnRN(publish, next.lockedId);
    if (next.lockedId && hit) {
      // Ease towards the target; this also tracks it while it drifts.
      offsetX.value += (hit.point.x - view.width / 2 - offsetX.value) * 0.3;
      offsetY.value += (hit.point.y - view.height / 2 - offsetY.value) * 0.3;
    } else if (before.lockedId) {
      offsetX.value = withTiming(0, { duration: 150 });
      offsetY.value = withTiming(0, { duration: 150 });
    }
  });

  // After a mode change, the next frame re-evaluates the lock against the new targets.
  return { lockedId: targets.some((m) => m.id === lockedId) ? lockedId : null, offsetX, offsetY };
}
