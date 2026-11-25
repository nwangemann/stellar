import { aboveHorizon } from '@/core/catalog/sky';
import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, skyTarget } from '@/features/sky/skyCard';

export const identifyPlugin: LayerPlugin = {
  id: 'identify',
  label: 'Stars',
  draw: (sky) => sky,
  lines: () => [],
  selectable: (sky) => sky.filter((o) => o.magnitude < 4.5 && aboveHorizon(o)),
  target: skyTarget,
  card: skyCard,
};
