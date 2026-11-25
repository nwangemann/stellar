import type { Target } from '@/core/layers/types';
import type { Pose } from '@/core/pose/pose';
import { lastObserver } from '@/services/location/location';
import { logbook } from '@/services/storage/logbook';

/** `skyTime` is the time the sky showed, or null for the present. */
export async function capture(target: Target, pose: Pose, skyTime: Date | null): Promise<void> {
  const capturedAt = new Date().toISOString();
  await logbook.add({
    id: `${capturedAt}-${target.id}`,
    targetName: target.name,
    target: { kind: target.kind, id: target.id },
    capturedAt,
    ...(skyTime ? { skyTime: skyTime.toISOString() } : {}),
    pose,
    observer: await lastObserver(),
  });
}
