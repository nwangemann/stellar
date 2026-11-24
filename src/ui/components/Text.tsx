import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '../useTheme';

type Props = TextProps & { size?: 'caption' | 'body' | 'title' | 'display'; muted?: boolean };

export function Text({ size = 'body', muted, style, ...rest }: Props) {
  const t = useTheme();
  const color = muted ? t.color.textMuted : t.color.text;
  return (
    <RNText
      {...rest}
      style={[
        {
          color,
          fontSize: t.type[size],
          fontWeight: size === 'display' || size === 'title' ? '600' : '400',
        },
        style,
      ]}
    />
  );
}
