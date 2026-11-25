import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, View, type ViewProps } from 'react-native';

const supported = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

/** Follows the system Reduce Transparency setting. */
function useReduceTransparency() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let live = true;
    void AccessibilityInfo.isReduceTransparencyEnabled().then((v) => {
      if (live) setReduce(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return reduce;
}

type Props = ViewProps & { tint?: string; interactive?: boolean; clear?: boolean };

/** Apple's Liquid Glass where it exists, a drawn pane elsewhere, solid when asked for. */
export function NativeGlass({ tint, interactive = false, clear = false, style, ...rest }: Props) {
  const reduce = useReduceTransparency();
  if (supported && !reduce)
    return (
      <GlassView
        // Interactivity is read once, when the native view is created.
        key={String(interactive)}
        {...rest}
        glassEffectStyle={clear ? 'clear' : 'regular'}
        colorScheme="dark"
        isInteractive={interactive}
        tintColor={tint}
        style={style}
      />
    );
  return (
    <View
      {...rest}
      style={[
        reduce
          ? { backgroundColor: tint ?? '#252B36' }
          : {
              backgroundColor: tint ?? 'rgba(40, 48, 62, 0.55)',
              boxShadow:
                'inset 0 1px 1px rgba(255,255,255,0.65), inset 0 -8px 16px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.35)',
            },
        style,
      ]}
    />
  );
}
