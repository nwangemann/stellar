import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { SkyCanvasProps } from './SkyCanvas';

const load = () => import('./SkyCanvas');
const opts = { locateFile: (file: string) => `/${file}` };

/** CanvasKit has to finish loading before any Skia module is evaluated. */
export function SkyLayer(props: SkyCanvasProps) {
  return <WithSkiaWeb getComponent={load} opts={opts} componentProps={props} />;
}
