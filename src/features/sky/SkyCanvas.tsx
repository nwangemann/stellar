import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import type { SkyObject } from '@/core/catalog/mockSky';
import type { Pose } from '@/core/pose/pose';
import { project, type Viewport } from '@/core/projection/projection';
import { useTheme } from '@/ui/useTheme';

export type SkyCanvasProps = {
  objects: readonly SkyObject[];
  lines: readonly (readonly [SkyObject, SkyObject])[];
  pose: SharedValue<Pose>;
  view: Viewport;
};

export default function SkyCanvas({ objects, lines, pose, view }: SkyCanvasProps) {
  const t = useTheme();
  const bright = useMemo(() => objects.filter((o) => o.magnitude < 2.5), [objects]);
  const faint = useMemo(() => objects.filter((o) => o.magnitude >= 2.5), [objects]);

  // Pose is an argument: Reanimated only tracks shared values read directly in the derived value.
  const stars = (group: readonly SkyObject[], at: Pose) => {
    'worklet';
    const builder = Skia.PathBuilder.Make();
    for (const o of group) {
      const p = project(o.position, at, view);
      if (p && p.x > -10 && p.y > -10 && p.x < view.width + 10 && p.y < view.height + 10) {
        builder.addCircle(p.x, p.y, Math.max(0.8, 3.6 - o.magnitude * 0.5));
      }
    }
    return builder.build();
  };
  const brightPath = useDerivedValue(() => stars(bright, pose.value));
  const faintPath = useDerivedValue(() => stars(faint, pose.value));
  const linePath = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    for (const pair of lines) {
      const p = project(pair[0].position, pose.value, view);
      const q = project(pair[1].position, pose.value, view);
      if (p && q) {
        builder.moveTo(p.x, p.y);
        builder.lineTo(q.x, q.y);
      }
    }
    return builder.build();
  });

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Path path={linePath} color={t.color.line} style="stroke" strokeWidth={1.5} />
      <Path path={faintPath} color={t.color.star} opacity={0.6} />
      <Path path={brightPath} color={t.color.star} />
    </Canvas>
  );
}
