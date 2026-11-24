import { View } from 'react-native';
import { useCameraPermission } from '@/services/camera/CameraBackdrop';
import { useSettings } from '@/state/settings';
import { Chip } from '@/ui/components/Chip';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

export default function Settings() {
  const t = useTheme();
  const { nightMode, cameraBackdrop, set } = useSettings();
  const { hasPermission, requestPermission } = useCameraPermission();
  const toggleCamera = async () => {
    if (cameraBackdrop) return set({ cameraBackdrop: false });
    set({ cameraBackdrop: hasPermission || (await requestPermission()) });
  };
  return (
    <View style={{ flex: 1, padding: t.space.lg, gap: t.space.md, alignItems: 'flex-start' }}>
      <Chip
        label="Night vision (red)"
        selected={nightMode}
        onPress={() => set({ nightMode: !nightMode })}
      />
      <Chip label="Camera backdrop" selected={cameraBackdrop} onPress={() => void toggleCamera()} />
      <Text muted size="caption">
        Drag to look around. Live sensor tracking arrives with the core engine.
      </Text>
    </View>
  );
}
