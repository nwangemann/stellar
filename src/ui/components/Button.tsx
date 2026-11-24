import { Pressable } from 'react-native';
import { useTheme } from '../useTheme';
import { Text } from './Text';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'quiet';
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled = false }: Props) {
  const t = useTheme();
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: t.hit,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: t.space.lg,
        borderRadius: t.radius.pill,
        borderWidth: 1,
        borderColor: primary ? t.color.accent : t.color.glassBorder,
        backgroundColor: primary ? t.color.accent : t.color.glass,
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ color: primary ? t.color.onAccent : t.color.text, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}
