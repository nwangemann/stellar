import type { Moment } from '@/core/astro/coordinates';
import type { SkyObject } from '@/core/catalog/types';
import type { InfoCard, Target } from '@/core/layers/types';
import { bodyFacts } from '@/features/bodies/facts';
import { starFacts } from '@/features/stars/facts';

export function skyCard(o: SkyObject, moment: Moment): InfoCard {
  if (o.kind === 'body') return { title: o.name, rows: bodyFacts(o.id, moment).slice(0, 4) };
  return { title: o.name, rows: starFacts(o.id).slice(0, 3) };
}
export const skyTarget = (o: SkyObject): Target => ({ kind: o.kind, id: o.id, name: o.name });
