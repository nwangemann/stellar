import { Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue, type DerivedValue } from 'react-native-reanimated';
import type { SkyTurn } from '@/core/catalog/types';
import { projectThrough, type Lens } from '@/core/projection/projection';
import { useTheme } from '@/ui/useTheme';

type Props = {
  ids: readonly string[];
  /** The turn with satellites moving, from `useMovingSky`. */
  moving: DerivedValue<SkyTurn>;
  lens: DerivedValue<Lens>;
};

const R = 4;

/** Satellites above the horizon, as small diamonds so they read apart from stars and planets. */
export function SatelliteMarks({ ids, moving, lens }: Props) {
  const t = useTheme();
  const path = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const places = moving.value.satellites;
    const now = lens.value;
    for (const id of ids) {
      const v = places[id];
      if (!v || v[2] <= 0) continue;
      const p = projectThrough(now, v);
      if (!p) continue;
      b.moveTo(p.x, p.y - R);
      b.lineTo(p.x + R, p.y);
      b.lineTo(p.x, p.y + R);
      b.lineTo(p.x - R, p.y);
      b.close();
    }
    return b.build();
  });
  const stroke = t.skin === 'needlepoint' ? 2.4 : 1.5;
  return (
    <>
      <Path path={path} color={t.color.accent} />
      <Path path={path} color={t.color.accent} style="stroke" strokeWidth={stroke} />
    </>
  );
}
