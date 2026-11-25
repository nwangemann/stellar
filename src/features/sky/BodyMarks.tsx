import { BlurMask, Path, Skia, type SkPathBuilder } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { litOutline, moonPhase } from '@/core/astro/phase';
import type { SkyObject } from '@/core/catalog/types';
import type { Pose } from '@/core/pose/pose';
import { project, type Viewport } from '@/core/projection/projection';
import { useTheme } from '@/ui/useTheme';

type Props = { bodies: readonly SkyObject[]; pose: SharedValue<Pose>; view: Viewport };

const SUN_R = 13;
const MOON_R = 13;
const PLANET_R = 4.5;

function ray(b: SkPathBuilder, x: number, y: number, angle: number, from: number, to: number) {
  'worklet';
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  b.moveTo(x + c * from, y + s * from);
  b.lineTo(x + c * to, y + s * to);
}

/** Marks for the Sun, Moon and planets. They differ in shape, so night vision can tell them apart. */
export function BodyMarks({ bodies, pose, view }: Props) {
  const t = useTheme();
  const skin = t.skin;
  const sun = useMemo(() => bodies.find((o) => o.id === 'sun'), [bodies]);
  const moon = useMemo(() => bodies.find((o) => o.id === 'moon'), [bodies]);
  const planets = useMemo(() => bodies.filter((o) => o.id !== 'sun' && o.id !== 'moon'), [bodies]);
  const phase = useMemo(() => {
    if (!sun || !moon) return null;
    const { lit, towardSun } = moonPhase(moon.position, sun.position);
    return { towardSun, outline: litOutline(lit) };
  }, [sun, moon]);

  const sunDisc = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = sun ? project(sun.position, pose.value, view) : null;
    if (p) b.addCircle(p.x, p.y, SUN_R);
    return b.build();
  });
  const sunRays = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = sun ? project(sun.position, pose.value, view) : null;
    if (p) {
      const count = skin === 'glass' ? 4 : skin === 'needlepoint' ? 16 : 8;
      for (let i = 0; i < count; i++) {
        const length = skin === 'glass' ? 18 : i % 2 ? 6 : 10;
        ray(b, p.x, p.y, (i * 2 * Math.PI) / count, SUN_R + 4, SUN_R + 4 + length);
      }
    }
    return b.build();
  });
  const moonDisc = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = moon ? project(moon.position, pose.value, view) : null;
    if (p) b.addCircle(p.x, p.y, MOON_R);
    return b.build();
  });
  const moonLit = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    const p = moon ? project(moon.position, pose.value, view) : null;
    const q = phase ? project(phase.towardSun, pose.value, view) : null;
    if (p && q && phase) {
      const angle = Math.atan2(q.y - p.y, q.x - p.x);
      const c = Math.cos(angle) * MOON_R;
      const s = Math.sin(angle) * MOON_R;
      let first = true;
      for (const o of phase.outline) {
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
    for (const o of planets) {
      const p = project(o.position, pose.value, view);
      if (p) b.addCircle(p.x, p.y, PLANET_R);
    }
    return b.build();
  });
  const planetRings = useDerivedValue(() => {
    const b = Skia.PathBuilder.Make();
    for (const o of planets) {
      const p = project(o.position, pose.value, view);
      if (!p) continue;
      if (o.id === 'saturn') {
        const tilt = -0.4;
        for (let i = 0; i <= 24; i++) {
          const a = (i / 24) * 2 * Math.PI;
          const ex = Math.cos(a) * 11;
          const ey = Math.sin(a) * 3.5;
          const x = p.x + ex * Math.cos(tilt) - ey * Math.sin(tilt);
          const y = p.y + ex * Math.sin(tilt) + ey * Math.cos(tilt);
          if (i === 0) b.moveTo(x, y);
          else b.lineTo(x, y);
        }
      } else b.addCircle(p.x, p.y, PLANET_R + 3.5);
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
