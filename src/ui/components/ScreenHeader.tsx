import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../useTheme';
import { Button } from './Button';
import { Text } from './Text';

type Props = { title: string; onBack: () => void };

/** Replaces the system header, whose back button ignores the theme on iOS 26. */
export function ScreenHeader({ title, onBack }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.space.md,
        paddingTop: insets.top + t.space.sm,
        paddingBottom: t.space.sm,
        paddingHorizontal: t.space.lg,
        backgroundColor: t.color.sky,
      }}
    >
      <Button variant="quiet" label="Back" onPress={onBack} />
      <Text size="title" accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}
