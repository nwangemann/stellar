# Sky screen

`src/features/sky` composes backdrop, overlay, reticle, sheet and mode strip. `SkyLayer.web.tsx` loads CanvasKit first. It loads `public/canvaskit.wasm`, a copy of the file in `canvaskit-wasm`. Copy it again whenever Skia is upgraded.
