import type { PropsWithChildren } from 'react';
import Animated, { Easing, FadeInDown, FadeOutDown, Keyframe } from 'react-native-reanimated';
import { useTheme } from '../useTheme';
import { GlassPanel } from './GlassPanel';

// Native glass does not render while a parent is faded, so this look only moves and scales.
const glassIn = new Keyframe({
  from: { transform: [{ translateY: 25 }, { scale: 0.94 }] },
  to: { transform: [{ translateY: 0 }, { scale: 1 }], easing: Easing.out(Easing.cubic) },
}).duration(240);

export function Sheet({ children }: PropsWithChildren) {
  const t = useTheme();
  if (t.skin === 'glass')
    return (
      <Animated.View entering={glassIn}>
        <GlassPanel>{children}</GlassPanel>
      </Animated.View>
    );
  return (
    <Animated.View entering={FadeInDown.duration(180)} exiting={FadeOutDown.duration(120)}>
      <GlassPanel>{children}</GlassPanel>
    </Animated.View>
  );
}
