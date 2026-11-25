Stellar is an Expo/React Native app. Mobile first; iOS is tested first (ADR 11).

## Expo APIs

Expo changes every SDK release, so do not code from memory. Before using an Expo, EAS or React Native API:

1. Read the installed package's types in `node_modules`.
2. If they do not settle it, fetch only that API's page under `https://docs.expo.dev/versions/v<major>.0.0/`, with the major version of `expo` in `package.json`.
3. Use `https://docs.expo.dev/llms.txt` only to find a page you cannot locate. It is large, so search it for the topic.

## Rules

- Use npm and npx. Add packages with `npx expo install <package>`, never plain `npm install <package>`.
- Navigation is Expo Router. Every file in `app/` is a screen or a `_layout.tsx`; other code goes in `src/`.
- `ios/` and `android/` are generated. Never edit them; use `app.json` and config plugins.
- Adding native code means rebuilding the app with `npx expo run:ios`. Expo Go is not used.
- Prefer Expo modules over third-party libraries.
