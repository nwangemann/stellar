import { BlurMask, Path, Skia, type SkPathBuilder } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type DerivedValue, type SharedValue } from 'react-native-reanimated';
import type { BodyId } from '@/core/astro/bodies';
import { litOutline } from '@/core/astro/phase';
import type { SkyTurn } from '@/core/catalog/types';
import { projectThrough, type Lens } from '@/core/projection/projection';
import type { ZoomAim } from '@/core/projection/zoom';
import { useTheme } from '@/ui/useTheme';

type Props = {
  bodies: readonly BodyId[];
  turn: DerivedValue<SkyTurn>;
  lens: SharedValue<Lens>;
  zoom: { aim: SharedValue<ZoomAim | null>; amount: SharedValue<number> };
};

const SUN_R = 13;
const MOON_R = 13;
const PLANET_R = 4.5;
/** How many times larger a body is drawn when zoomed in on. */
const GROWTH = 3;

function growth(id: BodyId, aim: ZoomAim | null, amount: number) {
  'worklet';
  return aim?.body === id ? 1 + (GROWTH - 1) * amount : 1;
}

function ray(b: SkPathBuilder, x: number, y: number, angle: number, from: number, to: number) {
  'worklet';
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  b.moveTo(x + c * from, y + s * from);
  b.lineTo(x + c * to, y + s * to);
}

/** Marks for the Sun, Moon and planets. They differ in shape, so night vision can tell them apart. */
export function BodyMarks({ bodies, turn, lens, zoom }: Props) {
  const { aim, amount } = zoom;
  const t = useTheme();
  const skin = t.skin;
  const sun = bodies.includes('sun');
  const moon = bodies.includes('moon');
  const planets = useMemo(() => bodies.filter((id) => id !== 'sun' && id !== 'moon'), [bodies]);

  const sunDisc = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = sun ? projectThrough(lens.value, turn.value.bodies.sun) : null;
    if (p) b.addCircle(p.x, p.y, SUN_R * growth('sun', aim.value, amount.value));
    return b.build();
  });
  const sunRays = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = sun ? projectThrough(lens.value, turn.value.bodies.sun) : null;
    if (p) {
      const k = growth('sun', aim.value, amount.value);
      const count = skin === 'glass' ? 4 : skin === 'needlepoint' ? 16 : 8;
      for (let i = 0; i < count; i++) {
        const length = skin === 'glass' ? 18 : i % 2 ? 6 : 10;
        ray(b, p.x, p.y, (i * 2 * Math.PI) / count, (SUN_R + 4) * k, (SUN_R + 4 + length) * k);
      }
    }
    return b.build();
  });
  const moonDisc = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = moon ? projectThrough(lens.value, turn.value.bodies.moon) : null;
    if (p) b.addCircle(p.x, p.y, MOON_R * growth('moon', aim.value, amount.value));
    return b.build();
  });
  const moonLit = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = moon ? projectThrough(lens.value, turn.value.bodies.moon) : null;
    const phase = turn.value.moon;
    const q = projectThrough(lens.value, phase.towardSun);
    if (p && q) {
      const angle = Math.atan2(q.y - p.y, q.x - p.x);
      const r = MOON_R * growth('moon', aim.value, amount.value);
      const c = Math.cos(angle) * r;
      const s = Math.sin(angle) * r;
      let first = true;
      for (const o of litOutline(phase.lit)) {
        const x = p.x + o.x * c - o.y * s;
        const y = p.y + o.x * s + o.y * c;
        if (first) b.moveTo(x, y);
        else b.lineTo(x, y);
        first = false;
      }
      b.close();
    }
    return b.build();
  });
  const planetDiscs = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const now = lens.value;
    for (const id of planets) {
      const p = projectThrough(now, turn.value.bodies[id]);
      if (p) b.addCircle(p.x, p.y, PLANET_R * growth(id, aim.value, amount.value));
    }
    return b.build();
  });
  const planetRings = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const now = lens.value;
    for (const id of planets) {
      const p = projectThrough(now, turn.value.bodies[id]);
      if (!p) continue;
      const k = growth(id, aim.value, amount.value);
      if (id === 'saturn') {
        const tilt = -0.4;
        for (let i = 0; i <= 24; i++) {
          const a = (i / 24) * 2 * Math.PI;
          const ex = Math.cos(a) * 11 * k;
          const ey = Math.sin(a) * 3.5 * k;
          const x = p.x + ex * Math.cos(tilt) - ey * Math.sin(tilt);
          const y = p.y + ex * Math.sin(tilt) + ey * Math.cos(tilt);
          if (i === 0) b.moveTo(x, y);
          else b.lineTo(x, y);
        }
      } else b.addCircle(p.x, p.y, (PLANET_R + 3.5) * k);
    }
    return b.build();
  });

  const glow = skin === 'starship' || skin === 'glass';
  const stroke = skin === 'needlepoint' ? 2.4 : 1.5;
  return (
    <>
      {glow ? (
        <>
          <Path path={sunDisc} color={t.color.sun} style="stroke" strokeWidth={14} opacity={0.7}>
            <BlurMask blur={12} style="normal" />
          </Path>
          <Path path={moonDisc} color={t.glow.color} style="stroke" strokeWidth={6} opacity={0.5}>
            <BlurMask blur={7} style="normal" />
          </Path>
        </>
      ) : null}
      <Path
        path={sunRays}
        color={t.color.sun}
        style="stroke"
        strokeWidth={stroke}
        strokeCap="round"
      />
      <Path path={sunDisc} color={t.color.sun} />
      <Path path={planetDiscs} color={t.color.planet} />
      <Path path={planetRings} color={t.color.planet} style="stroke" strokeWidth={stroke * 0.75} />
      <Path path={moonDisc} color={t.color.moonDark} />
      <Path path={moonLit} color={t.color.moon} />
      <Path path={moonDisc} color={t.color.moon} style="stroke" strokeWidth={0.8} opacity={0.6} />
    </>
  );
}
