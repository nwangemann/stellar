import { memo, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type DerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SkyMark, SkyTurn } from '@/core/catalog/types';
import type { Pose } from '@/core/pose/pose';
import { arrowTo } from '@/core/projection/arrow';
import { lensFor, starLens, type Viewport } from '@/core/projection/projection';
import { Button } from '@/ui/components/Button';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

const SIZE = 28;
/** Pixels from the arrow to the object. Inside the lock radius, so the arrow lasts until then. */
const GAP = 36;
/** Room for the top bar with the find panel, and for the dock. */
const TOP = 170;
const BOTTOM = 190;

type ArrowProps = {
  mark: SkyMark;
  turn: DerivedValue<SkyTurn>;
  pose: SharedValue<Pose>;
  view: Viewport;
};

/** Leads to a mark. Moves on the UI thread. */
export const FindArrow = memo(function FindArrow({ mark, turn, pose, view }: ArrowProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const box = useMemo(
    () => ({
      left: SIZE,
      top: insets.top + TOP,
      right: width - SIZE,
      bottom: height - insets.bottom - BOTTOM,
    }),
    [insets.top, insets.bottom, width, height],
  );
  const style = useAnimatedStyle(() => {
    const now = turn.value;
    const lens = lensFor(pose.value, view);
    const place = mark.kind === 'body' ? now.bodies[mark.id] : now.satellites[mark.id];
    const arrow =
      mark.kind === 'star'
        ? arrowTo(starLens(lens, now), mark.direction, box, GAP)
        : place
          ? arrowTo(lens, place, box, GAP)
          : null;
    return {
      opacity: arrow ? 1 : 0,
      transform: [
        { translateX: (arrow?.x ?? 0) - SIZE / 2 },
        { translateY: (arrow?.y ?? 0) - SIZE / 2 },
        { rotate: `${arrow?.angle ?? 0}rad` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.arrow, style]}>
      <View style={[styles.head, { borderLeftColor: t.color.accent }]} />
    </Animated.View>
  );
});

type PanelProps = { name: string; up: boolean; onCancel: () => void };

export const FindPanel = memo(function FindPanel({ name, up, onCancel }: PanelProps) {
  const t = useTheme();
  return (
    <GlassPanel style={{ padding: t.space.sm }}>
      <View style={[styles.row, { gap: t.space.md }]}>
        <Text accessibilityLiveRegion="polite" numberOfLines={2} style={styles.label}>
          {up ? `Follow the arrow to ${name}` : `${name} is below the horizon`}
        </Text>
        <Button
          variant="quiet"
          label="Cancel"
          accessibilityLabel={`Stop finding ${name}`}
          onPress={onCancel}
        />
      </View>
    </GlassPanel>
  );
});

const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  head: {
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { flex: 1 },
});
