import { STARS } from './catalog';
import { GENITIVES } from './genitives';
import { search } from './search';

const first = (query: string) => search(query)[0]?.name;

test.each([
  ['sirius', 'Sirius'],
  ['  BETELG ', 'Betelgeuse'],
  ['jup', 'Jupiter'],
  ['orion', 'Orion'],
  ['Boötes', 'Boötes'],
  ['bootes', 'Boötes'],
  ['water bearer', 'Aquarius'],
  ['α CMa', 'Sirius'],
  ['alpha canis majoris', 'Sirius'],
  ['Alpha Centauri', 'Rigil Kentaurus'],
  ['alpha1 cen', 'Rigil Kentaurus'],
])('%s finds %s first', (query, name) => {
  // Catalog spelling may or may not carry the accent.
  const plain = (s?: string) => s?.normalize('NFD').replace(/[̀-ͯ]/g, '');
  expect(plain(first(query))).toBe(plain(name));
});
test('exact names come before longer ones, and brighter stars before fainter', () => {
  expect(
    search('m')
      .slice(0, 3)
      .map((r) => r.kind),
  ).toEqual(['body', 'body', 'body']);
  expect(search('alpha c')[0]?.name).toBe('Sirius');
});
test('blank or unknown text finds nothing, and the limit holds', () => {
  expect(search(' - ')).toEqual([]);
  expect(search('zzzz')).toEqual([]);
  expect(search('a', 5)).toHaveLength(5);
});
test('every constellation that stars name has a genitive', () => {
  const ids = STARS.flatMap((s) => s.constellation ?? []);
  expect(ids.filter((id) => !GENITIVES[id])).toEqual([]);
  expect(Object.keys(GENITIVES)).toHaveLength(88);
});
