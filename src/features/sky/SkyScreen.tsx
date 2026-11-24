import * as Haptics from 'expo-haptics';
import { useIsFocused, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMockSky } from '@/core/catalog/mockSky';
import { applyDrag, INITIAL_POSE, type Pose } from '@/core/pose/pose';
import type { Viewport } from '@/core/projection/projection';
import { deg, px } from '@/core/units';
import { useFocusLock } from '@/features/focus/useFocusLock';
import { capture } from '@/features/logbook/capture';
import { CameraBackdrop } from '@/services/camera/CameraBackdrop';
import { useSettings } from '@/state/settings';
import { Button } from '@/ui/components/Button';
import { GlassPanel } from '@/ui/components/GlassPanel';
import { ModeSwitcher } from '@/ui/components/ModeSwitcher';
import { Reticle, RETICLE_SIZE } from '@/ui/components/Reticle';
import { Sheet } from '@/ui/components/Sheet';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';
import { pluginFor, PLUGINS } from './plugins';
import { SkyLayer } from './SkyLayer';

const SKY = createMockSky();
const FOV = deg(60);

const tapHaptic = () => {
  if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export function SkyScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const { mode, cameraBackdrop, set } = useSettings();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const plugin = pluginFor(mode);
  const view: Viewport = useMemo(
    () => ({ width: px(width), height: px(height), horizontalFov: FOV }),
    [width, height],
  );
  const objects = useMemo(() => plugin.draw(SKY), [plugin]);
  const lines = useMemo(() => plugin.lines(SKY), [plugin]);
  const selectable = useMemo(() => plugin.selectable(SKY), [plugin]);

  const pose = useSharedValue<Pose>(INITIAL_POSE);
  const { locked, offsetX, offsetY } = useFocusLock(selectable, pose, view, tapHaptic);

  const drag = useMemo(
    () =>
      Gesture.Pan().onChange((e) => {
        'worklet';
        pose.value = applyDrag(pose.value, e.changeX, e.changeY, FOV / width);
      }),
    [pose, width],
  );
  const reticleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  const onMode = useCallback((id: typeof mode) => set({ mode: id }), [set]);
  const onCapture = async () => {
    if (!locked) return;
    try {
      await capture(locked, pose.value);
      setMessage(`Saved ${locked.name}`);
    } catch {
      setMessage('Could not save. Try again.');
    }
  };
  const card = locked ? plugin.card(locked) : null;

  return (
    <View style={[styles.fill, { backgroundColor: t.color.sky }]}>
      {cameraBackdrop ? <CameraBackdrop isActive={focused} /> : null}
      <GestureDetector gesture={drag}>
        <View style={styles.fill}>
          <SkyLayer objects={objects} lines={lines} pose={pose} view={view} />
        </View>
      </GestureDetector>

      <Animated.View
        style={[
          styles.reticle,
          { left: width / 2 - RETICLE_SIZE / 2, top: height / 2 - RETICLE_SIZE / 2 },
          reticleStyle,
        ]}
      >
        <Reticle locked={!!locked} />
      </Animated.View>

      <View style={[styles.top, { top: insets.top + t.space.sm, paddingHorizontal: t.space.lg }]}>
        <Button variant="quiet" label="Logbook" onPress={() => router.push('/logbook')} />
        <Text size="caption" muted>
          Mock stars
        </Text>
        <Button variant="quiet" label="Settings" onPress={() => router.push('/settings')} />
      </View>

      <View
        style={[
          styles.bottom,
          { bottom: insets.bottom + t.space.lg, paddingHorizontal: t.space.lg, gap: t.space.md },
        ]}
      >
        {card ? (
          <Sheet key={locked?.id}>
            <Text size="title">{card.title}</Text>
            {card.rows.map((r) => (
              <View key={r.label} style={styles.row}>
                <Text muted>{r.label}</Text>
                <Text>{r.value}</Text>
              </View>
            ))}
          </Sheet>
        ) : null}
        {message ? (
          <Text accessibilityLiveRegion="polite" style={styles.center}>
            {message}
          </Text>
        ) : null}
        <GlassPanel style={{ padding: t.space.sm, gap: t.space.sm }}>
          <ModeSwitcher modes={PLUGINS} value={mode} onChange={onMode} />
          <Button label="Capture" disabled={!locked} onPress={() => void onCapture()} />
        </GlassPanel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  reticle: { position: 'absolute', pointerEvents: 'none' },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  bottom: { position: 'absolute', left: 0, right: 0, pointerEvents: 'box-none' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  center: { textAlign: 'center' },
});
