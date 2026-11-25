import { memo, useState } from 'react';
import { useAnimatedReaction, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { altAzVector, dot, type Vector } from '@/core/astro/vector';
import type { Pose } from '@/core/pose/pose';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

const NEAR = Math.cos((40 * Math.PI) / 180);
/** Refraction and the Sun's radius keep its edge visible until its centre is one degree down. */
const SET_HEIGHT = Math.sin((-1 * Math.PI) / 180);

type Props = { sun: SharedValue<Vector>; pose: SharedValue<Pose>; camera: boolean };

/**
 * `sun` is the real Sun, so time travel never hides the warning.
 * The compass can be wrong and dragging is not aiming, so with the camera on any direction counts.
 */
export const SunWarning = memo(function SunWarning({ sun: realSun, pose, camera }: Props) {
  const t = useTheme();
  const [warn, setWarn] = useState(false);

  useAnimatedReaction(
    () => {
      const sun = realSun.value;
      const { alt, az } = pose.value;
      const aim = altAzVector({ kind: 'altaz', alt, az });
      return sun[2] > SET_HEIGHT && (camera || dot(aim, sun) > NEAR);
    },
    (now, before) => {
      if (now !== before) scheduleOnRN(setWarn, now);
    },
    [camera],
  );

  if (!warn) return null;
  return (
    <GlassPanel style={{ padding: t.space.md }}>
      <Text size="caption" accessibilityRole="alert" style={{ textAlign: 'center' }}>
        Never look at the Sun or point the camera at it.
      </Text>
    </GlassPanel>
  );
});
