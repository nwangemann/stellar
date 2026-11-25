import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { isBodyId } from '@/core/astro/bodies';
import { BODY_NAMES } from '@/core/catalog/sky';
import { FindInSky } from '@/features/find/FindButton';
import { timeLabel } from '@/features/sky/timeLabel';
import { useMoment } from '@/features/sky/useMoment';
import { FactRow } from '@/ui/components/FactRow';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { bodyFacts } from './facts';

export function BodyScreen() {
  const t = useTheme();
  const { id, at } = useLocalSearchParams<{ id: string; at?: string }>();
  const { moment: now, demo } = useMoment();
  // The time the sky showed, when that was not the present.
  const moment = useMemo(() => (at ? { ...now, date: new Date(at) } : now), [now, at]);
  const facts = useMemo(() => bodyFacts(id, moment), [id, moment]);
  if (!isBodyId(id))
    return <Text style={{ padding: t.space.lg }}>This object is not in the catalog.</Text>;
  return (
    <ScrollView contentContainerStyle={{ padding: t.space.lg, gap: t.space.md }}>
      <Stack.Screen options={{ title: BODY_NAMES[id] }} />
      <FindInSky target={{ kind: 'body', id, name: BODY_NAMES[id] }} at={at} />
      <GlassPanel>
        <Text size="title">{at ? timeLabel(moment.date) : 'Right now'}</Text>
        {facts.map((f) => (
          <FactRow key={f.label} {...f} />
        ))}
      </GlassPanel>
      {id === 'sun' ? (
        <Text>Never look at the Sun through a camera, binoculars or a telescope.</Text>
      ) : null}
      <Text size="caption" muted>
        {demo ? 'For the demo location. ' : ''}Times are in your device’s time zone, for a flat
        horizon. Calculated with Astronomy Engine.
      </Text>
    </ScrollView>
  );
}
