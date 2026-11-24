import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@/ui/useTheme';

export default function RootLayout() {
  const t = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" hidden={t.name === 'night'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: t.color.sky },
          headerTintColor: t.color.text,
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
