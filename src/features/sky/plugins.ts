import type { LayerPlugin, ModeId } from '@/core/layers/types';
import { constellationsPlugin } from '@/features/constellations/plugin';
import { identifyPlugin } from '@/features/identify/plugin';
import { layersPlugin } from '@/features/layers/plugin';

/** Every mode, including hidden ones, so each keeps meeting the plugin contract. */
export const ALL_PLUGINS: readonly LayerPlugin[] = [
  identifyPlugin,
  constellationsPlugin,
  layersPlugin,
];

/** The modes on the mode strip. Layers is hidden until it has a real layer. */
export const PLUGINS: readonly LayerPlugin[] = [identifyPlugin, constellationsPlugin];

/** A saved mode that is now hidden falls back to Stars. */
export const pluginFor = (id: ModeId): LayerPlugin =>
  PLUGINS.find((p) => p.id === id) ?? identifyPlugin;
