import { CHANCE, COOLDOWN_MS, LINES, pickVisit, shouldVisit } from './visits';

test('a visit needs both luck and a finished cooldown', () => {
  const lucky = () => 0;
  expect(shouldVisit(Infinity, lucky)).toBe(true);
  expect(shouldVisit(COOLDOWN_MS - 1, lucky)).toBe(false);
  expect(shouldVisit(Infinity, () => CHANCE)).toBe(false);
});
test('a line is never repeated back to back', () => {
  for (const r of [0, 0.3, 0.6, 0.999]) {
    const first = pickVisit(undefined, () => r);
    expect(LINES).toContain(first.line);
    expect(pickVisit(first, () => r).line).not.toBe(first.line);
  }
});
