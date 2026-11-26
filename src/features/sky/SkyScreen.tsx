import * as Haptics from 'expo-haptics';
import { useIsFocused, useRouter, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import { MARKS } from '@/core/catalog/sky';
import { nextPass } from '@/core/satellites/pass';
import { placeAt, satelliteMarks } from '@/core/satellites/sky';
import type { Target } from '@/core/layers/types';
import { dragAlignment } from '@/core/pose/alignment';
import { applyDrag, facing, INITIAL_POSE, turnStart, type Pose } from '@/core/pose/pose';
import { coverFieldOfView, OPEN_SKY_FOV } from '@/core/projection/fieldOfView';
import type { Viewport } from '@/core/projection/projection';
import { deg, px } from '@/core/units';
import { FindArrow, FindPanel } from '@/features/find/FindArrow';
import { passSummary } from '@/features/satellites/facts';
import { useFocusLock } from '@/features/focus/useFocusLock';
import { capture } from '@/features/logbook/capture';
import {
  CameraBackdrop,
  useCameraAvailable,
  useCameraFocalLength,
} from '@/services/camera/CameraBackdrop';
import { useFind, type Wanted } from '@/state/find';
import { useOrbits } from '@/state/orbits';
import { useSettings } from '@/state/settings';
import { Reticle, RETICLE_SIZE } from '@/ui/components/Reticle';
import { Text } from '@/ui/components/Text';
import { Backdrop } from '@/ui/skins/Backdrop';
import { SkyFrame } from '@/ui/skins/SkyFrame';
import { useTheme } from '@/ui/useTheme';
import { AlignPanel, CompassNotice } from './AlignPanel';
import { Dock, TargetSheet, TopBar } from './Hud';
import { detailsRoute, hasDetails } from './details';
import { pluginFor } from './plugins';
import { SkyLayer } from './SkyLayer';
import { SunWarning } from './SunWarning';
import { TimePanel } from './TimePanel';
import { useDetailsZoom } from './useDetailsZoom';
import { APPLE_ZOOM, SOURCE_SIZE, ZoomSource } from './ZoomSource';
import { useMovingSky } from './useMovingSky';
import { useSensorPose } from './useSensorPose';
import { useSky } from './useSky';

const TURN_MS = 800;

/** Dragging before the lock cancels the request. */
const onDragStart = () => {
  const { wanted, reached, set } = useFind.getState();
  if (wanted && !reached) set({ wanted: null });
};

const tapHaptic = () => {
  if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/** Keeps the first of equal plain values, so memoized children see the same object. */
function useKept<T>(value: T): T {
  const key = JSON.stringify(value);
  return useMemo(() => JSON.parse(key) as T, [key]);
}

export function SkyScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const cameraAvailable = useCameraAvailable();
  const focalLength = useCameraFocalLength();
  const { width, height } = useWindowDimensions();
  const { mode, cameraBackdrop, followPhone, set } = useSettings();
  const wanted = useFind((s) => s.wanted);
  const setFind = useFind((s) => s.set);
  const reached = useFind((s) => s.reached);
  const wantedId = wanted?.aimId ?? null;
  const [message, setMessage] = useState<string | null>(null);
  const [alignOpen, setAlignOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [offsetMs, setOffsetMs] = useState(0);
  const [aligned, setAligned] = useState(false);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const satellites = useOrbits((s) => s.satellites);
  const { sky, turn, realSun, moment, demo } = useSky(offsetMs, satellites);
  // A ref, so the handlers stay stable while the time moves. Null in the present.
  const skyTime = useRef<Date | null>(null);
  useEffect(() => {
    skyTime.current = offsetMs === 0 ? null : moment.date;
  }, [offsetMs, moment]);
  const plugin = pluginFor(mode);
  const moving = useMovingSky(
    turn,
    satellites,
    moment.observer,
    offsetMs,
    focused && plugin.id === 'layers',
  );
  const allMarks = useMemo(() => [...MARKS, ...satelliteMarks(satellites)], [satellites]);
  const cameraOn = cameraBackdrop && cameraAvailable;
  const fov = cameraOn ? coverFieldOfView(width, height, focalLength) : OPEN_SKY_FOV;
  const view: Viewport = useMemo(
    () => ({ width: px(width), height: px(height), horizontalFov: fov }),
    [width, height, fov],
  );
  const marks = useMemo(() => plugin.draw(allMarks), [plugin, allMarks]);
  const lines = useMemo(() => plugin.lines(allMarks), [plugin, allMarks]);
  // A string, so the targets keep their identity until the set changes.
  const targetIds = useMemo(
    () => sky.flatMap((o) => (plugin.selects(o) || o.id === wantedId ? [o.id] : [])).join(' '),
    [plugin, sky, wantedId],
  );
  const targets = useMemo(() => {
    const ids = new Set(targetIds.split(' '));
    return allMarks.filter((m) => ids.has(m.id));
  }, [targetIds, allMarks]);

  const { zoom, zooming, zoomTo } = useDetailsZoom(view);
  const pose = useSharedValue<Pose>(INITIAL_POSE);
  const { tracking, accurate, correction } = useSensorPose(
    pose,
    followPhone && focused && !zooming,
  );
  const aligning = alignOpen && tracking;
  const { lockedId, offsetX, offsetY } = useFocusLock(
    targets,
    moving,
    pose,
    view,
    tapHaptic,
    wantedId,
  );
  const locked = useMemo(() => sky.find((o) => o.id === lockedId) ?? null, [sky, lockedId]);

  useEffect(() => {
    if (focused && !zooming) setFind({ following: tracking });
  }, [focused, zooming, tracking, setFind]);
  // Turns once per request, when the sky is back on screen.
  const turned = useRef<Wanted | null>(null);
  useEffect(() => {
    if (!wanted || !focused || zooming || turned.current === wanted) return;
    turned.current = wanted;
    const { kind } = wanted.target;
    set({
      mode:
        kind === 'constellation' ? 'constellations' : kind === 'satellite' ? 'layers' : 'identify',
    });
    const aim = sky.find((o) => o.id === wanted.aimId);
    if (!aim || tracking || wanted.byArrow) return;
    // Where it will be when the turn ends: satellites keep moving while the sky's moment waits.
    const date = new Date(Date.now() + offsetMs + TURN_MS);
    const to = facing(placeAt(aim, { observer: moment.observer, date }));
    scheduleOnUI(() => {
      'worklet';
      pose.value = turnStart(pose.value, to);
      // Instant with Reduce Motion, as all timings are by default.
      pose.value = withTiming({ ...to }, { duration: TURN_MS, easing: Easing.inOut(Easing.cubic) });
    });
  }, [wanted, focused, zooming, tracking, sky, offsetMs, moment.observer, pose, set]);
  const leading = wanted && !reached && !aligning && (tracking || wanted.byArrow) ? wanted : null;
  const wantedMark = useMemo(
    () => allMarks.find((m) => m.id === wantedId) ?? null,
    [allMarks, wantedId],
  );
  const wantedUp = sky.some((o) => o.id === wantedId && o.position.alt > 0);
  // A satellite that has set: say when it is next visible instead of pointing at the ground.
  const setSatellite =
    leading?.target.kind === 'satellite' && !wantedUp
      ? satellites.find((s) => s.id === leading.target.id)
      : undefined;
  const passNote = useMemo(
    () => (setSatellite ? passSummary(nextPass(setSatellite, moment), moment) : undefined),
    [setSatellite, moment],
  );
  const onCancelFind = useCallback(() => setFind({ wanted: null }), [setFind]);
  // The request lasts as long as its lock, because only it makes a faint star a target.
  useEffect(() => {
    if (!wanted) return;
    if (lockedId === wanted.aimId) setFind({ reached: true });
    else if (useFind.getState().reached) setFind({ wanted: null });
  }, [wanted, lockedId, setFind]);

  const drag = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!zooming && (!tracking || aligning))
        .onStart(() => {
          'worklet';
          if (aligning) return;
          scheduleOnRN(onDragStart);
          // Dragging cannot change roll, so drop any left by the sensors.
          pose.value = { ...pose.value, roll: deg(0) };
        })
        .onChange((e) => {
          'worklet';
          if (aligning)
            correction.value = dragAlignment(
              correction.value,
              pose.value,
              e.changeX,
              e.changeY,
              fov / width,
            );
          else pose.value = applyDrag(pose.value, e.changeX, e.changeY, fov / width);
        })
        .onEnd(() => {
          'worklet';
          if (aligning) scheduleOnRN(setAligned, true);
        }),
    [pose, correction, width, fov, tracking, aligning, zooming],
  );
  const reticleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  const { amount } = zoom;
  // Fades, because the picture cannot zoom with the sky and stops while covered.
  const cameraStyle = useAnimatedStyle(() => ({ opacity: 1 - amount.value }));
  const hidden = zooming ? styles.hidden : null;

  const onMode = useCallback(
    (id: typeof mode) => {
      setFind({ wanted: null });
      set({ mode: id });
    },
    [set, setFind],
  );
  // A satellite's card changes by the second, while the sky's moment moves once a minute.
  const lockedSatellite = locked?.kind === 'satellite';
  const [cardNow, setCardNow] = useState(() => Date.now());
  useEffect(() => {
    if (!lockedSatellite) return;
    const timer = setInterval(() => setCardNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [lockedSatellite]);
  const cardMoment = useMemo(
    () =>
      lockedSatellite ? { observer: moment.observer, date: new Date(cardNow + offsetMs) } : moment,
    [lockedSatellite, moment, cardNow, offsetMs],
  );
  const card = useMemo(
    () => (locked ? plugin.card(locked, cardMoment) : null),
    [plugin, locked, cardMoment],
  );
  // Kept the same across refreshes, so the dock does not render again. The card usually is too.
  const target = useKept(locked ? plugin.target(locked) : null);
  const shownCard = useKept(card);
  const onIdentify = useCallback(
    async (found: Target) => {
      try {
        await capture(found, pose.value, skyTime.current);
        setMessage(`Identified ${found.name}`);
      } catch {
        setMessage('Could not save. Try again.');
      }
    },
    [pose],
  );
  // Kept after closing, because the system asks for the source again on the way back.
  const [source, setSource] = useState<{ href: Href; centered: boolean } | null>(null);
  const openSource = useRef<(() => void) | null>(null);
  const onExplore = useCallback(
    (found: Target) => {
      if (!hasDetails(found)) return;
      const href = detailsRoute(found, skyTime.current?.toISOString());
      // Mounts during the zoom, which is long enough for the link to be ready.
      if (APPLE_ZOOM) setSource({ href, centered: found.kind === 'constellation' });
      zoomTo(found, (zoomed) => {
        if (zoomed && openSource.current) openSource.current();
        else router.push(href);
      });
    },
    [router, zoomTo],
  );
  const onNow = useCallback(() => setOffsetMs(0), []);
  // Aligning compares the sky with the real one, so it needs the present.
  const onAlign = useCallback(() => {
    setOffsetMs(0);
    setTimeOpen(false);
    setAlignOpen((open) => !open);
  }, []);
  // Closing returns to the present, so another time is never shown without its label.
  const onTime = useCallback(() => {
    setOffsetMs(0);
    setAlignOpen(false);
    setTimeOpen((open) => !open);
  }, []);
  const onSearch = useCallback(() => {
    const at = skyTime.current?.toISOString();
    router.push({ pathname: '/search', params: at ? { at } : {} });
  }, [router]);
  const onLogbook = useCallback(() => {
    const at = skyTime.current?.toISOString();
    router.push({ pathname: '/logbook', params: at ? { at } : {} });
  }, [router]);
  const onSettings = useCallback(() => router.push('/settings'), [router]);

  return (
    <View style={[styles.fill, { backgroundColor: t.color.sky }]}>
      {cameraBackdrop ? (
        <Animated.View style={[StyleSheet.absoluteFill, cameraStyle]}>
          <CameraBackdrop isActive={focused} />
        </Animated.View>
      ) : null}
      {t.skin === 'default' ? null : (
        <Backdrop active={focused} pose={pose} overCamera={cameraOn} />
      )}
      <GestureDetector gesture={drag}>
        <View style={styles.fill}>
          <SkyLayer
            marks={marks}
            lines={lines}
            turn={turn}
            moving={moving}
            pose={pose}
            view={view}
            zoom={zoom}
          />
        </View>
      </GestureDetector>

      {t.skin === 'default' || zooming ? null : <SkyFrame skin={t.skin} locked={!!locked} />}
      <Animated.View
        style={[
          styles.reticle,
          { left: width / 2 - RETICLE_SIZE / 2, top: height / 2 - RETICLE_SIZE / 2 },
          reticleStyle,
          hidden,
        ]}
      >
        <Reticle locked={!!locked} />
      </Animated.View>

      {source ? (
        <Animated.View
          style={[
            styles.reticle,
            { left: (width - SOURCE_SIZE) / 2, top: (height - SOURCE_SIZE) / 2 },
            source.centered ? null : reticleStyle,
          ]}
        >
          <ZoomSource href={source.href} open={openSource} />
        </Animated.View>
      ) : null}

      <View
        style={[
          styles.top,
          { top: insets.top + t.space.sm, right: t.space.lg, gap: t.space.sm },
          hidden,
        ]}
      >
        <TopBar
          demo={demo}
          tracking={tracking}
          onSearch={onSearch}
          onTime={onTime}
          onAlign={onAlign}
          onLogbook={onLogbook}
          onSettings={onSettings}
        />
      </View>

      <View
        style={[
          styles.upper,
          {
            top: insets.top + t.space.sm + t.hit + t.space.sm,
            paddingHorizontal: t.space.lg,
            gap: t.space.sm,
          },
          hidden,
        ]}
      >
        {leading ? (
          <FindPanel
            name={leading.target.name}
            up={wantedUp}
            below={passNote}
            onCancel={onCancelFind}
          />
        ) : null}
        {timeOpen ? (
          <TimePanel
            time={moment.date.getTime()}
            offsetMs={offsetMs}
            onOffset={setOffsetMs}
            onNow={onNow}
          />
        ) : null}
        <View style={[styles.warning, { gap: t.space.sm }]}>
          <SunWarning sun={realSun} pose={pose} camera={cameraOn} />
          {tracking && !accurate && !aligned && !aligning ? <CompassNotice /> : null}
        </View>
      </View>

      <View
        style={[
          styles.bottom,
          { bottom: insets.bottom + t.space.lg, paddingHorizontal: t.space.lg, gap: t.space.md },
          hidden,
        ]}
      >
        {shownCard && target && !aligning ? (
          <TargetSheet key={target.id} card={shownCard} target={target} onExplore={onExplore} />
        ) : null}
        {message ? (
          <Text accessibilityLiveRegion="polite" style={styles.center}>
            {message}
          </Text>
        ) : null}
        {aligning ? (
          <AlignPanel
            onReset={() => {
              correction.set(deg(0));
              setAligned(false);
            }}
            onDone={() => setAlignOpen(false)}
          />
        ) : (
          <Dock mode={plugin.id} onMode={onMode} target={target} onIdentify={onIdentify} />
        )}
      </View>
      {leading && wantedMark && wantedUp && !zooming ? (
        <FindArrow mark={wantedMark} turn={moving} pose={pose} view={view} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  hidden: { display: 'none' },
  reticle: { position: 'absolute', pointerEvents: 'none' },
  top: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  upper: { position: 'absolute', left: 0, right: 0, pointerEvents: 'box-none' },
  warning: { pointerEvents: 'none' },
  bottom: { position: 'absolute', left: 0, right: 0, pointerEvents: 'box-none' },
  center: { textAlign: 'center' },
});
