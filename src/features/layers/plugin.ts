import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, skyTarget } from '@/features/sky/skyCard';

export const layersPlugin: LayerPlugin = {
  id: 'layers',
  label: 'Layers',
  draw: (marks) => marks,
  lines: () => [],
  selects: (o) => o.magnitude < 3,
  target: skyTarget,
  card: skyCard,
};
