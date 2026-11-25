# UI

`src/ui/tokens` holds the standard and night themes. A test checks that every night color has no green or blue.

Components: Text, GlassPanel, Button, Chip, Reticle, Sheet, ModeSwitcher and ScreenHeader. They read the theme through `useTheme`. System-drawn controls may ignore the theme, so check night vision on iOS when adding one.

## Looks

Settings has a look picker. `src/ui/skins` holds the art; see ADR 14. `useTheme` returns the chosen look, or the night theme while night vision is on. Components branch on `theme.skin`; `default` is the original code.

- `Backdrop` draws a shader behind each screen, at half resolution when animated. On the sky screen it follows the pose.
- iOS glass cannot sample other glass. Controls inside a glass panel draw their own pane (`OnGlass`), and a panel marked `dock` is dropped so its controls are glass themselves.
- Do not fade a parent of native glass. `Sheet` scales instead.
- Glass becomes solid with Reduce Transparency.
- Glass & chrome keeps the sky itself nearly plain. Full chrome shows only on other screens.
- `Visitor` is a rare random alien on the Starship sky screen, with odds in `visits.ts`. It stays away during lock-on, leaves on a tap and is hidden from screen readers.
