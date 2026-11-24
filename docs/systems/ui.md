# UI

`src/ui/tokens` holds the standard and night themes. A test checks that every night color has no green or blue.

Components: Text, GlassPanel, Button, Chip, Reticle, Sheet, ModeSwitcher and ScreenHeader. They read the theme through `useTheme`. System-drawn controls may ignore the theme, so check night vision on iOS when adding one.
