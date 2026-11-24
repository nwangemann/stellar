import { themes } from './tokens';

test('night theme emits no green or blue', () => {
  for (const c of [...Object.values(themes.night.color), themes.night.glow.color]) {
    expect(c).toMatch(/^#[0-9A-F]{2}0000$|^rgba\(\d+, 0, 0, [\d.]+\)$/);
  }
});
