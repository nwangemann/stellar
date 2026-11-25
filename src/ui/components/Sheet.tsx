import type { PropsWithChildren } from 'react';
import Animated, { FadeInDown, FadeOutDown, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../useTheme';
import { GlassPanel } from './GlassPanel';

export function Sheet({ children }: PropsWithChildren) {
  const t = useTheme();
  // Native glass does not render while a parent is faded, so this look only scales.
  if (t.skin === 'glass')
    return (
      <Animated.View entering={ZoomIn.springify().damping(14)}>
        <GlassPanel>{children}</GlassPanel>
      </Animated.View>
    );
  return (
    <Animated.View entering={FadeInDown.duration(180)} exiting={FadeOutDown.duration(120)}>
      <GlassPanel>{children}</GlassPanel>
    </Animated.View>
  );
}
