export function CameraBackdrop(_props: { isActive: boolean }) {
  return null;
}

export const useCameraPermission = () => ({
  hasPermission: false,
  canRequestPermission: false,
  requestPermission: async () => false,
});

export const useCameraAvailable = () => false;
