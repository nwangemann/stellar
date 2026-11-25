import type { Target } from '@/core/layers/types';
import type { Pose } from '@/core/pose/pose';
import { lastObserver } from '@/services/location/location';
import { logbook } from '@/services/storage/logbook';

export async function capture(target: Target, pose: Pose): Promise<void> {
  const capturedAt = new Date().toISOString();
  await logbook.add({
    id: `${capturedAt}-${target.id}`,
    targetName: target.name,
    capturedAt,
    pose,
    observer: await lastObserver(),
  });
}
