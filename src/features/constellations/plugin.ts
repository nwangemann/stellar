import { constellationOf, CONSTELLATIONS, segments, starsIn } from '@/core/catalog/catalog';
import type { SkyMark } from '@/core/catalog/types';
import type { LayerPlugin } from '@/core/layers/types';
import { skyCard, skyTarget } from '@/features/sky/skyCard';
import { storiesFor } from './stories';

const SEGMENTS = CONSTELLATIONS.flatMap((c) => segments(c.lines));

export const constellationsPlugin: LayerPlugin = {
  id: 'constellations',
  label: 'Constellations',
  draw: (marks) => marks,
  lines: (marks) => {
    const byId = new Map<string, SkyMark>(marks.map((o) => [o.id, o]));
    return SEGMENTS.flatMap(([a, b]) => {
      const p = byId.get(a);
      const q = byId.get(b);
      return p && q ? [[p, q] as const] : [];
    });
  },
  // Any star of a figure stands for the whole figure.
  selects: (o) => !!constellationOf(o.id),
  target: (o) => {
    const c = constellationOf(o.id);
    return c ? { kind: 'constellation', id: c.id, name: c.name } : skyTarget(o);
  },
  card: (o, moment) => {
    const c = constellationOf(o.id);
    if (!c) return skyCard(o, moment);
    const brightest = starsIn(c.lines).reduce((a, b) => (b.magnitude < a.magnitude ? b : a));
    const cultures = new Set(storiesFor(c.id).map((s) => s.culture)).size;
    return {
      title: c.name,
      rows: [
        { label: 'Meaning', value: c.english },
        { label: 'Brightest line star', value: brightest.name },
        ...(cultures
          ? [{ label: 'Stories', value: `${cultures} ${cultures === 1 ? 'culture' : 'cultures'}` }]
          : []),
      ],
    };
  },
};
