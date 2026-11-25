import { useMemo, useState } from 'react';
import { useAnimatedReaction, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { cosSeparation } from '@/core/astro/phase';
import type { SkyObject } from '@/core/catalog/types';
import type { Pose } from '@/core/pose/pose';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

const NEAR = Math.cos((40 * Math.PI) / 180);
/** Refraction and the Sun's radius keep its edge visible until its centre is this low, in degrees. */
const SET_ALTITUDE = -1;

type Props = { sky: readonly SkyObject[]; pose: SharedValue<Pose>; camera: boolean };

/** The pose does not follow the phone yet, so with the camera on any direction counts. */
export function SunWarning({ sky, pose, camera }: Props) {
  const t = useTheme();
  const sun = useMemo(() => {
    const found = sky.find((o) => o.id === 'sun')?.position;
    return found && found.alt > SET_ALTITUDE ? found : null;
  }, [sky]);
  const [near, setNear] = useState(false);

  useAnimatedReaction(
    () => {
      if (!sun) return false;
      const { alt, az } = pose.value;
      return cosSeparation({ kind: 'altaz', alt, az }, sun) > NEAR;
    },
    (now, before) => {
      if (now !== before) scheduleOnRN(setNear, now);
    },
    [sun],
  );

  if (!sun || !(near || camera)) return null;
  return (
    <GlassPanel style={{ padding: t.space.md }}>
      <Text size="caption" accessibilityRole="alert" style={{ textAlign: 'center' }}>
        Never look at the Sun or point the camera at it.
      </Text>
    </GlassPanel>
  );
}
