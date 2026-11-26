import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { aimAt } from '@/core/catalog/aim';
import { search, type SearchResult } from '@/core/catalog/search';
import { createSky } from '@/core/catalog/sky';
import { FindButton } from '@/features/find/FindButton';
import { detailsRoute } from '@/features/sky/details';
import { timeLabel } from '@/features/sky/timeLabel';
import { useMoment } from '@/features/sky/useMoment';
import { useOrbits } from '@/state/orbits';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

const KINDS: Record<SearchResult['kind'], string> = {
  star: 'Star',
  body: 'Solar system',
  constellation: 'Constellation',
  satellite: 'Satellite',
};

export function SearchScreen() {
  const t = useTheme();
  const router = useRouter();
  const { at } = useLocalSearchParams<{ at?: string }>();
  const { moment: now, demo } = useMoment();
  const [query, setQuery] = useState('');
  const satellites = useOrbits((s) => s.satellites);
  const results = useMemo(() => search(query, 30, satellites), [query, satellites]);
  const sky = useMemo(
    () => createSky(now.observer, at ? new Date(at) : now.date, satellites),
    [now, at, satellites],
  );
  const notes = [
    ...(at ? [`Sky shown for ${timeLabel(new Date(at))}.`] : []),
    ...(demo ? ['For the demo location.'] : []),
  ].join(' ');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.skin === 'default' ? t.color.sky : 'transparent',
      }}
    >
      <View style={{ padding: t.space.lg, gap: t.space.sm }}>
        <GlassPanel style={{ paddingVertical: 0 }}>
          <TextInput
            accessibilityLabel="Search the sky"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance={t.statusBar === 'dark' ? 'light' : 'dark'}
            placeholder="Star, planet, constellation or satellite"
            placeholderTextColor={t.color.textMuted}
            returnKeyType="search"
            selectionColor={t.color.accent}
            value={query}
            onChangeText={setQuery}
            style={{
              minHeight: t.hit,
              color: t.color.text,
              fontFamily: t.font,
              fontSize: t.type.body,
            }}
          />
        </GlassPanel>
        {notes ? (
          <Text size="caption" muted>
            {notes}
          </Text>
        ) : null}
      </View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: t.space.lg,
          paddingBottom: t.space.xxl,
          gap: t.space.sm,
        }}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={results}
        keyExtractor={(r) => `${r.kind} ${r.id}`}
        ListEmptyComponent={query.trim() ? <Text muted>Nothing found.</Text> : undefined}
        renderItem={({ item }) => {
          const aim = aimAt(item, sky);
          const detail = [
            KINDS[item.kind],
            ...(item.detail ? [item.detail] : []),
            ...(aim ? [] : ['Below the horizon']),
          ].join(' · ');
          return (
            <GlassPanel
              style={{
                paddingVertical: t.space.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.space.md,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${detail}`}
                onPress={() => router.push(detailsRoute(item, at))}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: t.hit,
                  justifyContent: 'center',
                  opacity: pressed && t.skin !== 'glass' ? 0.7 : 1,
                })}
              >
                <Text>{item.name}</Text>
                <Text size="caption" muted>
                  {detail}
                </Text>
              </Pressable>
              <FindButton target={item} aim={aim} />
            </GlassPanel>
          );
        }}
      />
    </View>
  );
}
