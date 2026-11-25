import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { SkinId } from '../tokens/tokens';
import { useTheme } from '../useTheme';
import { NativeGlass } from './NativeGlass';

type Props = { skin: SkinId; size: number; locked: boolean };

export function SkinReticle({ skin, size, locked }: Props) {
  if (skin === 'glass') return <Lens size={size} locked={locked} />;
  if (skin === 'starship') return <Scanner size={size} locked={locked} />;
  return <Hoop size={size} locked={locked} />;
}

type ArtProps = Omit<Props, 'skin'>;

/** Clear glass that bends the stars behind it. */
function Lens({ size, locked }: ArtProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        boxShadow: locked ? '0 0 22px rgba(255,255,255,0.75)' : '0 4px 14px rgba(0,0,0,0.4)',
      }}
    >
      <NativeGlass clear style={{ width: size, height: size, borderRadius: size / 2 }} />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: locked ? 4 : 2,
          borderColor: '#E8EEF7',
          borderTopColor: '#FFFFFF',
          borderBottomColor: '#7C899C',
          borderRightColor: '#AEB9C9',
        }}
      />
    </View>
  );
}

function Scanner({ size, locked }: ArtProps) {
  const t = useTheme();
  const turn = useSharedValue(0);
  useEffect(() => {
    turn.value = 0;
    // Reanimated skips this when the system asks for reduced motion.
    turn.value = withRepeat(
      withTiming(360, { duration: locked ? 1600 : 7000, easing: Easing.linear }),
      -1,
    );
  }, [locked, turn]);
  const outer = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value}deg` }] }));
  const inner = useAnimatedStyle(() => ({ transform: [{ rotate: `${-turn.value}deg` }] }));
  const color = locked ? t.color.accent : '#FF6EDC';
  const ring = (d: number, width: number) => ({
    position: 'absolute' as const,
    left: (size - d) / 2,
    top: (size - d) / 2,
    width: d,
    height: d,
    borderRadius: d / 2,
    borderWidth: width,
    borderColor: color,
  });
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={[
          ring(size + 14, 3),
          { borderLeftColor: 'transparent', borderRightColor: 'transparent' },
          outer,
        ]}
      />
      <View
        style={[
          ring(size, 1),
          {
            boxShadow: `0 0 ${locked ? 28 : 12}px ${color}, inset 0 0 ${locked ? 18 : 8}px ${color}`,
          },
        ]}
      />
      <Animated.View
        style={[
          ring(size - 18, 2),
          { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
          inner,
        ]}
      />
    </View>
  );
}

/** A wooden embroidery hoop with its brass screw. */
function Hoop({ size, locked }: ArtProps) {
  const d = size + 18;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          left: d / 2 - 18,
          top: -22,
          width: 18,
          height: 14,
          borderRadius: 4,
          backgroundColor: locked ? '#E8B23C' : '#B98A3A',
          borderWidth: 1.5,
          borderColor: '#6E4B18',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: -9,
          top: -9,
          width: d,
          height: d,
          borderRadius: d / 2,
          borderWidth: 8,
          borderColor: locked ? '#D08A3E' : '#B88654',
          boxShadow: locked
            ? '0 0 0 2px #6E4220, 0 0 18px #D9992B, inset 0 0 0 2px #7A4A24'
            : '0 0 0 1.5px #7A4F2A, 0 5px 8px rgba(60,35,15,0.35), inset 0 0 0 1.5px #7A4F2A',
        }}
      />
    </View>
  );
}
