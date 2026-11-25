import { aboveHorizon } from '@/core/catalog/sky';
import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, skyTarget } from '@/features/sky/skyCard';

export const layersPlugin: LayerPlugin = {
  id: 'layers',
  label: 'Layers',
  draw: (sky) => sky,
  lines: () => [],
  selectable: (sky) => sky.filter((o) => o.magnitude < 3 && aboveHorizon(o)),
  target: skyTarget,
  card: skyCard,
};
