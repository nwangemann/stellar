import type { LayerPlugin } from '@/core/layers/types';
import { skyCard } from '@/features/sky/skyCard';

export const layersPlugin: LayerPlugin = {
  id: 'layers',
  label: 'Layers',
  draw: (sky) => sky,
  lines: () => [],
  selectable: (sky) => sky.filter((o) => o.magnitude < 3),
  card: skyCard,
};
