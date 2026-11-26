import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, skyTarget } from '@/features/sky/skyCard';

/** Satellites over the stars. Only satellites are selected, so a bright star cannot take the lock. */
export const layersPlugin: LayerPlugin = {
  id: 'layers',
  label: 'Layers',
  draw: (marks) => marks,
  lines: () => [],
  selects: (o) => o.kind === 'satellite',
  target: skyTarget,
  card: skyCard,
};
