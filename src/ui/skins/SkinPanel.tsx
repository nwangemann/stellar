import { createContext } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '../useTheme';
import { NativeGlass } from './NativeGlass';

const RIVETS = [
  { top: 13, left: 13 },
  { top: 10, right: 10 },
  { bottom: 10, left: 10 },
  { bottom: 13, right: 13 },
] as const;

/** iOS glass cannot sample other glass, so controls inside a glass panel draw their own pane. */
export const OnGlass = createContext(false);

export type PanelProps = ViewProps & {
  /** Holds controls only. The glass look drops the panel so each control is its own glass. */
  dock?: boolean;
};

export function SkinPanel({ style, children, dock = false, ...rest }: PanelProps) {
  const t = useTheme();
  const box = { padding: t.space.lg, borderRadius: t.radius.lg } as const;
  if (t.skin === 'glass' && dock)
    return (
      <View {...rest} style={style}>
        {children}
      </View>
    );
  if (t.skin === 'glass')
    return (
      <NativeGlass
        {...rest}
        clear
        tint="rgba(8, 12, 20, 0.5)"
        style={[box, { borderRadius: 30 }, style]}
      >
        <OnGlass value={true}>{children}</OnGlass>
      </NativeGlass>
    );
  if (t.skin === 'starship')
    return (
      <View
        {...rest}
        style={[
          box,
          {
            borderTopLeftRadius: 34,
            borderBottomRightRadius: 34,
            borderWidth: 1.5,
            borderColor: t.color.glassBorder,
            backgroundColor: t.color.glass,
            experimental_backgroundImage:
              'linear-gradient(160deg, rgba(120,80,255,0.38), rgba(20,8,54,0.1) 60%, rgba(255,80,190,0.22))',
            boxShadow: '0 0 22px rgba(124,255,203,0.28), inset 0 0 18px rgba(150,110,255,0.35)',
          },
          style,
        ]}
      >
        {RIVETS.map((at, i) => (
          <View
            key={i}
            style={[
              styles.rivet,
              at,
              { backgroundColor: i % 2 ? '#FF6EDC' : t.color.accent, pointerEvents: 'none' },
            ]}
          />
        ))}
        {children}
      </View>
    );
  return (
    <View
      {...rest}
      style={[
        box,
        {
          backgroundColor: t.color.glass,
          boxShadow: '0 4px 0 #CDB58C, 0 8px 14px rgba(70,45,20,0.28)',
        },
        style,
      ]}
    >
      {dock ? null : (
        <View
          style={[
            styles.stitch,
            { borderColor: t.color.glassBorder, borderRadius: t.radius.lg - 5 },
          ]}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  rivet: { position: 'absolute', width: 5, height: 5, borderRadius: 3 },
  stitch: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderWidth: 2,
    borderStyle: 'dashed',
    pointerEvents: 'none',
  },
});
