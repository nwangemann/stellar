import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { detailsRoute, hasDetails } from '@/features/sky/details';
import { logbook } from '@/services/storage/logbook';
import type { Capture } from '@/services/storage/logbook.types';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

export function LogbookScreen() {
  const t = useTheme();
  const router = useRouter();
  const { at } = useLocalSearchParams<{ at?: string }>();
  const [items, setItems] = useState<Capture[]>([]);
  const [failed, setFailed] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let live = true;
      logbook
        .list()
        .then((list) => {
          if (live) setItems(list);
        })
        .catch(() => {
          if (live) setFailed(true);
        });
      return () => {
        live = false;
      };
    }, []),
  );
  return (
    <FlatList
      style={{ backgroundColor: t.skin === 'default' ? t.color.sky : 'transparent' }}
      contentContainerStyle={{ padding: t.space.lg, gap: t.space.md }}
      data={items}
      keyExtractor={(c) => c.id}
      ListEmptyComponent={
        <Text muted>
          {failed
            ? 'Could not open the logbook.'
            : 'Nothing identified yet. Lock on to a star and tap Identify.'}
        </Text>
      }
      renderItem={({ item }) => {
        const { target } = item;
        const panel = (
          <GlassPanel>
            <Text size="title">{item.targetName}</Text>
            <Text muted>{new Date(item.capturedAt).toLocaleString()}</Text>
            {item.skyTime ? (
              <Text muted>Sky shown for {new Date(item.skyTime).toLocaleString()}</Text>
            ) : null}
            <Text muted>
              Pointing {item.pose.az.toFixed(0)}° az, {item.pose.alt.toFixed(0)}° alt
            </Text>
          </GlassPanel>
        );
        if (!target || !hasDetails(target)) return panel;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Opens details"
            onPress={() => router.push(detailsRoute(target, at))}
            style={({ pressed }) => ({ opacity: pressed && t.skin !== 'glass' ? 0.7 : 1 })}
          >
            {panel}
          </Pressable>
        );
      }}
    />
  );
}
