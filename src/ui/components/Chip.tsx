import { Pressable } from 'react-native';
import { SkinSurface } from '../skins/SkinSurface';
import { useTheme } from '../useTheme';
import { Text } from './Text';

type Props = { label: string; selected: boolean; onPress: () => void; role?: 'tab' | 'switch' };

export function Chip({ label, selected, onPress, role = 'switch' }: Props) {
  const t = useTheme();
  if (t.skin !== 'default')
    return (
      <Pressable
        accessibilityRole={role}
        accessibilityState={role === 'tab' ? { selected } : { checked: selected }}
        onPress={onPress}
      >
        {({ pressed }) => (
          <SkinSurface kind={selected ? 'chipOn' : 'chip'} pressed={pressed}>
            <Text style={{ color: selected ? t.color.onAccent : t.color.text }}>{label}</Text>
          </SkinSurface>
        )}
      </Pressable>
    );
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
