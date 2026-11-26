import { memo } from 'react';
import { View } from 'react-native';
import type { InfoCard, ModeId, Target } from '@/core/layers/types';
import { Button } from '@/ui/components/Button';
import { FactRow } from '@/ui/components/FactRow';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { IconButton } from '@/ui/components/IconButton';
import { ModeSwitcher } from '@/ui/components/ModeSwitcher';
import { Sheet } from '@/ui/components/Sheet';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { PLUGINS } from './plugins';

// Memoized, because the sky screen renders on every refresh and skinned controls are slow to
// render. Pass stable props.

type TopBarProps = {
  demo: boolean;
  tracking: boolean;
  onSearch: () => void;
  onTime: () => void;
  onAlign: () => void;
  onLogbook: () => void;
  onSettings: () => void;
};

export const TopBar = memo(function TopBar(props: TopBarProps) {
  const t = useTheme();
  return (
    <>
      {props.demo ? (
        <Text size="caption" muted={t.skin === 'default'}>
          Demo location
        </Text>
      ) : null}
      {props.tracking ? (
        <IconButton icon="compass" label="Align the compass" onPress={props.onAlign} />
      ) : null}
      <IconButton icon="search" label="Search" onPress={props.onSearch} />
      <IconButton icon="clock" label="Time travel" onPress={props.onTime} />
      <IconButton icon="book" label="Logbook" onPress={props.onLogbook} />
      <IconButton icon="gear" label="Settings" onPress={props.onSettings} />
    </>
  );
});

const DETAILS_LABEL: Record<Target['kind'], string> = {
  star: 'Star details',
  body: 'Details',
  constellation: 'Explore constellation',
  satellite: 'Next pass and details',
};

type TargetSheetProps = { card: InfoCard; target: Target; onExplore: (target: Target) => void };

export const TargetSheet = memo(function TargetSheet({
  card,
  target,
  onExplore,
}: TargetSheetProps) {
  const t = useTheme();
  const label = DETAILS_LABEL[target.kind];
  return (
    <Sheet>
      <Text size="title">{card.title}</Text>
      {card.rows.map((r) => (
        <FactRow key={r.label} {...r} />
      ))}
      {label ? (
        <View style={{ marginTop: t.space.md }}>
          <Button variant="quiet" label={label} onPress={() => onExplore(target)} />
        </View>
      ) : null}
    </Sheet>
  );
});

type DockProps = {
  mode: ModeId;
  onMode: (mode: ModeId) => void;
  target: Target | null;
  onIdentify: (target: Target) => void;
};

export const Dock = memo(function Dock({ mode, onMode, target, onIdentify }: DockProps) {
  const t = useTheme();
  return (
    <GlassPanel dock style={{ padding: t.space.sm, gap: t.space.sm }}>
      <ModeSwitcher modes={PLUGINS} value={mode} onChange={onMode} />
      <Button
        label="Identify"
        disabled={!target}
        onPress={() => {
          if (target) onIdentify(target);
        }}
      />
    </GlassPanel>
  );
});
