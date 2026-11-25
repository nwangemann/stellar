import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { constellationById, papersFor, planetsFor, starById } from '@/core/catalog/catalog';
import { FindInSky } from '@/features/find/FindButton';
import { detailsRoute } from '@/features/sky/details';
import { Button } from '@/ui/components/Button';
import { FactRow } from '@/ui/components/FactRow';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { LinkRow } from '@/ui/components/LinkRow';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { starFacts } from './facts';

export function StarScreen() {
  const t = useTheme();
  const router = useRouter();
  const { id, at } = useLocalSearchParams<{ id: string; at?: string }>();
  const star = starById(id);
  if (!star) return <Text style={{ padding: t.space.lg }}>This star is not in the catalog.</Text>;
  const constellation = constellationById(star.constellation ?? '');
  const papers = papersFor(id);
  const planets = planetsFor(id);
  const query = encodeURIComponent(star.name);
  return (
    <ScrollView contentContainerStyle={{ padding: t.space.lg, gap: t.space.md }}>
      <Stack.Screen options={{ title: star.name }} />
      <FindInSky target={{ kind: 'star', id, name: star.name }} at={at} />
      {constellation ? (
        <Button
          variant="quiet"
          label={`Constellation: ${constellation.name}`}
          onPress={() =>
            router.push(detailsRoute({ kind: 'constellation', id: constellation.id }, at))
          }
        />
      ) : null}
      <GlassPanel>
        <Text size="title">Star data</Text>
        {starFacts(id).map((f) => (
          <FactRow key={f.label} {...f} />
        ))}
      </GlassPanel>
      <GlassPanel>
        <Text size="title">Planets</Text>
        {planets.length === 0 ? (
          <Text muted>None listed in the bundled NASA Exoplanet Archive data.</Text>
        ) : null}
        {planets.map((p) => (
          <FactRow key={p.name} label={p.name} value={`${p.year}, ${p.method}`} />
        ))}
      </GlassPanel>
      <GlassPanel>
        <Text size="title">Research papers</Text>
        {papers.length === 0 ? <Text muted>No papers are bundled for this star.</Text> : null}
        {papers.map((p) => (
          <LinkRow
            key={p.id}
            title={p.title}
            detail={`${p.authors}, ${p.year}. arXiv:${p.id}`}
            url={`https://arxiv.org/abs/${p.id}`}
          />
        ))}
        <LinkRow
          title="Search arXiv for more"
          url={`https://arxiv.org/search/astro-ph?query=${query}&searchtype=title`}
        />
      </GlassPanel>
      <Text size="caption" muted>
        Star data: HYG 4.4, CC BY-SA 4.0. Planets: NASA Exoplanet Archive. Papers: arXiv, matched by
        title.
      </Text>
    </ScrollView>
  );
}
