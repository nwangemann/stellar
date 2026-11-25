import { Platform } from 'react-native';

const base = {
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 },
  radius: { sm: 8, md: 14, lg: 22, pill: 999 },
  type: { caption: 12, body: 15, title: 20, display: 32 },
  blur: { glass: 18 },
  hit: 44,
} as const;

export const SKINS = ['default', 'starship', 'glass', 'needlepoint'] as const;
export type SkinId = (typeof SKINS)[number];

const standard = {
  ...base,
  name: 'standard' as string,
  /** Selects the component art. Night vision keeps 'default', which is plain and red-safe. */
  skin: 'default' as SkinId,
  statusBar: 'light' as 'light' | 'dark',
  font: undefined as string | undefined,
  color: {
    sky: '#060912',
    text: '#EEF2FA',
    textMuted: '#A2AEC4',
    accent: '#8FC7FF',
    onAccent: '#06121F',
    glass: 'rgba(17, 24, 39, 0.82)',
    glassBorder: 'rgba(200, 220, 255, 0.18)',
    star: '#F4F7FF',
    line: 'rgba(143, 199, 255, 0.5)',
    sun: '#FFD45E',
    moon: '#F3EFE2',
    moonDark: '#2A3040',
    planet: '#FFC58A',
  },
  glow: { color: '#8FC7FF', radius: 14 },
};

export type Theme = typeof standard;

/** Red only: no green or blue channel reaches the eye, which protects dark adaptation. */
const night: Theme = {
  ...base,
  name: 'night',
  skin: 'default',
  statusBar: 'light',
  font: undefined,
  color: {
    sky: '#000000',
    text: '#FF0000',
    textMuted: '#B80000',
    accent: '#D00000',
    onAccent: '#000000',
    glass: 'rgba(20, 0, 0, 0.9)',
    glassBorder: 'rgba(255, 0, 0, 0.25)',
    star: '#FF0000',
    line: 'rgba(200, 0, 0, 0.55)',
    sun: '#FF0000',
    moon: '#E00000',
    moonDark: '#380000',
    planet: '#C80000',
  },
  glow: { color: '#FF0000', radius: 10 },
};

const starship: Theme = {
  ...base,
  name: 'starship',
  skin: 'starship',
  statusBar: 'light',
  font: Platform.select({ ios: 'Futura', default: 'sans-serif' }),
  color: {
    sky: '#07021A',
    text: '#EAFBFF',
    textMuted: '#B9B4E8',
    accent: '#7CFFCB',
    onAccent: '#04251B',
    glass: 'rgba(24, 12, 62, 0.86)',
    glassBorder: 'rgba(124, 255, 203, 0.45)',
    star: '#FDF6FF',
    line: 'rgba(255, 110, 220, 0.85)',
    sun: '#FFE45C',
    moon: '#EAFBFF',
    moonDark: '#2B1A5C',
    planet: '#FF9DE6',
  },
  glow: { color: '#7CFFCB', radius: 24 },
};

const glass: Theme = {
  ...base,
  name: 'glass',
  skin: 'glass',
  statusBar: 'light',
  font: undefined,
  color: {
    sky: '#0B0F16',
    text: '#FFFFFF',
    textMuted: '#D5DCE8',
    accent: '#DCEBFF',
    onAccent: '#0A111C',
    glass: 'rgba(255, 255, 255, 0.14)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    star: '#FFFFFF',
    line: 'rgba(226, 238, 255, 0.75)',
    sun: '#FFE9A8',
    moon: '#FFFFFF',
    moonDark: '#3A424F',
    planet: '#FFD9B0',
  },
  glow: { color: '#FFFFFF', radius: 18 },
};

/** A light theme on purpose: the sky as an embroidery sampler. */
const needlepoint: Theme = {
  ...base,
  name: 'needlepoint',
  skin: 'needlepoint',
  statusBar: 'dark',
  font: Platform.select({ ios: 'American Typewriter', default: 'serif' }),
  color: {
    sky: '#EFE4CC',
    text: '#33251C',
    textMuted: '#69503C',
    accent: '#A8322D',
    onAccent: '#FFF6E6',
    glass: '#F8EDD6',
    glassBorder: '#A8322D',
    star: '#27396B',
    line: '#A8322D',
    sun: '#D9992B',
    moon: '#FFF6E6',
    moonDark: '#69503C',
    planet: '#A8322D',
  },
  glow: { color: '#D9992B', radius: 10 },
};

export const themes = { standard, night, starship, glass, needlepoint };

/** Unknown values, such as a saved skin that was later removed, fall back to the default. */
export const themeForSkin = (skin: SkinId): Theme =>
  ({ default: standard, starship, glass, needlepoint })[skin] ?? standard;
