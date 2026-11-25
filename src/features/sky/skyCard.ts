import type { SkyObject } from '@/core/catalog/types';
import type { InfoCard, Target } from '@/core/layers/types';
import { starFacts } from '@/features/stars/facts';

export function skyCard(o: SkyObject): InfoCard {
  if (o.kind === 'body')
    return { title: o.name, rows: [{ label: 'Magnitude', value: o.magnitude.toFixed(1) }] };
  return { title: o.name, rows: starFacts(o.id).slice(0, 3) };
}
export const skyTarget = (o: SkyObject): Target => ({ kind: o.kind, id: o.id, name: o.name });
