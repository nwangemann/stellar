import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { constellationById, figureLines, starsIn } from '@/core/catalog/catalog';
import { Chip } from '@/ui/components/Chip';
import { FactRow } from '@/ui/components/FactRow';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { LinkRow } from '@/ui/components/LinkRow';
import { Button } from '@/ui/components/Button';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { Figure } from './Figure';
import { storiesFor } from './stories';

const TABS = ['Overview', 'Stars', 'Mythology'] as const;
type Tab = (typeof TABS)[number];

export function ConstellationScreen() {
  const t = useTheme();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('Overview');
  const [chosen, setChosen] = useState(0);
  const c = constellationById(id);
  if (!c)
    return <Text style={{ padding: t.space.lg }}>This constellation is not in the catalog.</Text>;

  const stories = storiesFor(id);
  const tabs = stories.length > 0 ? TABS : TABS.filter((label) => label !== 'Mythology');
  const story = tab === 'Mythology' ? stories[chosen] : undefined;
  const lines = story?.figure ? figureLines(story.figure) : c.lines;
  const stars = [...starsIn(c.lines)].sort((a, b) => a.magnitude - b.magnitude);
  const width = Math.min(windowWidth, 640) - 2 * t.space.lg;

  return (
    <ScrollView contentContainerStyle={{ padding: t.space.lg, gap: t.space.md }}>
      <Stack.Screen options={{ title: c.name }} />
      <View accessibilityRole="tablist" style={{ flexDirection: 'row' }}>
        {tabs.map((label) => (
          <Chip
            key={label}
            role="tab"
            label={label}
            selected={label === tab}
            onPress={() => setTab(label)}
          />
        ))}
      </View>
      {tab === 'Mythology' ? (
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {stories.map((s, i) => (
            <Chip
              key={s.culture}
              role="tab"
              label={s.culture}
              selected={i === chosen}
              onPress={() => setChosen(i)}
            />
          ))}
        </View>
      ) : null}
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Star figure of ${story?.figure ? story.title : c.name}`}
      >
        <Figure key={story?.figure ?? c.id} lines={lines} width={width} height={240} />
      </View>

      {tab === 'Overview' ? (
        <GlassPanel>
          <Text size="title">{c.name}</Text>
          <FactRow label="Meaning" value={c.english} />
          {c.id === 'Ple' ? null : <FactRow label="Abbreviation" value={c.id} />}
          <FactRow label="Brightest line star" value={stars[0]?.name ?? ''} />
          <FactRow label="Stars in the figure" value={String(stars.length)} />
        </GlassPanel>
      ) : null}

      {tab === 'Stars' ? (
        <View style={{ gap: t.space.sm }}>
          {stars.map((s) => (
            <Button
              key={s.id}
              variant="quiet"
              label={`${s.name}, magnitude ${s.magnitude.toFixed(1)}`}
              onPress={() => router.push({ pathname: '/star/[id]', params: { id: s.id } })}
            />
          ))}
        </View>
      ) : null}

      {story ? (
        <GlassPanel style={{ gap: t.space.sm }}>
          <Text size="caption" muted>
            {story.culture}. {story.kind}.
          </Text>
          <Text size="title">{story.title}</Text>
          <Text>{story.text}</Text>
          {story.figure ? null : (
            <Text size="caption" muted>
              Shown with the modern lines, because no separate figure is bundled.
            </Text>
          )}
          <LinkRow title="Read the source" detail={story.source.label} url={story.source.url} />
        </GlassPanel>
      ) : null}
      <Text size="caption" muted>
        Figures: Stellarium sky cultures, CC BY-SA.
        {stories.length > 0
          ? ' Stories are short summaries written for Stellar, CC BY-SA 4.0, and are not endorsed by the cultures they describe.'
          : null}
      </Text>
    </ScrollView>
  );
}
