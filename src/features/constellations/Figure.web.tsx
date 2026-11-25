import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { FigureCanvasProps } from './FigureCanvas';

const load = () => import('./FigureCanvas');
const opts = { locateFile: (file: string) => `/${file}` };

/** CanvasKit has to finish loading before any Skia module is evaluated. */
export function Figure(props: FigureCanvasProps) {
  return <WithSkiaWeb getComponent={load} opts={opts} componentProps={props} />;
}
