import type { OrientationReading } from './orientation.types';

/** The web preview has no sensors adapter; dragging is the pose source. */
export async function watchOrientation(
  _onReading: (reading: OrientationReading) => void,
): Promise<(() => void) | null> {
  return null;
}
