import { starFacts } from './facts';

test('Betelgeuse facts come from the catalog', () => {
  const facts = Object.fromEntries(starFacts('hip-27989').map((f) => [f.label, f.value]));
  expect(facts.Distance).toBe('498 light-years');
  expect(facts.Color).toBe('red');
  expect(facts['Spectral type']).toBe('M2Ib');
});
test('an unknown star has no facts', () => {
  expect(starFacts('nope')).toEqual([]);
});
