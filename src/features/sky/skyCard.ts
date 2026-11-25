import type { SkyObject } from '@/core/catalog/types';
import type { InfoCard, Target } from '@/core/layers/types';
import { starFacts } from '@/features/stars/facts';

export function skyCard(o: SkyObject): InfoCard {
  return { title: o.name, rows: starFacts(o.id).slice(0, 3) };
}
export const starTarget = (o: SkyObject): Target => ({ kind: 'star', id: o.id, name: o.name });
