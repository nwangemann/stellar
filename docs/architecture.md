# Architecture

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
- `src/features`: one folder per feature. Modes implement `LayerPlugin`.
- `src/services`: adapters around native modules, with `.web` variants.
- `src/ui`: tokens and components. `src/state`: Zustand.
- `app`: thin Expo Router routes.

Pose lives in a Reanimated shared value so it never triggers React renders.
Until phase 5 the sky is mock data and pose comes from dragging.
