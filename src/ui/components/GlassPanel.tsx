import { View } from 'react-native';
import { SkinPanel, type PanelProps } from '../skins/SkinPanel';
import { useTheme } from '../useTheme';

export function GlassPanel({ style, dock, ...rest }: PanelProps) {
  const t = useTheme();
  if (t.skin !== 'default') return <SkinPanel style={style} dock={dock} {...rest} />;
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
