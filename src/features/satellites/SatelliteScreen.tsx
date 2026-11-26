import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { SATELLITE_ALIASES } from '@/core/satellites/names';
import { nextPass } from '@/core/satellites/pass';
import { FindInSky } from '@/features/find/FindButton';
import { timeLabel } from '@/features/sky/timeLabel';
import { useMoment } from '@/features/sky/useMoment';
import { useOrbits } from '@/state/orbits';
import { FactRow } from '@/ui/components/FactRow';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { passFacts, passSummary, satelliteFacts } from './facts';

export function SatelliteScreen() {
  const t = useTheme();
  const { id, at } = useLocalSearchParams<{ id: string; at?: string }>();
  const { moment: now, demo } = useMoment();
  const satellite = useOrbits((s) => s.satellites.find((x) => x.id === id));
  // The time the sky showed, when that was not the present.
  const moment = useMemo(() => (at ? { ...now, date: new Date(at) } : now), [now, at]);
  const facts = useMemo(
    () => (satellite ? satelliteFacts(satellite, moment) : []),
    [satellite, moment],
  );
  const pass = useMemo(() => (satellite ? nextPass(satellite, moment) : null), [satellite, moment]);
  if (!satellite)
    return <Text style={{ padding: t.space.lg }}>This satellite is not in the orbit data.</Text>;
  const alias = SATELLITE_ALIASES[satellite.id]?.[0];
  return (
    <ScrollView contentContainerStyle={{ padding: t.space.lg, gap: t.space.md }}>
      <Stack.Screen options={{ title: satellite.name }} />
      {alias ? <Text muted>{alias}</Text> : null}
      <FindInSky
        target={{ kind: 'satellite', id: satellite.id, name: satellite.name }}
        at={at}
        below={passSummary(pass, moment)}
      />
      <GlassPanel>
        <Text size="title">Next visible pass</Text>
        {passFacts(pass, moment).map((f) => (
          <FactRow key={f.label} {...f} />
        ))}
      </GlassPanel>
      <GlassPanel>
        <Text size="title">{at ? timeLabel(moment.date) : 'Right now'}</Text>
        {facts.map((f) => (
          <FactRow key={f.label} {...f} />
        ))}
      </GlassPanel>
      <Text size="caption" muted>
        {demo ? 'For the demo location. ' : ''}Visible means above 10°, in sunlight, with the sky
        dark. Times are in your device’s time zone. Calculated with satellite.js from CelesTrak
        orbits.
      </Text>
    </ScrollView>
  );
}
