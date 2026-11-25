import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { logbook } from '@/services/storage/logbook';
import type { Capture } from '@/services/storage/logbook.types';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

export function LogbookScreen() {
  const t = useTheme();
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
      renderItem={({ item }) => (
        <GlassPanel>
          <Text size="title">{item.targetName}</Text>
          <Text muted>{new Date(item.capturedAt).toLocaleString()}</Text>
          <Text muted>
            Pointing {item.pose.az.toFixed(0)}° az, {item.pose.alt.toFixed(0)}° alt
          </Text>
        </GlassPanel>
      )}
    />
  );
}
