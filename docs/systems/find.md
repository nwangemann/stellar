# Find in sky

`FindButton` (`src/features/find`) is on search results; `FindInSky` wraps it for the details screens. It is disabled below the horizon. It stores a request in `src/state/find.ts` (not persisted) and returns to the sky screen.

The sky screen switches to Constellations or Stars, adds the wanted object to the lock targets and, when dragging, turns to it, instantly with Reduce Motion. The wanted object beats nearer ones to the lock. The request ends when its lock is lost, the user drags before the lock, the user picks a mode, or cancels. It must outlast reaching the object, or a faint star would lose its lock at once.

While the sky follows the phone, `FindArrow` leads there instead, with a panel to cancel. `arrowTo` in `src/core/projection/arrow.ts` places it: towards the object, the short way round, at the edge of the free part of the screen, or just short of the object once that is in view, since a faint one may not be drawn. It ends on lock-on and hides while aligning the compass; below the horizon the panel says so instead. The request records how the sky moved when it was made, because the sensors restart when the sky returns.

`aimAt` in `src/core/catalog/aim.ts` picks what to point at: the object itself, or for a constellation the line star nearest its middle among those that are up and lock on to it.
