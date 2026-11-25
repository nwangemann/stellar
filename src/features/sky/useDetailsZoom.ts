import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Easing, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { BodyId } from '@/core/astro/bodies';
import { raDecVector } from '@/core/astro/vector';
import { constellationById, starById, starsIn } from '@/core/catalog/catalog';
import type { Target } from '@/core/layers/types';
import type { Viewport } from '@/core/projection/projection';
import { bodyZoom, zoomFor, type ZoomAim } from '@/core/projection/zoom';

const IN_MS = 600;
/** The details open before the zoom ends, so the two run together. */
const OPEN_MS = 400;
const OUT_MS = 500;

function aimFor({ kind, id }: Target, view: Viewport): ZoomAim | null {
  if (kind === 'body') return bodyZoom(id as BodyId);
  const star = kind === 'star' ? starById(id) : undefined;
  const stars = star ? [star] : starsIn(constellationById(id)?.lines ?? []);
  return stars.length
    ? zoomFor(
        stars.map((s) => raDecVector(s.position)),
        view,
      )
    : null;
}

/**
 * Zooms the sky in on a target before its details open, and out when the sky is back in focus.
 * `zooming` lasts from the tap until the view is back to normal; the pose should be held meanwhile.
 */
export function useDetailsZoom(view: Viewport) {
  const reduced = useReducedMotion();
  const aim = useSharedValue<ZoomAim | null>(null);
  const amount = useSharedValue(0);
  const [zooming, setZooming] = useState(false);
  const phase = useRef<'idle' | 'in' | 'covered'>('idle');
  const onOut = useCallback(() => {
    if (phase.current === 'idle') setZooming(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (phase.current !== 'covered') return;
      phase.current = 'idle';
      amount.set(
        withTiming(0, { duration: OUT_MS, easing: Easing.inOut(Easing.cubic) }, () => {
          'worklet';
          scheduleOnRN(onOut);
        }),
      );
    }, [amount, onOut]),
  );

  /** Zooms in on the target, then calls `then`, which should open its details, with whether it zoomed. */
  const zoomTo = useCallback(
    (target: Target, then: (zoomed: boolean) => void) => {
      if (phase.current !== 'idle') return;
      const to = reduced ? null : aimFor(target, view);
      if (!to) return then(false);
      phase.current = 'in';
      setZooming(true);
      aim.set(to);
      amount.set(withTiming(1, { duration: IN_MS, easing: Easing.in(Easing.cubic) }));
      setTimeout(() => {
        phase.current = 'covered';
        then(true);
      }, OPEN_MS);
    },
    [reduced, view, aim, amount],
  );

  const zoom = useMemo(() => ({ aim, amount }), [aim, amount]);
  return { zoom, zooming, zoomTo };
}
