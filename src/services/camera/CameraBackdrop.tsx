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

/** 35mm equivalent in millimetres on iOS 26 and later; the real length on Android. */
export function useCameraFocalLength(): number | undefined {
  return useCameraDevice('back')?.focalLength;
}

/** Whether the backdrop has a picture to show: a camera exists and is allowed. */
export function useCameraAvailable() {
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  return !!device && hasPermission;
}
