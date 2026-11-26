import { createSky, DEMO_OBSERVER, MARKS } from '@/core/catalog/sky';
import { BUNDLED_SATELLITES } from '@/core/satellites/bundled';
import { satelliteMarks } from '@/core/satellites/sky';
import { PLUGINS } from './plugins';

const moment = { observer: DEMO_OBSERVER, date: new Date('2026-11-25T03:00:00Z') };
const sky = createSky(moment.observer, moment.date, BUNDLED_SATELLITES);
const marks = [...MARKS, ...satelliteMarks(BUNDLED_SATELLITES)];

test.each(PLUGINS.map((p) => [p.id, p] as const))('%s meets the plugin contract', (_id, plugin) => {
  const drawn = new Set(plugin.draw(marks).map((o) => o.id));
  const selectable = sky.filter((o) => plugin.selects(o));
  expect(selectable.length).toBeGreaterThan(0);
  expect(selectable.every((o) => drawn.has(o.id))).toBe(true);
  expect(plugin.card(selectable[0]!, moment).title).toBe(plugin.target(selectable[0]!).name);
});
test('only Layers draws and selects satellites', () => {
  for (const plugin of PLUGINS) {
    const layers = plugin.id === 'layers';
    expect(plugin.draw(marks).some((m) => m.kind === 'satellite')).toBe(layers);
    expect(sky.some((o) => o.kind === 'satellite' && plugin.selects(o))).toBe(layers);
  }
});
