import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { SkinId } from '../tokens/tokens';

/** Decoration over the sky. It never takes touches and is hidden from screen readers. */
export const SkyFrame = memo(function SkyFrame({
  skin,
  locked,
}: {
  skin: SkinId;
  locked: boolean;
}) {
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.inert]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {skin === 'starship' ? (
        <>
          <View style={[styles.canopy, styles.canopyLeft]} />
          <View style={[styles.canopy, styles.canopyRight]} />
          <Alien visible={locked} />
        </>
      ) : null}
      {skin === 'needlepoint' ? (
        <>
          <View
            style={[
              styles.sampler,
              { top: 6, left: 6, right: 6, bottom: 6, borderColor: '#A8322D' },
            ]}
          />
          <View
            style={[
              styles.sampler,
              { top: 12, left: 12, right: 12, bottom: 12, borderColor: '#3E6B62' },
            ]}
          />
        </>
      ) : null}
    </View>
  );
});

/** Leans in from the edge to see what you found. */
function Alien({ visible }: { visible: boolean }) {
  const out = useSharedValue(1);
  useEffect(() => {
    out.value = withSpring(visible ? 0 : 1, { damping: 11, stiffness: 110 });
  }, [out, visible]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: 10 + out.value * 110 }, { rotate: `${-16 + out.value * 20}deg` }],
  }));
  return (
    <Animated.View style={[styles.alien, style]}>
      <View style={styles.antenna} />
      <View style={styles.bulb} />
      <View style={styles.head}>
        <View style={[styles.eye, { left: 11, transform: [{ rotate: '-18deg' }] }]}>
          <View style={styles.glint} />
        </View>
        <View style={[styles.eye, { right: 11, transform: [{ rotate: '18deg' }] }]}>
          <View style={styles.glint} />
        </View>
        <View style={styles.smile} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inert: { pointerEvents: 'none', overflow: 'hidden' },
  canopy: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    width: 60,
    borderWidth: 5,
    borderColor: '#3A2478',
    boxShadow: '0 0 18px rgba(255,110,220,0.7), inset 0 0 14px rgba(124,255,203,0.5)',
  },
  canopyLeft: { left: -53, borderTopRightRadius: 60, borderBottomRightRadius: 60 },
  canopyRight: { right: -53, borderTopLeftRadius: 60, borderBottomLeftRadius: 60 },
  sampler: { position: 'absolute', borderWidth: 2.5, borderStyle: 'dashed', borderRadius: 46 },
  alien: { position: 'absolute', right: 0, top: '30%', width: 84, height: 116 },
  antenna: {
    position: 'absolute',
    left: 40,
    top: 8,
    width: 4,
    height: 24,
    backgroundColor: '#4FD69C',
  },
  bulb: {
    position: 'absolute',
    left: 35,
    top: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF6EDC',
    boxShadow: '0 0 14px #FF6EDC',
  },
  head: {
    position: 'absolute',
    top: 28,
    width: 84,
    height: 86,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    backgroundColor: '#7CFFCB',
    borderWidth: 2,
    borderColor: '#2FA878',
  },
  eye: {
    position: 'absolute',
    top: 24,
    width: 22,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#14062E',
  },
  glint: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  smile: {
    position: 'absolute',
    left: 30,
    top: 58,
    width: 20,
    height: 11,
    borderBottomWidth: 3,
    borderColor: '#14062E',
    borderRadius: 10,
  },
});
