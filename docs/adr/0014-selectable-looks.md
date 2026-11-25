# 14. Selectable looks

- Status: accepted for iteration
- Date: 2026-11-24

## Context

We want playful alternatives to the interface without changing the current one.

## Decision

A saved `skin` setting picks Default, Starship, Glass & chrome or Needlepoint. A skin is a theme in `src/ui/tokens` plus art in `src/ui/skins`. Default keeps its own code path in each component. Night vision overrides every skin with the plain red theme. Glass uses `expo-glass-effect`, which draws Apple's Liquid Glass on iOS 26; a drawn pane replaces it elsewhere.

The sky screen never draws invented stars or planets. Those appear only on other screens.

## Consequence

A new component needs a check in every skin. Text over live glass, chrome or the camera cannot be checked by the token contrast test. Animated backdrops cost battery; they stop on covered screens and with Reduce Motion.
