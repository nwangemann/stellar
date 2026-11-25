import { useContext, type PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../useTheme';
import { NativeGlass } from './NativeGlass';
import { OnGlass } from './SkinPanel';

type Props = PropsWithChildren<{
  kind: 'primary' | 'quiet' | 'chip' | 'chipOn';
  pressed: boolean;
  disabled?: boolean;
}>;

/** The body of a button or chip in the non-default looks. */
export function SkinSurface({ kind, pressed, disabled = false, children }: Props) {
  const t = useTheme();
  const onGlass = useContext(OnGlass);
  const chip = kind === 'chip' || kind === 'chipOn';
  const on = (kind === 'primary' || kind === 'chipOn') && !disabled;
  const box: ViewStyle = {
    minHeight: t.hit,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: chip ? t.space.md : t.space.lg,
    borderRadius: t.radius.pill,
  };
  if (kind === 'chip' && t.skin !== 'glass')
    return <View style={[box, { opacity: pressed ? 0.6 : 1 }]}>{children}</View>;

  if (t.skin === 'glass' && onGlass)
    return (
      <View
        style={[
          box,
          {
            backgroundColor: on ? 'rgba(225, 238, 255, 0.85)' : 'rgba(255, 255, 255, 0.14)',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.75), inset 0 -1px 1px rgba(255,255,255,0.3)',
            transform: [{ scale: pressed ? 1.04 : 1 }],
          },
        ]}
      >
        {children}
      </View>
    );
  if (t.skin === 'glass')
    return (
      <NativeGlass
        interactive={!disabled}
        clear={!on}
        tint={on ? 'rgba(225, 238, 255, 0.82)' : 'rgba(8, 12, 20, 0.3)'}
        style={[box, { borderRadius: t.hit / 2 }]}
      >
        {children}
      </NativeGlass>
    );

  if (t.skin === 'starship')
    return (
      <View
        style={[
          box,
          {
            borderWidth: 1.5,
            borderColor: on ? '#D8FFF0' : t.color.glassBorder,
            backgroundColor: on ? t.color.accent : 'rgba(40, 20, 96, 0.9)',
            experimental_backgroundImage: on
              ? 'linear-gradient(180deg, #D6FFEE, #7CFFCB 45%, #3BE3B0)'
              : 'linear-gradient(180deg, rgba(150,110,255,0.55), rgba(40,16,90,0.2))',
            boxShadow: disabled
              ? undefined
              : on
                ? `0 0 ${pressed ? 34 : 18}px rgba(124,255,203,0.75)`
                : `0 0 ${pressed ? 24 : 8}px rgba(255,110,220,0.55)`,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        {children}
      </View>
    );

  const felt = on ? t.color.accent : '#E9D3A4';
  return (
    <View
      style={[
        box,
        {
          borderRadius: t.hit / 2,
          backgroundColor: felt,
          boxShadow: pressed ? '0 1px 0 #7A5A3A' : `0 4px 0 ${on ? '#741E1B' : '#B8975C'}`,
          transform: [{ translateY: pressed ? 3 : 0 }],
        },
      ]}
    >
      <View
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          right: 4,
          bottom: 4,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: on ? '#FFD9A8' : '#8A6532',
          borderRadius: t.hit / 2 - 4,
          pointerEvents: 'none',
        }}
      />
      {children}
    </View>
  );
}
