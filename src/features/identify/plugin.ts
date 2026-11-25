import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, skyTarget } from '@/features/sky/skyCard';

export const identifyPlugin: LayerPlugin = {
  id: 'identify',
  label: 'Stars',
  draw: (marks) => marks,
  lines: () => [],
  selects: (o) => o.magnitude < 4.5,
  target: skyTarget,
  card: skyCard,
};
