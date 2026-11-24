import type { LayerPlugin, ModeId } from '@/core/layers/types';
import { constellationsPlugin } from '@/features/constellations/plugin';
import { identifyPlugin } from '@/features/identify/plugin';
import { layersPlugin } from '@/features/layers/plugin';

export const PLUGINS: readonly LayerPlugin[] = [identifyPlugin, constellationsPlugin, layersPlugin];
export const pluginFor = (id: ModeId): LayerPlugin =>
  PLUGINS.find((p) => p.id === id) ?? identifyPlugin;
