import type { LayerPlugin } from '@/core/layers/types';
import { skyCard } from '@/features/sky/skyCard';

export const constellationsPlugin: LayerPlugin = {
  id: 'constellations',
  label: 'Constellations',
  draw: (sky) => sky,
  lines: (sky) => {
    // Placeholder: join bright mock stars that happen to be near each other.
    const bright = sky.filter((o) => o.magnitude < 2.5);
    return bright.flatMap((a, i) =>
      bright
        .slice(i + 1)
        .filter(
          (b) => Math.hypot(a.position.alt - b.position.alt, a.position.az - b.position.az) < 14,
        )
        .slice(0, 2)
        .map((b) => [a, b] as const),
    );
  },
  selectable: (sky) => sky.filter((o) => o.magnitude < 2.5),
  card: skyCard,
};
