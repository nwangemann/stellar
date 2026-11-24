import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScreenHeader } from '@/ui/components/ScreenHeader';
import { useTheme } from '@/ui/useTheme';

export default function RootLayout() {
  const t = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" hidden={t.name === 'night'} />
      <Stack
        screenOptions={{
          header: ({ options, navigation }) => (
            <ScreenHeader
              title={options.title ?? ''}
              onBack={() => (navigation.canGoBack() ? navigation.goBack() : router.replace('/'))}
            />
          ),
          contentStyle: { backgroundColor: t.color.sky },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Stellar' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, title: 'Welcome' }} />
        <Stack.Screen name="logbook" options={{ title: 'Logbook' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
