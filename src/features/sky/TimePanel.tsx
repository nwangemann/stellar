import { memo } from 'react';
import { View } from 'react-native';
import { Button } from '@/ui/components/Button';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Slider } from '@/ui/components/Slider';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { timeLabel } from './timeLabel';

const HOUR = 3_600_000;
/** Reaches back to last evening from after midnight, and ahead to the next dawn from any time. */
const MIN = -12 * HOUR;
const MAX = 24 * HOUR;
const STEP = HOUR / 6;

type Props = {
  /** The time shown, in milliseconds since 1970. */
  time: number;
  offsetMs: number;
  onOffset: (offsetMs: number) => void;
  onNow: () => void;
};

export const TimePanel = memo(function TimePanel({ time, offsetMs, onOffset, onNow }: Props) {
  const t = useTheme();
  const label = timeLabel(new Date(time));
  return (
    <GlassPanel style={{ paddingVertical: t.space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space.md }}>
        <Text size="title" style={{ flex: 1, fontVariant: ['tabular-nums'] }}>
          {label}
        </Text>
        <NowButton disabled={offsetMs === 0} onPress={onNow} />
      </View>
      <Slider
        label="Time of the sky"
        valueText={label}
        min={MIN}
        max={MAX}
        step={STEP}
        jump={3}
        mark={0}
        value={offsetMs}
        onChange={onOffset}
      />
    </GlassPanel>
  );
});

/** Memoized, because skinned buttons are slow to render and the panel renders on every step. */
const NowButton = memo(function NowButton(props: { disabled: boolean; onPress: () => void }) {
  return <Button variant="quiet" label="Now" {...props} />;
});
