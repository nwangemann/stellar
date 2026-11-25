# Focus

`src/core/focus/lock.ts` is a pure state machine: 400 ms dwell, then lock. `useFocusLock` runs it every frame. A locked target keeps a wider release radius. While [Find in sky](find.md) wants an object, that object takes this preference.
