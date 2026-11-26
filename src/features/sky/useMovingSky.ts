import { useEffect, useRef } from 'react';
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  type DerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import type { Observer } from '@/core/astro/coordinates';
import type { Vector } from '@/core/astro/vector';
import type { SkyTurn } from '@/core/catalog/types';
import type { Satellite } from '@/core/satellites/orbit';
import { satelliteDirections } from '@/core/satellites/sky';

/** How often satellites are placed. The ISS moves about a tenth of a degree in that time overhead. */
export const SAMPLE_MS = 100;

type Places = Readonly<Record<string, Vector>>;
interface Sample {
  readonly seq: number;
  readonly places: Places;
}

/** Normalised linear blend, which is close to the great circle for the small steps it takes. */
function blend(from: Places, to: Places, t: number): Places {
  'worklet';
  const out: Record<string, Vector> = {};
  for (const id in to) {
    const b = to[id]!;
    const a = from[id] ?? b;
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    const z = a[2] + (b[2] - a[2]) * t;
    const length = Math.hypot(x, y, z) || 1;
    out[id] = [x / length, y / length, z / length];
  }
  return out;
}

/**
 * `turn` with satellites placed every `SAMPLE_MS` on the JS thread and eased between on the UI
 * thread, while `active`. Each sample is for one step ahead, so easing towards it does not lag.
 * `offsetMs` is time travel. Stars do not need this, so keep drawing them from `turn`.
 */
export function useMovingSky(
  turn: SharedValue<SkyTurn>,
  satellites: readonly Satellite[],
  observer: Observer,
  offsetMs: number,
  active: boolean,
): DerivedValue<SkyTurn> {
  const sample = useSharedValue<Sample | null>(null);
  const from = useSharedValue<Places>({});
  const to = useSharedValue<Places>({});
  const shown = useSharedValue<Places | null>(null);
  const seen = useSharedValue(-1);
  const start = useSharedValue(0);
  const seq = useRef(0);

  useEffect(() => {
    if (!active || !satellites.length) return;
    const tick = () => {
      const date = new Date(Date.now() + offsetMs + SAMPLE_MS);
      sample.set({
        seq: seq.current++,
        places: satelliteDirections(satellites, { observer, date }),
      });
    };
    tick();
    const timer = setInterval(tick, SAMPLE_MS);
    return () => clearInterval(timer);
  }, [active, satellites, observer, offsetMs, sample]);

  const frames = useFrameCallback((frame) => {
    'worklet';
    const next = sample.value;
    if (!next) return;
    if (next.seq !== seen.value) {
      // A new run of samples (another time or place) starts from where the last one was shown.
      from.value = shown.value ?? next.places;
      to.value = next.places;
      seen.value = next.seq;
      start.value = frame.timestamp;
    }
    const t = Math.min(1, (frame.timestamp - start.value) / SAMPLE_MS);
    shown.value = blend(from.value, to.value, t);
  }, false);
  useEffect(() => {
    frames.setActive(active);
  }, [frames, active]);

  return useDerivedValue(() => {
    const places = shown.value;
    const base = turn.value;
    return places && active ? { ...base, satellites: places } : base;
  });
}
