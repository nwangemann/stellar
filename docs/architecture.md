# Architecture

Stellar overlays the sky on the camera. It has two modes on screen (Stars and Constellations; a third, Layers, is hidden until it has content), reticle lock-on and a logbook of identified objects.

```mermaid
flowchart LR
  L[Location and time] --> S[Sky model]
  D[Device sensors] --> P[Pose]
  S --> J[Projection]
  P --> J
  F[Field of view] --> J
  J --> O[Overlay]
  M[Active layer plugin] --> O
```

- `src/core`: pure TypeScript. ESLint blocks React, Expo and app imports.
- `src/features`: one folder per feature. Modes implement `LayerPlugin`, whose `target` says whether a lock means a star or a constellation.
- `src/services`: adapters around native modules, with `.web` variants.
- `src/ui`: tokens and components. `src/state`: Zustand.
- `app`: thin Expo Router routes.

Pose lives in a Reanimated shared value so it never triggers React renders.
The sky comes from bundled data in `src/data` (ADR 13). Pose comes from `src/services/orientation` (ADR 16) through `useSensorPose`, or from dragging when sensors are off or unavailable.
