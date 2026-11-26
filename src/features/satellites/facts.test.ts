import { BUNDLED_SATELLITES } from '@/core/satellites/bundled';
import { deg } from '@/core/units';
import { satelliteFacts } from './facts';

const iss = BUNDLED_SATELLITES[0]!;
const observer = { lat: deg(40), lon: deg(-105) };
const at = (days: number) => ({
  observer,
  date: new Date(iss.epoch.getTime() + days * 86_400_000),
});

test('the ISS card gives height, speed, sunlight and the orbit age', () => {
  const facts = satelliteFacts(iss, at(2));
  expect(facts.map((f) => f.label)).toEqual(['Height', 'Speed', 'Sunlight', 'Orbit data']);
  const height = Number(facts[0]!.value.replace(/\D/g, ''));
  expect(height).toBeGreaterThan(350);
  expect(height).toBeLessThan(450);
  expect(facts[1]!.value).toMatch(/^7\.\d km\/s$/);
  expect(facts[3]!.value).toBe('2 days old');
});
test('orbit data past the limit, either way, carries a warning', () => {
  expect(satelliteFacts(iss, at(8))[3]!.value).toMatch(/^8 days old, too far to trust/);
  expect(satelliteFacts(iss, at(-8))[3]!.value).toMatch(/^8 days ahead, too far to trust/);
  expect(satelliteFacts(iss, at(6))[3]!.value).toBe('6 days old');
});
