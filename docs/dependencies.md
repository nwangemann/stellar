# Dependencies

npm is recorded in ADR 0008. `npm run docs:check` fails if this table and package.json differ.

## dependencies

| Package                          | Purpose                            | Licence | ADR  |
| -------------------------------- | ---------------------------------- | ------- | ---- |
| `@expo/metro-runtime`            | Web bundling runtime               | MIT     | 0009 |
| `@shopify/react-native-skia`     | Sky overlay rendering              | MIT     | 0004 |
| `astronomy-engine`               | Moon, Sun and planet positions     | MIT     | 0015 |
| `expo`                           | App framework                      | MIT     | 0002 |
| `expo-constants`                 | Expo Router requirement            | MIT     | 0002 |
| `expo-dev-client`                | Development builds                 | MIT     | 0002 |
| `expo-glass-effect`              | Native iOS glass in the Glass look | MIT     | 0014 |
| `expo-haptics`                   | Lock-on tap                        | MIT     | 0002 |
| `expo-linking`                   | Expo Router requirement            | MIT     | 0002 |
| `expo-location`                  | Location and true north            | MIT     | 0007 |
| `expo-router`                    | Navigation                         | MIT     | 0002 |
| `expo-sensors`                   | Device orientation                 | MIT     | 0016 |
| `expo-sqlite`                    | Logbook storage                    | MIT     | 0007 |
| `expo-status-bar`                | Status bar style                   | MIT     | 0002 |
| `react`                          | UI                                 | MIT     | 0002 |
| `react-dom`                      | Web preview                        | MIT     | 0009 |
| `react-native`                   | UI                                 | MIT     | 0002 |
| `react-native-gesture-handler`   | Drag and swipe                     | MIT     | 0004 |
| `react-native-mmkv`              | Settings storage                   | MIT     | 0007 |
| `react-native-nitro-image`       | VisionCamera requirement           | MIT     | 0003 |
| `react-native-nitro-modules`     | VisionCamera and MMKV requirement  | MIT     | 0003 |
| `react-native-reanimated`        | Animation and shared values        | MIT     | 0004 |
| `react-native-safe-area-context` | Safe areas                         | MIT     | 0002 |
| `react-native-screens`           | Navigation                         | MIT     | 0002 |
| `react-native-vision-camera`     | Camera                             | MIT     | 0003 |
| `react-native-web`               | Web preview                        | MIT     | 0009 |
| `react-native-worklets`          | Reanimated requirement             | MIT     | 0004 |
| `satellite.js`                   | Satellite orbits (SGP4)            | MIT     | 0018 |
| `zustand`                        | App state                          | MIT     | 0001 |

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
| `typescript`                      | Language        | Apache-2.0 | 0001 |

## Tools outside npm

Installed with Homebrew, not in package.json. Exports and commands are in the `stellar-dev` skill.

| Tool                  | Version   | Purpose                        | Licence    | ADR  |
| --------------------- | --------- | ------------------------------ | ---------- | ---- |
| Maestro CLI           | 2.12.1    | Simulator flows in `.maestro/` | Apache-2.0 | 0019 |
| OpenJDK 17 (Homebrew) | 17.0.21.1 | Java for Maestro               | GPL-2.0-CE | 0019 |
| OpenJDK 27 (Homebrew) | 27.0.1.1  | Pulled in by the Maestro tap   | GPL-2.0-CE | 0019 |
