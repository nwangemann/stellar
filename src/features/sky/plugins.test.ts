import { createSky, DEMO_OBSERVER, MARKS } from '@/core/catalog/sky';
import { ALL_PLUGINS } from './plugins';

test.each(ALL_PLUGINS.map((p) => [p.id, p] as const))(
  '%s meets the plugin contract',
  (_id, plugin) => {
    const moment = { observer: DEMO_OBSERVER, date: new Date('2026-11-25T03:00:00Z') };
    const sky = createSky(moment.observer, moment.date);
    const drawn = new Set(plugin.draw(MARKS).map((o) => o.id));
    const selectable = sky.filter((o) => plugin.selects(o));
    expect(selectable.length).toBeGreaterThan(0);
    expect(selectable.every((o) => drawn.has(o.id))).toBe(true);
    expect(plugin.card(selectable[0]!, moment).title).toBe(plugin.target(selectable[0]!).name);
  },
);
