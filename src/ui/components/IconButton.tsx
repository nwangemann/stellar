import { Pressable, StyleSheet, View } from 'react-native';
import { SkinSurface } from '../skins/SkinSurface';
import { useTheme } from '../useTheme';

type IconId = 'gear' | 'book' | 'compass' | 'clock' | 'search';
type Props = { icon: IconId; label: string; onPress: () => void };

const SIZE = 22;
const LINE = 1.75;

/** A round button for controls that should cover little of the sky. */
export function IconButton({ icon, label, onPress }: Props) {
  const t = useTheme();
  const Art = ART[icon];
  const art = (
    <View style={styles.icon}>
      <Art color={t.color.text} />
    </View>
  );
  if (t.skin !== 'default')
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
        {({ pressed }) => (
          <SkinSurface kind="quiet" round pressed={pressed}>
            {art}
          </SkinSurface>
        )}
      </Pressable>
    );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: t.hit,
        height: t.hit,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.pill,
        borderWidth: 1,
        borderColor: t.color.glassBorder,
        backgroundColor: t.color.glass,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {art}
    </Pressable>
  );
}

// Drawn with views, so no icon package or Skia loading on web is needed.
function Gear({ color }: { color: string }) {
  return (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <View
          key={a}
          style={[
            styles.tooth,
            { backgroundColor: color, transform: [{ rotate: `${a}deg` }, { translateY: -8.5 }] },
          ]}
        />
      ))}
      <View style={[styles.wheel, { borderColor: color }]} />
      <View style={[styles.hub, { borderColor: color }]} />
    </>
  );
}

function Book({ color }: { color: string }) {
  return (
    <View style={[styles.cover, { borderColor: color }]}>
      <View style={[styles.spine, { backgroundColor: color }]} />
      <View style={[styles.title, { backgroundColor: color }]} />
    </View>
  );
}

function Compass({ color }: { color: string }) {
  return (
    <>
      <View style={[styles.dial, { borderColor: color }]} />
      <View style={[styles.needle, { borderBottomColor: color }]} />
      <View style={[styles.hub, { borderColor: color }]} />
    </>
  );
}

function Clock({ color }: { color: string }) {
  return (
    <>
      <View style={[styles.dial, { borderColor: color }]} />
      <View style={[styles.minute, { backgroundColor: color }]} />
      <View style={[styles.hour, { backgroundColor: color }]} />
    </>
  );
}

function Search({ color }: { color: string }) {
  return (
    <>
      <View style={[styles.lens, { borderColor: color }]} />
      <View style={[styles.handle, { backgroundColor: color }]} />
    </>
  );
}

const ART = { gear: Gear, book: Book, compass: Compass, clock: Clock, search: Search };

const styles = StyleSheet.create({
  icon: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  tooth: { position: 'absolute', width: 3.5, height: 4, borderRadius: 1 },
  wheel: { position: 'absolute', width: 15, height: 15, borderRadius: 7.5, borderWidth: LINE },
  hub: { position: 'absolute', width: 6, height: 6, borderRadius: 3, borderWidth: 1.5 },
  dial: { position: 'absolute', width: 21, height: 21, borderRadius: 10.5, borderWidth: LINE },
  minute: { position: 'absolute', left: 10.1, top: 4.5, width: LINE, height: 7.3 },
  hour: { position: 'absolute', left: 10.1, top: 10.1, width: 6, height: LINE },
  lens: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: LINE,
  },
  handle: {
    position: 'absolute',
    left: 12.5,
    top: 16.4,
    width: 8,
    height: LINE,
    transform: [{ rotate: '45deg' }],
  },
  needle: {
    position: 'absolute',
    top: 4,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  cover: {
    width: 17,
    height: 20,
    borderWidth: LINE,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  spine: { position: 'absolute', left: 2.5, top: 0, bottom: 0, width: LINE },
  title: { position: 'absolute', left: 6.5, right: 2, top: 4, height: LINE },
});
