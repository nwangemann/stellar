import { Button } from '@/ui/components/Button';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

type Props = { onReset: () => void; onDone: () => void };

export function AlignPanel({ onReset, onDone }: Props) {
  const t = useTheme();
  return (
    <GlassPanel style={{ gap: t.space.md }}>
      <Text size="title">Align the compass</Text>
      <Text>
        Point the phone at the Moon, a bright star or a planet you know, not too high up. Never use
        the Sun. Drag sideways until its mark sits on the real one.
      </Text>
      <Button label="Done" onPress={onDone} />
      <Button variant="quiet" label="Reset" onPress={onReset} />
    </GlassPanel>
  );
}

/** Shown while the compass is unsure and the user has not aligned it. */
export function CompassNotice() {
  const t = useTheme();
  return (
    <GlassPanel style={{ padding: t.space.md }}>
      <Text size="caption" accessibilityLiveRegion="polite" style={{ textAlign: 'center' }}>
        Compass accuracy is low. Move the phone in a figure eight, or align it with the compass
        button.
      </Text>
    </GlassPanel>
  );
}
