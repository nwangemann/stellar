# Focus

`src/core/focus/lock.ts` is a pure state machine: 400 ms dwell, then lock. `useFocusLock` runs it every frame. A locked target keeps a wider release radius.
