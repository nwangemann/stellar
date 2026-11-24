import type { PropsWithChildren } from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { GlassPanel } from './GlassPanel';

export function Sheet({ children }: PropsWithChildren) {
  return (
    <Animated.View entering={FadeInDown.duration(180)} exiting={FadeOutDown.duration(120)}>
      <GlassPanel>{children}</GlassPanel>
    </Animated.View>
  );
}
