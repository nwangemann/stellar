import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { SkinId } from '../tokens/tokens';
import { useTheme } from '../useTheme';

type Props = {
  label: string;
  /** Read out by screen readers instead of the number. */
  valueText: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** Must be stable, or the gesture is rebuilt. */
  onChange: (value: number) => void;
  /** Draws a tick at this value. */
  mark: number;
  /** How far a screen reader moves it, in steps. */
  jump: number;
};

const THUMB = 26;

/** Drawn with views, so night vision stays red. The thumb moves on the UI thread. */
export function Slider(props: Props) {
  const { label, valueText, min, max, step, value, onChange, mark, jump } = props;
  const t = useTheme();
  const [width, setWidth] = useState(0);
  const travel = Math.max(0, width - THUMB);
  const shown = useSharedValue(value);
  const dragging = useSharedValue(false);

  useEffect(() => {
    if (!dragging.get()) shown.set(value);
  }, [value, shown, dragging]);

  const drag = useMemo(() => {
    const move = (x: number) => {
      'worklet';
      if (travel === 0) return;
      const at = Math.min(1, Math.max(0, (x - THUMB / 2) / travel));
      const next = Math.round((min + at * (max - min)) / step) * step;
      if (next === shown.get()) return;
      shown.set(next);
      scheduleOnRN(onChange, next);
    };
    return Gesture.Pan()
      .minDistance(0)
      .onStart((e) => {
        'worklet';
        dragging.set(true);
        move(e.x);
      })
      .onUpdate((e) => {
        'worklet';
        move(e.x);
      })
      .onFinalize(() => {
        'worklet';
        dragging.set(false);
      });
  }, [travel, min, max, step, onChange, shown, dragging]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ((shown.value - min) / (max - min)) * travel }],
  }));
  const nudge = (by: number) => onChange(Math.min(max, Math.max(min, value + by)));

  return (
    <GestureDetector gesture={drag}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: valueText }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) =>
          nudge(e.nativeEvent.actionName === 'increment' ? jump * step : -jump * step)
        }
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={[styles.slider, { height: t.hit }]}
      >
        <View style={[styles.track, trackArt(t.skin, t.color.textMuted)]} />
        <View
          style={[
            styles.mark,
            {
              left: THUMB / 2 + ((mark - min) / (max - min)) * travel - 1,
              backgroundColor: t.color.text,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: t.color.accent, borderColor: t.color.onAccent },
            thumbArt(t.skin, t.color.accent),
            thumbStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

function trackArt(skin: SkinId, color: string): ViewStyle {
  // A dashed stitch needs a border on every side, or iOS does not draw it.
  if (skin === 'needlepoint')
    return { borderWidth: 1, borderStyle: 'dashed', borderColor: color, height: 3 };
  if (skin === 'glass') return { height: 6, backgroundColor: 'rgba(255, 255, 255, 0.35)' };
  return { height: 3, backgroundColor: color };
}

function thumbArt(skin: SkinId, accent: string): ViewStyle | null {
  if (skin === 'starship') return { boxShadow: `0 0 14px ${accent}` };
  if (skin === 'glass') return { borderWidth: 0, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' };
  if (skin === 'needlepoint') return { boxShadow: '0 2px 3px rgba(70, 45, 20, 0.4)' };
  return null;
}

const styles = StyleSheet.create({
  slider: { justifyContent: 'center' },
  track: { marginHorizontal: THUMB / 2, borderRadius: 3, pointerEvents: 'none' },
  mark: { position: 'absolute', width: 2, height: 14, pointerEvents: 'none' },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 2,
    pointerEvents: 'none',
  },
});
