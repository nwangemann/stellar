import { Pressable } from 'react-native';
import { useTheme } from '../useTheme';
import { Text } from './Text';

type Props = { label: string; selected: boolean; onPress: () => void; role?: 'tab' | 'switch' };

export function Chip({ label, selected, onPress, role = 'switch' }: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={role === 'tab' ? { selected } : { checked: selected }}
      onPress={onPress}
      style={{
        minHeight: t.hit,
        justifyContent: 'center',
        paddingHorizontal: t.space.md,
        borderRadius: t.radius.pill,
        backgroundColor: selected ? t.color.accent : 'transparent',
      }}
    >
      <Text style={{ color: selected ? t.color.onAccent : t.color.text }}>{label}</Text>
    </Pressable>
  );
}
