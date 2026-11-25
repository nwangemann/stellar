import { View } from 'react-native';
import { useTheme } from '../useTheme';
import { Text } from './Text';

export function FactRow({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: t.space.md,
        marginTop: t.space.sm,
      }}
    >
      <Text muted>{label}</Text>
      <Text style={{ flexShrink: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}
