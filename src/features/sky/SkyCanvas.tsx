import { BlurMask, Canvas, DashPathEffect, Path, Skia } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import type { SkyMark, SkyTurn, StarMark } from '@/core/catalog/types';
import type { Pose } from '@/core/pose/pose';
import { projectThrough, starLens, type Lens, type Viewport } from '@/core/projection/projection';
import { zoomedLens, type ZoomAim } from '@/core/projection/zoom';
import type { SkinId } from '@/ui/tokens/tokens';
import { useTheme } from '@/ui/useTheme';
import { BodyMarks } from './BodyMarks';

export type SkyCanvasProps = {
  marks: readonly SkyMark[];
  lines: readonly (readonly [SkyMark, SkyMark])[];
  turn: SharedValue<SkyTurn>;
  pose: SharedValue<Pose>;
  view: Viewport;
  zoom: { aim: SharedValue<ZoomAim | null>; amount: SharedValue<number> };
};

/** Shared values are read by the caller: Reanimated only tracks reads directly in the derived value. */
function starPath(
  group: readonly StarMark[],
  turn: SkyTurn,
  horizonLens: Lens,
  view: Viewport,
  skin: SkinId,
) {
  'worklet';
  const lens = starLens(horizonLens, turn);
  const builder = Skia.PathBuilder.Make();
  for (const o of group) {
    const p = projectThrough(lens, o.direction);
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
}

/** A refresh only changes `turn`, so it must not render this again: rebuilding the worklets is slow. */
export default memo(SkyCanvas);

function SkyCanvas({ marks, lines, turn, pose, view, zoom }: SkyCanvasProps) {
  const t = useTheme();
  const skin = t.skin;
  const points = useMemo(() => marks.filter((m) => m.kind === 'star'), [marks]);
  const bodies = useMemo(() => marks.flatMap((m) => (m.kind === 'body' ? [m.id] : [])), [marks]);
  const segments = useMemo(
    () =>
      lines.flatMap(([a, b]) =>
        a.kind === 'star' && b.kind === 'star' ? [[a.direction, b.direction] as const] : [],
      ),
    [lines],
  );
  const bright = useMemo(() => points.filter((o) => o.magnitude < 2.5), [points]);
  const faint = useMemo(() => points.filter((o) => o.magnitude >= 2.5), [points]);

  const { aim, amount } = zoom;
  const lens = useDerivedValue(() =>
    zoomedLens(pose.value, view, turn.value, aim.value, amount.value),
  );
  const brightPath = useDerivedValue(() => starPath(bright, turn.value, lens.value, view, skin));
  const faintPath = useDerivedValue(() => starPath(faint, turn.value, lens.value, view, skin));
  const linePath = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    const stars = starLens(lens.value, turn.value);
    for (const ends of segments) {
      const p = projectThrough(stars, ends[0]);
      const q = projectThrough(stars, ends[1]);
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
        <BodyMarks bodies={bodies} turn={turn} lens={lens} zoom={zoom} />
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
        <BodyMarks bodies={bodies} turn={turn} lens={lens} zoom={zoom} />
      </Canvas>
    );
  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Path path={linePath} color={t.color.line} style="stroke" strokeWidth={1.5} />
      <Path path={faintPath} color={t.color.star} opacity={0.6} />
      <Path path={brightPath} color={t.color.star} />
      <BodyMarks bodies={bodies} turn={turn} lens={lens} zoom={zoom} />
    </Canvas>
  );
}
