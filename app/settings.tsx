import { useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { useCameraPermission } from '@/services/camera/CameraBackdrop';
import { useLocationPermission } from '@/services/location/location';
import { useSettings } from '@/state/settings';
import { Chip } from '@/ui/components/Chip';
import { LookPicker } from '@/ui/skins/LookPicker';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

export default function Settings() {
  const t = useTheme();
  const { nightMode, cameraBackdrop, followPhone, set } = useSettings();
  const { hasPermission, requestPermission } = useCameraPermission();
  const toggleCamera = async () => {
    if (cameraBackdrop) return set({ cameraBackdrop: false });
    set({ cameraBackdrop: hasPermission || (await requestPermission()) });
  };
  const [located, requestLocation] = useLocationPermission();
  const [denied, setDenied] = useState(false);
  const following = followPhone && located === true;
  const toggleFollow = async () => {
    if (following) return set({ followPhone: false });
    set({ followPhone: true });
    setDenied(!(located || (await requestLocation().catch(() => false))));
  };
  return (
    <ScrollView
      contentContainerStyle={{ padding: t.space.lg, gap: t.space.md, alignItems: 'flex-start' }}
    >
      <Chip
        label="Night vision (red)"
        selected={nightMode}
        onPress={() => set({ nightMode: !nightMode })}
      />
      <Chip label="Camera backdrop" selected={cameraBackdrop} onPress={() => void toggleCamera()} />
      {Platform.OS === 'web' ? null : (
        <Chip label="Follow the phone" selected={following} onPress={() => void toggleFollow()} />
      )}
      <Text muted size="caption">
        {denied && !following
          ? 'Following the phone needs location, to find true north. Allow it in the system settings.'
          : 'When the sky is not following the phone, drag to look around.'}
      </Text>
      <LookPicker />
    </ScrollView>
  );
}
