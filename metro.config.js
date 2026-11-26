// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// satellite.js lazily loads WebAssembly builds that need Node. Stellar uses only its JavaScript
// SGP4, so those imports resolve to nothing (ADR 18).
const WASM = new Set(['#wasm-single-thread', '#wasm-multi-thread']);
const resolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) =>
  WASM.has(moduleName)
    ? { type: 'empty' }
    : (resolveRequest ?? context.resolveRequest)(context, moduleName, platform);

module.exports = config;
