# UI

`src/ui/tokens` holds the standard and night themes. A test checks that every night color has no green or blue.

Components: Text, GlassPanel, Button, IconButton, Chip, Reticle, Sheet, ModeSwitcher, Slider and ScreenHeader. They read the theme through `useTheme`. System-drawn controls may ignore the theme, so check night vision on iOS when adding one.

On the sky screen, Search, Time travel, Logbook, Settings and, while following the phone, compass alignment are round `IconButton`s at the top right, with the same surface as other buttons. Their icons are drawn with views, so there is no icon package.

## Time travel

The clock button opens `TimePanel`, below the top buttons: the time shown, a slider from 12 hours back to 24 hours ahead in steps of 10 minutes, with a tick at the present, and Now. The offset holds while the clock runs. Closing the panel or opening compass alignment returns to the present, so another time is never shown unlabelled and alignment always compares with the real sky. Cards and the body screen use the time shown.

`Slider` is drawn with views in every look. Its thumb moves on the UI thread; each step reaches React once.

## Looks

Settings has a look picker. `src/ui/skins` holds the art; see ADR 14. `useTheme` returns the chosen look, or the night theme while night vision is on. Components branch on `theme.skin`; `default` is the original code.

- `Backdrop` draws a shader behind each screen, at half resolution when animated. On the sky screen it follows the pose.
- iOS glass cannot sample other glass. Controls inside a glass panel draw their own pane (`OnGlass`), and a panel marked `dock` is dropped so its controls are glass themselves.
- Do not fade a parent of native glass. `Sheet` moves and scales instead, gently and without a bounce.
- Glass becomes solid with Reduce Transparency.
- Glass & chrome keeps the sky itself nearly plain. Full chrome shows only on other screens.
- The alien in Starship is part of `SkyFrame` and leans in during lock-on.

## Sky marks

`BodyMarks` draws the Sun (rays), the Moon (phase, with its bright limb towards the Sun), planets (ringed dot) and Saturn (tilted ring). Shapes differ, not just colors, so they survive night vision. Sizes are fixed and larger than life. Colors are the `sun`, `moon`, `moonDark` and `planet` tokens.

`SunWarning` uses the real Sun, not the time shown. It shows while the Sun is up and either the view is within 40° of it or the camera is on. The camera case ignores direction because sensor accuracy is unproven and dragging is not aiming; revisit it after the phone test (backlog step 8.5).
