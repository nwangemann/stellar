import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useCameraPermission } from '@/services/camera/CameraBackdrop';
import { requestLocation } from '@/services/location/location';
import { useSettings } from '@/state/settings';
import { Button } from '@/ui/components/Button';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

export default function Onboarding() {
  const t = useTheme();
  const router = useRouter();
  const set = useSettings((s) => s.set);
  const { requestPermission } = useCameraPermission();

  const finish = (cameraBackdrop: boolean) => {
    set({ onboarded: true, cameraBackdrop });
    router.replace('/');
  };
  const allow = async () => {
    const camera = await requestPermission().catch(() => false);
    await requestLocation().catch(() => false);
    finish(camera);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.space.xl, gap: t.space.lg }}>
      <Text size="display">Stellar</Text>
      <Text muted>
        The camera shows the sky behind the overlay. Your location is saved with each capture. Both
        stay on this phone, and you can skip them.
      </Text>
      <Button label="Allow camera and location" onPress={() => void allow()} />
      <Button variant="quiet" label="Use simulated sky" onPress={() => finish(false)} />
    </View>
  );
}
