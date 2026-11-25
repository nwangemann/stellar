# Sky screen

`src/features/sky` composes backdrop, overlay, reticle, sheet and mode strip. `SkyLayer.web.tsx` loads CanvasKit first. It loads `public/canvaskit.wasm`, a copy of the file in `canvaskit-wasm`. Copy it again whenever Skia is upgraded.

`SkyCanvas` draws stars and lines in the style of the current look. `SkyFrame` adds decoration and takes no touches. The backdrop dims only when `useCameraAvailable` reports a usable camera.

`useDetailsZoom` runs the details transition (ADR 17): zoom in, open the details, and zoom out when the sky regains focus. Meanwhile the pose is held, controls are hidden and Find in sky waits. With Reduce Motion the details just open.

On iOS 18 and later, details open through `ZoomSource`, an invisible link at the object, because only a `Link` can start iOS's zoom transition. The source stays mounted so that closing can return to it. Elsewhere the sheet follows the sky zoom. Details opened from other screens do not zoom.
