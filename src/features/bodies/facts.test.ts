import { bodyDetails } from '@/core/astro/bodies';
import { deg } from '@/core/units';
import { bodyFacts, moonPhaseName } from './facts';

const newYork = { lat: deg(40.7128), lon: deg(-74.006) };
const moment = { observer: newYork, date: new Date('2026-11-24T15:00:00Z') };
const labels = (id: string) => bodyFacts(id, moment).map((f) => f.label);

test('the Sun sets in New York at the almanac time', () => {
  const { set } = bodyDetails('sun', moment);
  const almanac = Date.parse('2026-11-24T21:32:00Z');
  expect(Math.abs(set!.getTime() - almanac)).toBeLessThan(3 * 60_000);
});
test('facts give the next event first and no phase for the Sun', () => {
  expect(labels('sun')).toEqual(['Distance', 'Brightness', 'Sets', 'Rises']);
  expect(labels('moon')).toEqual(['Distance', 'Brightness', 'Phase', 'Rises', 'Sets']);
  expect(bodyFacts('nope', moment)).toEqual([]);
});
test('the Moon is full on 24 November 2026', () => {
  expect(bodyFacts('moon', moment)[2]!.value).toBe('Full, 100% lit');
});
test('the midnight Sun has no rise or set', () => {
  const polar = {
    observer: { lat: deg(80), lon: deg(0) },
    date: new Date('2026-06-21T00:00:00Z'),
  };
  expect(bodyDetails('sun', polar)).toMatchObject({ rise: null, set: null });
});
test.each([
  [358, 'New'],
  [45, 'Waxing crescent'],
  [90, 'First quarter'],
  [135, 'Waxing gibbous'],
  [225, 'Waning gibbous'],
  [270, 'Last quarter'],
  [340, 'Waning crescent'],
])('a Moon %d degrees past new is %s', (age, name) => {
  expect(moonPhaseName(age)).toBe(name);
});
