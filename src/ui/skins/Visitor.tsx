import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { pickVisit, ROLL_MS, shouldVisit, type Visit } from './visits';

const STAY_MS = 6500;
const LEAVE_MS = 600;

// Kept outside the component so leaving the sky screen does not reset the cooldown.
let lastAt = -Infinity;
let lastVisit: Visit | undefined;

/**
 * A rare, random alien for the Starship look. Mount it only while the sky screen is in front.
 * It stays away while `busy`, and a tap sends it off early.
 */
export function Visitor({ busy }: { busy: boolean }) {
  const [visit, setVisit] = useState<Visit | null>(null);

  useEffect(() => {
    if (busy || visit) return;
    const timer = setInterval(() => {
      if (!shouldVisit(Date.now() - lastAt)) return;
      lastAt = Date.now();
      lastVisit = pickVisit(lastVisit);
      setVisit(lastVisit);
    }, ROLL_MS);
    return () => clearInterval(timer);
  }, [busy, visit]);

  return visit ? <Guest visit={visit} busy={busy} onGone={() => setVisit(null)} /> : null;
}

function Guest({ visit, busy, onGone }: { visit: Visit; busy: boolean; onGone: () => void }) {
  const insets = useSafeAreaInsets();
  const [shooed, setShooed] = useState(false);
  const leaving = shooed || busy;
  const out = useSharedValue(1);
  const sway = useSharedValue(-1);

  useEffect(() => {
    // Reanimated skips these when the system asks for reduced motion.
    sway.value = withRepeat(
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [sway]);
  useEffect(() => {
    out.value = leaving
      ? withTiming(1, { duration: LEAVE_MS - 100, easing: Easing.in(Easing.back(1.6)) })
      : withSpring(0, { damping: 10, stiffness: 90 });
    const timer = leaving
      ? setTimeout(onGone, LEAVE_MS)
      : setTimeout(() => setShooed(true), STAY_MS);
    return () => clearTimeout(timer);
    // onGone only clears the visit, so a new identity must not restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving, out]);

  const { entrance } = visit;
  const body = useAnimatedStyle(() => {
    const o = out.value;
    const s = sway.value;
    if (entrance === 'side')
      return {
        transform: [{ translateX: -14 - o * 190 }, { rotate: `${18 + s * 5 - o * 20}deg` }],
      };
    if (entrance === 'ceiling')
      return { transform: [{ translateY: -o * 330 }, { rotate: `${180 + s * 7}deg` }] };
    return {
      transform: [
        { translateX: o * 260 },
        { translateY: -o * 160 + s * 6 },
        { rotate: `${s * 4 + o * 25}deg` },
      ],
    };
  });
  const speech = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - out.value * 3) }));

  const top = insets.top + 70;
  const place: Record<Visit['entrance'], { spot: ViewStyle; bubble: ViewStyle }> = {
    side: { spot: { left: 0, top: top + 70 }, bubble: { left: 104, top: top + 60 } },
    ceiling: { spot: { left: '22%', top }, bubble: { left: '50%', top: top + 20 } },
    saucer: { spot: { right: 34, top }, bubble: { right: 160, top: top + 10 } },
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.layer]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View style={[styles.spot, place[entrance].spot, body]}>
        <Pressable onPress={() => setShooed(true)}>
          {entrance === 'saucer' ? <Saucer visit={visit} /> : <Blob visit={visit} />}
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.bubble, place[entrance].bubble, speech]}>
        <Text style={styles.line}>{visit.line}</Text>
      </Animated.View>
    </View>
  );
}

/** A round, gap-toothed alien with one to three eyes on stalks. */
function Blob({ visit }: { visit: Visit }) {
  return (
    <View style={styles.blob}>
      <View style={styles.eyes}>
        {Array.from({ length: visit.eyes }, (_, i) => (
          <View key={i} style={[styles.stalk, i === 1 && styles.tall]}>
            <View style={[styles.eye, { borderColor: visit.color }]}>
              {/* Each pupil points its own way. */}
              <View style={[styles.pupil, { left: 5 + i * 5, top: 11 - i * 4 }]} />
            </View>
            <View style={[styles.stem, { backgroundColor: visit.color }]} />
          </View>
        ))}
      </View>
      <View style={[styles.body, { backgroundColor: visit.color }]}>
        <View style={styles.mouth}>
          <View style={styles.tooth} />
          <View style={styles.tongue} />
        </View>
      </View>
    </View>
  );
}

function Saucer({ visit }: { visit: Visit }) {
  return (
    <View style={styles.saucer}>
      <View style={styles.passenger}>
        <Blob visit={visit} />
      </View>
      <View style={styles.dome} />
      <View style={styles.hull}>
        {['#FF6EDC', '#FFE66E', '#7CFFCB'].map((c) => (
          <View key={c} style={[styles.lamp, { backgroundColor: c, boxShadow: `0 0 8px ${c}` }]} />
        ))}
      </View>
    </View>
  );
}

const INK = '#14062E';

const styles = StyleSheet.create({
  layer: { pointerEvents: 'box-none', overflow: 'hidden' },
  spot: { position: 'absolute' },
  bubble: {
    position: 'absolute',
    maxWidth: 170,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#FDF6FF',
    borderWidth: 2,
    borderColor: '#FF6EDC',
    pointerEvents: 'none',
  },
  line: { color: INK },
  blob: { width: 100, height: 130, alignItems: 'center', justifyContent: 'flex-end' },
  eyes: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: -8 },
  stalk: { alignItems: 'center' },
  tall: { marginBottom: 8 },
  eye: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
  },
  pupil: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: INK },
  stem: { width: 6, height: 20 },
  body: {
    width: 92,
    height: 80,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 -8px 12px rgba(20,6,46,0.25)',
  },
  mouth: {
    width: 46,
    height: 24,
    marginTop: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: INK,
    overflow: 'hidden',
  },
  tooth: {
    position: 'absolute',
    left: 10,
    top: 0,
    width: 9,
    height: 9,
    backgroundColor: '#FFFFFF',
  },
  tongue: {
    position: 'absolute',
    left: 16,
    top: 14,
    width: 22,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#FF5C8A',
  },
  saucer: { width: 120, height: 118, alignItems: 'center' },
  passenger: { position: 'absolute', top: -10, transform: [{ scale: 0.6 }] },
  dome: {
    position: 'absolute',
    top: 2,
    width: 84,
    height: 90,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(234,251,255,0.7)',
    backgroundColor: 'rgba(143,227,255,0.18)',
  },
  hull: {
    position: 'absolute',
    top: 78,
    width: 120,
    height: 36,
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#5A3FB0',
    borderWidth: 2,
    borderColor: '#B9B4E8',
    boxShadow: '0 8px 22px rgba(124,255,203,0.5)',
  },
  lamp: { width: 12, height: 12, borderRadius: 6 },
});
