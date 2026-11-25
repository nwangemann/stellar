import { SKINS, themeForSkin, themes } from './tokens';

test('night theme emits no green or blue', () => {
  for (const c of [...Object.values(themes.night.color), themes.night.glow.color]) {
    expect(c).toMatch(/^#[0-9A-F]{2}0000$|^rgba\(\d+, 0, 0, [\d.]+\)$/);
  }
});

test('night theme uses the plain component art', () => {
  expect(themes.night.skin).toBe('default');
});
test('an unknown saved skin falls back to the default', () => {
  expect(themeForSkin('gone' as never)).toBe(themes.standard);
});

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};
// Solid tokens only. Text over live glass or the camera has to be judged on a device.
test.each(SKINS)('%s text meets 4.5:1 on solid colors', (skin) => {
  const { color } = themeForSkin(skin);
  expect(contrast(color.text, color.sky)).toBeGreaterThan(4.5);
  expect(contrast(color.textMuted, color.sky)).toBeGreaterThan(4.5);
  expect(contrast(color.onAccent, color.accent)).toBeGreaterThan(4.5);
});
