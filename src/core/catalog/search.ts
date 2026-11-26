import { BODY_IDS } from '../astro/bodies';
import { SATELLITE_ALIASES } from '../satellites/names';
import type { Satellite } from '../satellites/orbit';
import { CONSTELLATIONS, starById } from './catalog';
import { GENITIVES } from './genitives';
import { BODY_NAMES, MARKS } from './sky';

export interface SearchResult {
  readonly kind: 'star' | 'constellation' | 'body' | 'satellite';
  readonly id: string;
  readonly name: string;
  /** A second name, such as a star's designation. Null if it would repeat the name. */
  readonly detail: string | null;
}

const LETTERS = 'αβγδεζηθικλμνξοπρστυφχψω';
const LETTER_NAMES =
  'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega'.split(
    ' ',
  );

/** Lower case words without accents, with Greek letters spelled out and superscripts as digits. */
const normalize = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ'’]/g, '')
    .toLowerCase()
    .replace(/[α-ω]/g, (letter) => LETTER_NAMES[LETTERS.indexOf(letter)] ?? letter)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** "α¹ Cen" is also "alpha cen" and "alpha centauri". */
function designationKeys(designation: string): string[] {
  const full = normalize(designation);
  const plain = full.replace(/^([a-z]+)\d+ /, '$1 ');
  const [, abbreviation = ''] = designation.split(' ');
  const genitive = GENITIVES[abbreviation];
  return [full, plain].flatMap((key) =>
    genitive ? [key, `${key.split(' ')[0]} ${normalize(genitive)}`] : [key],
  );
}

interface Entry {
  readonly result: SearchResult;
  readonly keys: readonly string[];
}

/** In order of preference: bodies, constellations, then stars from bright to faint. */
function buildIndex(): Entry[] {
  const bodies = BODY_IDS.map((id): Entry => ({
    result: { kind: 'body', id, name: BODY_NAMES[id], detail: null },
    keys: [normalize(BODY_NAMES[id])],
  }));
  const constellations = CONSTELLATIONS.map(({ id, name, english }): Entry => ({
    result: { kind: 'constellation', id, name, detail: english === name ? null : english },
    keys: [normalize(name), normalize(english)],
  }));
  const stars = MARKS.flatMap((mark) => (mark.kind === 'star' ? (starById(mark.id) ?? []) : []))
    .sort((a, b) => a.magnitude - b.magnitude)
    .map(({ id, name, designation }): Entry => ({
      result: { kind: 'star', id, name, detail: designation === name ? null : designation },
      keys: [normalize(name), ...designationKeys(designation)],
    }));
  return [...bodies, ...constellations, ...stars];
}

/** Lower is better: the whole key, its start, the start of a later word, or null for no match. */
function rank(keys: readonly string[], query: string): number | null {
  if (keys.includes(query)) return 0;
  if (keys.some((key) => key.startsWith(query))) return 1;
  if (keys.some((key) => key.includes(` ${query}`))) return 2;
  return null;
}

let index: Entry[] | undefined;

/** Satellites change with fetched orbits, so they are indexed on each search. */
const satelliteEntries = (satellites: readonly Satellite[]): Entry[] =>
  satellites.map(({ id, name }): Entry => {
    const aliases = SATELLITE_ALIASES[id] ?? [];
    return {
      result: { kind: 'satellite', id, name, detail: aliases[0] ?? null },
      keys: [normalize(name), ...aliases.map(normalize)],
    };
  });

/** Finds drawn objects by name, best match first. Satellites come after bodies. */
export function search(
  query: string,
  limit = 30,
  satellites: readonly Satellite[] = [],
): SearchResult[] {
  const wanted = normalize(query);
  if (!wanted) return [];
  index ??= buildIndex();
  const bodies = index.filter((e) => e.result.kind === 'body');
  const rest = index.slice(bodies.length);
  const ranked: SearchResult[][] = [[], [], []];
  for (const { result, keys } of [...bodies, ...satelliteEntries(satellites), ...rest]) {
    const r = rank(keys, wanted);
    if (r !== null) ranked[r]!.push(result);
  }
  return ranked.flat().slice(0, limit);
}
