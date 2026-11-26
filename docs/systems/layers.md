# Layers mode

Layer plugin. Uses real stars. Will become a tray of toggleable layers; satellite passes are the planned first layer.

Hidden from the mode strip since 2026-11-25, because it has no layers yet. `ALL_PLUGINS` in `src/features/sky/plugins.ts` still lists it, so it keeps passing the plugin contract test; `PLUGINS` is what the strip shows. A saved `layers` mode falls back to Stars. To bring it back, add `layersPlugin` to `PLUGINS`.
