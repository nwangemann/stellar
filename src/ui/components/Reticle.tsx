import { View } from 'react-native';
import { useTheme } from '../useTheme';

export const RETICLE_SIZE = 72;

export function Reticle({ locked }: { locked: boolean }) {
  const t = useTheme();
  return (
    <View
      style={{
        width: RETICLE_SIZE,
        height: RETICLE_SIZE,
        borderRadius: RETICLE_SIZE / 2,
        borderWidth: locked ? 3 : 1.5,
        borderColor: locked ? t.color.accent : t.color.textMuted,
        boxShadow: locked ? `0 0 ${t.glow.radius}px ${t.glow.color}` : undefined,
      }}
    />
  );
}
