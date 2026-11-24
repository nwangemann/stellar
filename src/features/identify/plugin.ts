import type { LayerPlugin } from '@/core/layers/types';
import { skyCard } from '@/features/sky/skyCard';

export const identifyPlugin: LayerPlugin = {
  id: 'identify',
  label: 'Identify',
  draw: (sky) => sky,
  lines: () => [],
  selectable: (sky) => sky.filter((o) => o.magnitude < 5),
  card: skyCard,
};
