import { useState } from 'react';
import { Linking, Pressable } from 'react-native';
import { useTheme } from '../useTheme';
import { Text } from './Text';

type Props = { title: string; detail?: string; url: string };

/** Opens a web page outside the app. */
export function LinkRow({ title, detail, url }: Props) {
  const t = useTheme();
  const [failed, setFailed] = useState(false);
  const open = () => {
    Linking.openURL(url).catch(() => setFailed(true));
  };
  return (
    <Pressable
      accessibilityRole="link"
      onPress={open}
      style={{ minHeight: t.hit, justifyContent: 'center', gap: t.space.xs }}
    >
      <Text style={{ color: t.color.accent }}>{title}</Text>
      {detail ? (
        <Text size="caption" muted>
          {detail}
        </Text>
      ) : null}
      {failed ? <Text size="caption">Could not open this link.</Text> : null}
    </Pressable>
  );
}
