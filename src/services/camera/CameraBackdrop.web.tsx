export function CameraBackdrop(_props: { isActive: boolean }) {
  return null;
}

export const useCameraPermission = () => ({
  hasPermission: false,
  canRequestPermission: false,
  requestPermission: async () => false,
});

export const useCameraFocalLength = (): number | undefined => undefined;

export const useCameraAvailable = () => false;
