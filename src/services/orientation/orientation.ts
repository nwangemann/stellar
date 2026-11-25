import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';
import { Platform } from 'react-native';
import type { Degrees } from '@/core/units';
import { declinationFromHeading, orientationFromMotion } from './convert';
import type { OrientationReading } from './orientation.types';

const INTERVAL_MS = 16;

/**
 * Streams orientations relative to true north, or resolves to null when that is impossible:
 * no sensors, no compass, or no location permission. Never prompts.
 * Readings start only once the declination is known, so none is relative to magnetic north.
 * Call the result to stop.
 */
export async function watchOrientation(
  onReading: (reading: OrientationReading) => void,
): Promise<(() => void) | null> {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const subscriptions: { remove(): void }[] = [];
  let stopped = false;
  const stop = () => {
    stopped = true;
    subscriptions.forEach((s) => s.remove());
  };
  try {
    // Raw device motion needs no permission of its own, so DeviceMotion's is not requested.
    if (!(await Location.getForegroundPermissionsAsync()).granted) return null;
    if (!(await DeviceMotion.isAvailableAsync())) return null;

    let declination: Degrees | null = null;
    let compassAccuracy = 0;
    subscriptions.push(
      await Location.watchHeadingAsync((heading) => {
        compassAccuracy = heading.accuracy;
        declination =
          declinationFromHeading(heading.trueHeading, heading.magHeading) ?? declination;
      }),
    );
    // iOS works out true north only after a location fix, which watching the heading does not request.
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }).catch(() => undefined);

    DeviceMotion.setUpdateInterval(INTERVAL_MS);
    subscriptions.push(
      DeviceMotion.addListener(({ rotation }) => {
        // Android omits rotation until its sensor first fires.
        if (stopped || !rotation || declination === null) return;
        onReading({
          orientation: orientationFromMotion(rotation, declination, platform),
          time: rotation.timestamp * 1000,
          compassAccuracy,
        });
      }),
    );
    return stop;
  } catch {
    stop();
    return null;
  }
}
