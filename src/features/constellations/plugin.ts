import { constellationOf, CONSTELLATIONS, segments, starsIn } from '@/core/catalog/catalog';
import { aboveHorizon } from '@/core/catalog/sky';
import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, starTarget } from '@/features/sky/skyCard';
import { storiesFor } from './stories';

const SEGMENTS = CONSTELLATIONS.flatMap((c) => segments(c.lines));

export const constellationsPlugin: LayerPlugin = {
  id: 'constellations',
  label: 'Constellations',
  draw: (sky) => sky,
  lines: (sky) => {
    const byId = new Map(sky.map((o) => [o.id, o]));
    return SEGMENTS.flatMap(([a, b]) => {
      const p = byId.get(a);
      const q = byId.get(b);
      return p && q ? [[p, q] as const] : [];
    });
  },
  // Any star of a figure stands for the whole figure.
  selectable: (sky) => sky.filter((o) => constellationOf(o.id) && aboveHorizon(o)),
  target: (o) => {
    const c = constellationOf(o.id);
    return c ? { kind: 'constellation', id: c.id, name: c.name } : starTarget(o);
  },
  card: (o) => {
    const c = constellationOf(o.id);
    if (!c) return skyCard(o);
    const brightest = starsIn(c.lines).reduce((a, b) => (b.magnitude < a.magnitude ? b : a));
    const cultures = new Set(storiesFor(c.id).map((s) => s.culture)).size;
    return {
      title: c.name,
      rows: [
        { label: 'Meaning', value: c.english },
        { label: 'Brightest line star', value: brightest.name },
        { label: 'Stories', value: cultures ? `${cultures} cultures` : 'None bundled yet' },
      ],
    };
  },
};
