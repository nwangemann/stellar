import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOrbits } from '@/state/orbits';
import { ScreenHeader } from '@/ui/components/ScreenHeader';
import { Backdrop } from '@/ui/skins/Backdrop';
import { useTheme } from '@/ui/useTheme';

export default function RootLayout() {
  const t = useTheme();
  const refreshOrbits = useOrbits((s) => s.refresh);
  useEffect(() => {
    void refreshOrbits();
  }, [refreshOrbits]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={t.statusBar} hidden={t.name === 'night'} />
      <Stack
        screenLayout={({ children, navigation, route }) => (
          <View style={{ flex: 1 }}>
            {/* The sky screen draws its own backdrop, which follows the pose. */}
            {t.skin === 'default' || route.name === 'index' ? null : (
              <Backdrop active={navigation.isFocused()} />
            )}
            {children}
          </View>
        )}
        screenOptions={{
          header: ({ options, navigation }) => (
            <ScreenHeader
              title={options.title ?? ''}
              modal={options.presentation === 'modal'}
              onBack={() => (navigation.canGoBack() ? navigation.goBack() : router.replace('/'))}
            />
          ),
          contentStyle: { backgroundColor: t.color.sky },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Stellar' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, title: 'Welcome' }} />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
        <Stack.Screen name="logbook" options={{ title: 'Logbook' }} />
        <Stack.Screen name="star/[id]" options={{ presentation: 'modal', title: 'Star' }} />
        <Stack.Screen name="body/[id]" options={{ presentation: 'modal', title: 'Details' }} />
        <Stack.Screen
          name="satellite/[id]"
          options={{ presentation: 'modal', title: 'Satellite' }}
        />
        <Stack.Screen
          name="constellation/[id]"
          options={{ presentation: 'modal', title: 'Constellation' }}
        />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
