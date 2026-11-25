import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { BackdropProps } from './BackdropCanvas';

const load = () => import('./BackdropCanvas');
const opts = { locateFile: (file: string) => `/${file}` };

/** CanvasKit has to finish loading before any Skia module is evaluated. */
export function Backdrop(props: BackdropProps) {
  return <WithSkiaWeb getComponent={load} opts={opts} componentProps={props} />;
}
