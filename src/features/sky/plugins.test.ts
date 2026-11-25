import { createSky, DEMO_OBSERVER } from '@/core/catalog/sky';
import { PLUGINS } from './plugins';

test.each(PLUGINS.map((p) => [p.id, p] as const))('%s meets the plugin contract', (_id, plugin) => {
  const sky = createSky(DEMO_OBSERVER, new Date('2026-11-25T03:00:00Z'));
  const drawn = new Set(plugin.draw(sky).map((o) => o.id));
  const selectable = plugin.selectable(sky);
  expect(selectable.length).toBeGreaterThan(0);
  expect(selectable.every((o) => drawn.has(o.id))).toBe(true);
  expect(plugin.card(selectable[0]!).title).toBe(plugin.target(selectable[0]!).name);
});
