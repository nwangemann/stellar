import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

/** The only module that knows about VisionCamera. Renders nothing without a camera or permission. */
export function CameraBackdrop({ isActive }: { isActive: boolean }) {
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  if (!device || !hasPermission) return null;
  return <Camera style={StyleSheet.absoluteFill} device={device} isActive={isActive} />;
}

export { useCameraPermission };
