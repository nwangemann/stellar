import { Pressable, View } from 'react-native';
import { useSettings } from '@/state/settings';
import { Text } from '../components/Text';
import { SKINS, themeForSkin, type SkinId } from '../tokens/tokens';
import { useTheme } from '../useTheme';

const LOOKS: Record<SkinId, { label: string; detail: string }> = {
  default: { label: 'Default', detail: 'Dark, clear and simple' },
  starship: { label: 'Starship', detail: 'Cosmic glow, with a passenger' },
  glass: { label: 'Glass & chrome', detail: 'Liquid, clear and shiny' },
  needlepoint: { label: 'Needlepoint', detail: 'The heavens, hand-stitched' },
};

export function LookPicker() {
  const t = useTheme();
  const { skin, nightMode, set } = useSettings();
  return (
    <View
      accessibilityRole="radiogroup"
      style={{ alignSelf: 'stretch', gap: t.space.sm, marginTop: t.space.md }}
    >
      <Text size="title" accessibilityRole="header">
        Look
      </Text>
      {nightMode ? (
        <Text muted size="caption">
          Night vision is on, so your look will show when you turn it off.
        </Text>
      ) : null}
      {SKINS.map((id) => {
        const selected = id === skin;
        return (
          <Pressable
            key={id}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={`${LOOKS[id].label}. ${LOOKS[id].detail}`}
            onPress={() => set({ skin: id })}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.space.md,
              padding: t.space.md,
              minHeight: t.hit,
              borderRadius: t.radius.lg,
              borderWidth: selected ? 2 : 1,
              borderColor: selected ? t.color.accent : t.color.glassBorder,
              backgroundColor: t.skin === 'glass' ? 'rgba(10, 14, 22, 0.6)' : t.color.glass,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Swatch id={id} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600' }}>{LOOKS[id].label}</Text>
              <Text muted size="caption">
                {LOOKS[id].detail}
              </Text>
            </View>
            <Text style={{ color: t.color.accent }}>{selected ? '✓' : ''}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Shows the look's own colors, or plain theme colors in night vision so it stays red. */
function Swatch({ id }: { id: SkinId }) {
  const t = useTheme();
  const s = t.name === 'night' ? t : themeForSkin(id);
  return (
    <View
      style={{
        width: 52,
        height: 40,
        borderRadius: 12,
        backgroundColor: s.color.sky,
        borderWidth: 2,
        borderStyle: id === 'needlepoint' ? 'dashed' : 'solid',
        borderColor: s.color.accent,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: s.color.star,
          boxShadow: `0 0 10px ${s.glow.color}`,
        }}
      />
    </View>
  );
}
