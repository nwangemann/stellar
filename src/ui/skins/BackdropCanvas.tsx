import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  useDerivedValue,
  useFrameCallback,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import type { Pose } from '@/core/pose/pose';
import { useTheme } from '../useTheme';
import { SHADERS } from './shaders';

export type BackdropProps = {
  /** Animates only while true, so covered screens cost nothing. */
  active: boolean;
  pose?: SharedValue<Pose>;
  overCamera?: boolean;
};

// How much of the art stays over the camera. Glass shows only the camera through its panels.
const OVER_CAMERA = { default: 0, starship: 0.4, glass: 0, needlepoint: 0.6 } as const;

export default function BackdropCanvas({ active, pose, overCamera = false }: BackdropProps) {
  const t = useTheme();
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const shader = SHADERS[t.skin];
  const effect = useMemo(() => (shader ? Skia.RuntimeEffect.Make(shader.source) : null), [shader]);
  const animated = !!shader?.animated;
  // Soft art is drawn at half size and scaled up, which is a quarter of the pixels.
  const k = animated ? 2 : 1;
  const w = Math.ceil(width / k);
  const h = Math.ceil(height / k);

  const time = useSharedValue(0);
  const clock = useFrameCallback((frame) => {
    'worklet';
    time.value += (frame.timeSincePreviousFrame ?? 0) / 1000;
  }, false);
  const running = active && animated && !reduced;
  useEffect(() => {
    clock.setActive(running);
    return () => clock.setActive(false);
  }, [clock, running]);

  const decor = pose ? 0 : 1;
  const uniforms = useDerivedValue(() => {
    const at = pose ? pose.value : null;
    const az = ((at?.az ?? 0) * Math.PI) / 180;
    const alt = ((at?.alt ?? 0) * Math.PI) / 180;
    return { res: [w, h], time: time.value, look: [Math.sin(az), Math.cos(az), alt], decor };
  });

  const opacity = overCamera ? OVER_CAMERA[t.skin] : 1;
  if (!effect || opacity === 0) return null;
  return (
    <Canvas
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        opacity,
        pointerEvents: 'none',
        transform: [{ scale: k }],
        transformOrigin: 'top left',
      }}
    >
      <Fill>
        <Shader source={effect} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
