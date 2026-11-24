const base = {
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 },
  radius: { sm: 8, md: 14, lg: 22, pill: 999 },
  type: { caption: 12, body: 15, title: 20, display: 32 },
  blur: { glass: 18 },
  hit: 44,
} as const;

const standard = {
  ...base,
  name: 'standard' as string,
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
  },
  glow: { color: '#8FC7FF', radius: 14 },
};

export type Theme = typeof standard;

/** Red only: no green or blue channel reaches the eye, which protects dark adaptation. */
const night: Theme = {
  ...base,
  name: 'night',
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
  },
  glow: { color: '#FF0000', radius: 10 },
};

export const themes = { standard, night };
