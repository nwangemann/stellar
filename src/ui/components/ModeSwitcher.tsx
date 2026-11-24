import { useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Chip } from './Chip';

type Props<T extends string> = {
  modes: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
};

/** Camera-style strip: tap a mode, or swipe to move to its neighbour. */
export function ModeSwitcher<T extends string>({ modes, value, onChange }: Props<T>) {
  const swipe = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-20, 20])
        .onEnd((e) => {
          const index = modes.findIndex((m) => m.id === value);
          const next = modes[index + (e.translationX < 0 ? 1 : -1)];
          if (next) onChange(next.id);
        }),
    [modes, value, onChange],
  );
  return (
    <GestureDetector gesture={swipe}>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {modes.map((m) => (
          <Chip
            key={m.id}
            role="tab"
            label={m.label}
            selected={m.id === value}
            onPress={() => onChange(m.id)}
          />
        ))}
      </View>
    </GestureDetector>
  );
}
