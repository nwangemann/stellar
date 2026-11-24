import type { SkyObject } from '@/core/catalog/mockSky';
import type { InfoCard } from '@/core/layers/types';

export function skyCard(o: SkyObject): InfoCard {
  return {
    title: o.name,
    rows: [
      { label: 'Altitude', value: `${o.position.alt.toFixed(1)}°` },
      { label: 'Azimuth', value: `${o.position.az.toFixed(1)}°` },
      { label: 'Magnitude', value: o.magnitude.toFixed(1) },
    ],
  };
}
