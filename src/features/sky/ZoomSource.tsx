import { Link, type Href } from 'expo-router';
import { useEffect, type RefObject } from 'react';
import { Platform, View } from 'react-native';

export const SOURCE_SIZE = 24;

/** Apple's zoom transition needs iOS 18. Elsewhere the sheet opens as usual. */
export const APPLE_ZOOM = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 18;

type Open = RefObject<(() => void) | null>;

/**
 * The spot that details grow from and return to. Only a `Link` can start the system's zoom, so
 * this hands its press handler to `open`. Keep it mounted until the details have closed.
 */
export function ZoomSource({ href, open }: { href: Href; open: Open }) {
  return (
    <Link href={href} push asChild>
      <Link.AppleZoom>
        <Spot open={open} />
      </Link.AppleZoom>
    </Link>
  );
}

/** `onPress` comes from the link. */
function Spot({ open, onPress }: { open: Open; onPress?: () => void }) {
  useEffect(() => {
    open.current = onPress ?? null;
  }, [open, onPress]);
  return (
    <View
      collapsable={false}
      accessibilityElementsHidden
      style={{ width: SOURCE_SIZE, height: SOURCE_SIZE, borderRadius: SOURCE_SIZE / 2 }}
    />
  );
}
