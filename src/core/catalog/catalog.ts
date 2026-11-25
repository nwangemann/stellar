import constellationData from '../../data/constellations.json';
import figureData from '../../data/figures.json';
import paperData from '../../data/papers.json';
import planetData from '../../data/planets.json';
import starData from '../../data/stars.json';
import type { RaDec } from '../astro/coordinates';
import { deg } from '../units';

export interface Star {
  readonly id: string;
  readonly name: string;
  readonly designation: string;
  readonly position: RaDec;
  readonly magnitude: number;
  readonly distanceParsecs: number | null;
  readonly spectralType: string | null;
  /** B−V colour index. */
  readonly colorIndex: number | null;
  /** Visual luminosity, Sun = 1. */
  readonly luminosity: number | null;
  readonly constellation: string | null;
}
export interface Constellation {
  readonly id: string;
  readonly name: string;
  readonly english: string;
  /** Chains of Hipparcos numbers. */
  readonly lines: readonly (readonly number[])[];
}
export interface Paper {
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly authors: string;
}
export interface Planet {
  readonly name: string;
  readonly year: number;
  readonly method: string;
  readonly periodDays: number | null;
}

type Row = [
  string,
  string,
  string,
  number,
  number,
  number,
  number | null,
  string | null,
  number | null,
  number | null,
  string | null,
];

export const STARS: readonly Star[] = (starData as Row[]).map((r) => ({
  id: r[0],
  name: r[1],
  designation: r[2],
  position: { kind: 'radec', ra: deg(r[3]), dec: deg(r[4]) },
  magnitude: r[5],
  distanceParsecs: r[6],
  spectralType: r[7],
  colorIndex: r[8],
  luminosity: r[9],
  constellation: r[10],
}));
export const CONSTELLATIONS: readonly Constellation[] = constellationData;

const starsById = new Map(STARS.map((s) => [s.id, s]));
const constellationsById = new Map(CONSTELLATIONS.map((c) => [c.id, c]));
export const starById = (id: string): Star | undefined => starsById.get(id);
export const constellationById = (id: string): Constellation | undefined =>
  constellationsById.get(id);

export const hipId = (hip: number): string => `hip-${hip}`;
export const papersFor = (id: string): readonly Paper[] =>
  (paperData as Record<string, Paper[]>)[id] ?? [];
export const planetsFor = (id: string): readonly Planet[] =>
  (planetData as Record<string, Planet[]>)[id] ?? [];
export const figureLines = (id: string): Constellation['lines'] =>
  (figureData as Record<string, number[][]>)[id] ?? [];

/** Line segments as pairs of star ids. */
export const segments = (lines: Constellation['lines']): [string, string][] =>
  lines.flatMap((chain) =>
    chain.slice(1).map((hip, i): [string, string] => [hipId(chain[i]!), hipId(hip)]),
  );
export const starsIn = (lines: Constellation['lines']): Star[] =>
  [...new Set(lines.flat())].flatMap((hip) => starById(hipId(hip)) ?? []);

/** Which figure each line star belongs to. Shared stars go to their own constellation. */
const figureOf = new Map<string, string>();
for (const c of CONSTELLATIONS) {
  for (const s of starsIn(c.lines)) {
    if (!figureOf.has(s.id) || s.constellation === c.id) figureOf.set(s.id, c.id);
  }
}
for (const s of starsIn(constellationById('Ple')?.lines ?? [])) figureOf.set(s.id, 'Ple');
export const constellationOf = (starId: string): Constellation | undefined =>
  constellationById(figureOf.get(starId) ?? '');
