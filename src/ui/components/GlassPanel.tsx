import { View, type ViewProps } from 'react-native';
import { useTheme } from '../useTheme';

export function GlassPanel({ style, ...rest }: ViewProps) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: t.color.glass,
          borderColor: t.color.glassBorder,
          borderWidth: 1,
          borderRadius: t.radius.lg,
          padding: t.space.lg,
        },
        style,
      ]}
    />
  );
}
