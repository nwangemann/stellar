# Dependencies

npm is recorded in ADR 0008. `npm run docs:check` fails if this table and package.json differ.

## dependencies

| Package                          | Purpose                           | Licence | ADR  |
| -------------------------------- | --------------------------------- | ------- | ---- |
| `@expo/metro-runtime`            | Web bundling runtime              | MIT     | 0009 |
| `@shopify/react-native-skia`     | Sky overlay rendering             | MIT     | 0004 |
| `expo`                           | App framework                     | MIT     | 0002 |
| `expo-constants`                 | Expo Router requirement           | MIT     | 0002 |
| `expo-dev-client`                | Development builds                | MIT     | 0002 |
| `expo-haptics`                   | Lock-on tap                       | MIT     | 0002 |
| `expo-linking`                   | Expo Router requirement           | MIT     | 0002 |
| `expo-location`                  | Capture location                  | MIT     | 0007 |
| `expo-router`                    | Navigation                        | MIT     | 0002 |
| `expo-sqlite`                    | Logbook storage                   | MIT     | 0007 |
| `expo-status-bar`                | Status bar style                  | MIT     | 0002 |
| `react`                          | UI                                | MIT     | 0002 |
| `react-dom`                      | Web preview                       | MIT     | 0009 |
| `react-native`                   | UI                                | MIT     | 0002 |
| `react-native-gesture-handler`   | Drag and swipe                    | MIT     | 0004 |
| `react-native-mmkv`              | Settings storage                  | MIT     | 0007 |
| `react-native-nitro-image`       | VisionCamera requirement          | MIT     | 0003 |
| `react-native-nitro-modules`     | VisionCamera and MMKV requirement | MIT     | 0003 |
| `react-native-reanimated`        | Animation and shared values       | MIT     | 0004 |
| `react-native-safe-area-context` | Safe areas                        | MIT     | 0002 |
| `react-native-screens`           | Navigation                        | MIT     | 0002 |
| `react-native-vision-camera`     | Camera                            | MIT     | 0003 |
| `react-native-web`               | Web preview                       | MIT     | 0009 |
| `react-native-worklets`          | Reanimated requirement            | MIT     | 0004 |
| `zustand`                        | App state                         | MIT     | 0001 |

## devDependencies

| Package                           | Purpose         | Licence    | ADR  |
| --------------------------------- | --------------- | ---------- | ---- |
| `@commitlint/cli`                 | Quality tooling | MIT        | 0001 |
| `@commitlint/config-conventional` | Quality tooling | MIT        | 0001 |
| `@testing-library/react-native`   | Quality tooling | MIT        | 0001 |
| `@types/jest`                     | Quality tooling | MIT        | 0001 |
| `@types/react`                    | Quality tooling | MIT        | 0001 |
| `eslint`                          | Quality tooling | MIT        | 0001 |
| `eslint-config-expo`              | Quality tooling | MIT        | 0001 |
| `eslint-config-prettier`          | Quality tooling | MIT        | 0001 |
| `husky`                           | Quality tooling | MIT        | 0001 |
| `jest`                            | Quality tooling | MIT        | 0001 |
| `jest-expo`                       | Quality tooling | MIT        | 0001 |
| `prettier`                        | Quality tooling | MIT        | 0001 |
| `test-renderer`                   | Quality tooling | MIT        | 0001 |
| `typedoc`                         | API reference   | Apache-2.0 | 0008 |
| `typescript`                      | Language        | Apache-2.0 | 0001 |
