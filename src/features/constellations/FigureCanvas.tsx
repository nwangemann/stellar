import { Canvas, DashPathEffect, Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { segments, starsIn, type Constellation } from '@/core/catalog/catalog';
import { fitFigure } from '@/core/projection/figure';
import { useTheme } from '@/ui/useTheme';

export type FigureCanvasProps = {
  lines: Constellation['lines'];
  width: number;
  height: number;
};

export default function FigureCanvas({ lines, width, height }: FigureCanvasProps) {
  const t = useTheme();
  const { starPath, linePath } = useMemo(() => {
    const stars = starsIn(lines);
    const points = fitFigure(
      stars.map((s) => s.position),
      width,
      height,
      t.space.xl,
    );
    const at = new Map(stars.map((s, i) => [s.id, points[i]!]));
    const dots = Skia.PathBuilder.Make();
    const strokes = Skia.PathBuilder.Make();
    for (const s of stars) {
      const p = at.get(s.id)!;
      dots.addCircle(p.x, p.y, Math.max(1.5, 5 - s.magnitude * 0.7));
    }
    for (const [a, b] of segments(lines)) {
      const p = at.get(a);
      const q = at.get(b);
      if (!p || !q) continue;
      strokes.moveTo(p.x, p.y);
      strokes.lineTo(q.x, q.y);
    }
    return { starPath: dots.build(), linePath: strokes.build() };
  }, [lines, width, height, t.space.xl]);
  return (
    <Canvas style={{ width, height }}>
      <Path
        path={linePath}
        color={t.color.line}
        style="stroke"
        strokeWidth={t.skin === 'needlepoint' ? 3 : 1.5}
      >
        {t.skin === 'needlepoint' ? <DashPathEffect intervals={[9, 7]} /> : null}
      </Path>
      <Path path={starPath} color={t.color.star} />
    </Canvas>
  );
}
