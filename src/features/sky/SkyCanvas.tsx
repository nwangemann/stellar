import { BlurMask, Canvas, DashPathEffect, Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import type { SkyObject } from '@/core/catalog/types';
import type { Pose } from '@/core/pose/pose';
import { project, type Viewport } from '@/core/projection/projection';
import { useTheme } from '@/ui/useTheme';
import { BodyMarks } from './BodyMarks';

export type SkyCanvasProps = {
  objects: readonly SkyObject[];
  lines: readonly (readonly [SkyObject, SkyObject])[];
  pose: SharedValue<Pose>;
  view: Viewport;
};

export default function SkyCanvas({ objects, lines, pose, view }: SkyCanvasProps) {
  const t = useTheme();
  const skin = t.skin;
  const points = useMemo(() => objects.filter((o) => o.kind === 'star'), [objects]);
  const bodies = useMemo(() => objects.filter((o) => o.kind === 'body'), [objects]);
  const bright = useMemo(() => points.filter((o) => o.magnitude < 2.5), [points]);
  const faint = useMemo(() => points.filter((o) => o.magnitude >= 2.5), [points]);

  // Pose is an argument: Reanimated only tracks shared values read directly in the derived value.
  const stars = (group: readonly SkyObject[], at: Pose) => {
    'worklet';
    const builder = Skia.PathBuilder.Make();
    for (const o of group) {
      const p = project(o.position, at, view);
      if (p && p.x > -10 && p.y > -10 && p.x < view.width + 10 && p.y < view.height + 10) {
        const r = Math.max(0.8, 3.6 - o.magnitude * 0.5);
        if (skin === 'needlepoint') {
          const s = r * 1.5;
          builder.moveTo(p.x - s, p.y - s);
          builder.lineTo(p.x + s, p.y + s);
          builder.moveTo(p.x + s, p.y - s);
          builder.lineTo(p.x - s, p.y + s);
        } else if (skin === 'glass' && r > 2.2) {
          const s = r * 3;
          builder.moveTo(p.x, p.y - s);
          builder.quadTo(p.x, p.y, p.x + s, p.y);
          builder.quadTo(p.x, p.y, p.x, p.y + s);
          builder.quadTo(p.x, p.y, p.x - s, p.y);
          builder.quadTo(p.x, p.y, p.x, p.y - s);
          builder.addCircle(p.x, p.y, r * 0.8);
        } else {
          builder.addCircle(p.x, p.y, r);
        }
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

  if (skin === 'needlepoint')
    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={linePath} color={t.color.line} style="stroke" strokeWidth={3} strokeCap="round">
          <DashPathEffect intervals={[9, 7]} />
        </Path>
        <Path path={faintPath} color="#3E6B62" style="stroke" strokeWidth={1.4} strokeCap="round" />
        <Path
          path={brightPath}
          color={t.color.star}
          style="stroke"
          strokeWidth={2.8}
          strokeCap="round"
        />
        <BodyMarks bodies={bodies} pose={pose} view={view} />
      </Canvas>
    );
  if (skin === 'starship' || skin === 'glass')
    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={linePath} color={t.color.line} style="stroke" strokeWidth={4} opacity={0.5}>
          <BlurMask blur={5} style="normal" />
        </Path>
        <Path path={linePath} color={t.color.line} style="stroke" strokeWidth={1.2} />
        <Path path={faintPath} color={t.color.star} opacity={0.7} />
        <Path path={brightPath} color={t.glow.color} style="stroke" strokeWidth={8}>
          <BlurMask blur={skin === 'starship' ? 8 : 4} style="normal" />
        </Path>
        <Path path={brightPath} color={t.color.star} />
        <BodyMarks bodies={bodies} pose={pose} view={view} />
      </Canvas>
    );
  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Path path={linePath} color={t.color.line} style="stroke" strokeWidth={1.5} />
      <Path path={faintPath} color={t.color.star} opacity={0.6} />
      <Path path={brightPath} color={t.color.star} />
      <BodyMarks bodies={bodies} pose={pose} view={view} />
    </Canvas>
  );
}
